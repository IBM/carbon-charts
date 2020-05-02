// Internal Imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import * as Configuration from "../../configuration";
import { Events, TooltipTypes, Roles } from "../../interfaces";
import { Tools } from "../../tools";
import { flatMapDeep, kebabCase } from "lodash-es";
import {
	Point,
	Angle,
	radialLabelPlacement,
	radToDeg,
	degToRad,
	polarToCartesianCoords,
	distanceBetweenPointOnCircAndVerticalDiameter
} from "../../services/angle-utils";

// D3 Imports
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { min, max, extent } from "d3-array";
import { lineRadial, curveLinearClosed } from "d3-shape";

const DEBUG = false;

interface Datum {
	group?: string;
	key: string;
	value: number;
}

export class Radar extends Component {
	type = "radar";
	groupMapsTo: string;
	uniqKeys: string[];
	uniqGroups: string[];
	displayDataNormalized: Array<Datum>;
	groupedDataNormalized: any;

	init() {
		const { events } = this.services;
		// Highlight correct line legend item hovers
		events.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
		// Un-highlight lines on legend item mouseouts
		events.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
	}

	render(animate = true) {
		const self = this;

		/////////////////////////////
		// Containers
		/////////////////////////////
		const svg = this.getContainerSVG();
		const { width, height } = DOMUtils.getSVGElementSize(this.parent, { useAttrs: true });
		if (!width || !height) {
			return;
		}
		// console.log("\n");
		// console.log({ width, height });

		const fontSize = 30; // TODO: mmm, probably there is a better way to do that
		const margin = 2 * fontSize;
		const size = Math.min(width, height);
		const diameter = size - margin;
		const radius = diameter / 2;
		const xLabelPadding = 10;
		const yLabelPadding = 5;
		const yTicksNumber = 4; // TODO: probably there are a default constant for that value
		const minRange = 10;
		const xAxisRectHeight = 50;

		const data: Array<Datum> = this.model.getData();
		const displayData: Array<Datum> = this.model.getDisplayData();
		const groupedData = this.model.getGroupedData();
		const options = this.model.getOptions();
		const configuration = Configuration.options.radarChart.radar;

		this.groupMapsTo = options.data.groupMapsTo;
		this.uniqKeys = Array.from(new Set(data.map(d => d.key)));
		this.uniqGroups = Array.from(new Set(displayData.map(d => d[this.groupMapsTo])));
		this.displayDataNormalized = this.normalizeFlatData(displayData);
		this.groupedDataNormalized = this.normalizeGroupedData(groupedData);

		// console.log("animate:", animate);
		// console.log("data:", data);
		// console.log("displayData:", displayData);
		// console.log("groupedData:", groupedData);
		// console.log("options:", options);
		// console.log("configuration:", configuration);
		// console.log("groupMapsTo:", this.groupMapsTo);

		/////////////////////////////
		// Computations
		/////////////////////////////

		// given a key, return the corrisponding angle in radiants
		// rotated by -PI/2 because we want angle 0° at -y (12 o’clock)
		const xScale = scaleBand<string>()
			.domain(this.displayDataNormalized.map(d => d.key))
			.range([0, 2 * Math.PI].map(a => a - Math.PI / 2) as [Angle, Angle]);
		// console.log(`xScale [${xScale.domain()}] -> [${xScale.range()}]`);

		const yScale = scaleLinear()
			.domain([0, max(this.displayDataNormalized.map(d => d.value))])
			.range([minRange, radius])
			.nice(yTicksNumber);
		const yTicks = yScale.ticks(yTicksNumber);
		// console.log(`yScale [${yScale.domain()}] -> [${yScale.range()}]`);

		const colorScale = (group: string): string => this.model.getFillColor(group);

		// constructs a new radial line generator
		// the angle accessor returns the angle in radians with 0° at -y (12 o’clock)
		// so map back the angle
		const radialLineGenerator = lineRadial<Datum>()
		.angle(d => xScale(d.key) + Math.PI / 2)
		.radius(d => yScale(d.value))
		.curve(curveLinearClosed);

		// compute the space that each x label needs
		const horizSpaceNeededByEachXLabel = this.uniqKeys.map(key => {
			// append temporarily the label to get the exact space that it occupies
			const tmpTick = DOMUtils.appendOrSelect(svg, `g.tmp-tick`);
			const tmpTickText = DOMUtils.appendOrSelect(tmpTick, `text`).text(key);
			const tickWidth = DOMUtils.getSVGElementSize(tmpTickText.node(), { useBBox: true }).width;
			tmpTick.remove();
			// compute the distance between the point that the label rapresents and the vertical diameter
			const distPointDiam = distanceBetweenPointOnCircAndVerticalDiameter(xScale(key), radius);
			// the space each label occupies is the sum of these two values
			return tickWidth + distPointDiam;
		});
		const leftPadding = max(horizSpaceNeededByEachXLabel);

		// center coordinates
		const c: Point = {
			x: leftPadding + xLabelPadding,
			y: height / 2
		};

		/////////////////////////////
		// Draw
		/////////////////////////////

		if (DEBUG) {
			const debugContainer = DOMUtils.appendOrSelect(svg, "g.debug");
			const backdropRect = DOMUtils.appendOrSelect(debugContainer, "rect.backdrop")
				.attr("width", "100%")
				.attr("height", "100%")
				.attr("stroke", "gold")
				.attr("opacity", 0.2)
				.attr("fill", "none");
			const center = DOMUtils.appendOrSelect(debugContainer, "circle.center")
				.attr("cx", c.x)
				.attr("cy", c.y)
				.attr("r", 2)
				.attr("opacity", 0.2)
				.attr("fill", "gold");
			const circumferences = DOMUtils.appendOrSelect(debugContainer, "g.circumferences");
			const circumferencesUpdate = circumferences.selectAll("circle").data(yTicks);
			circumferencesUpdate
				.enter()
				.append("circle")
				.merge(circumferencesUpdate)
				.attr("cx", c.x)
				.attr("cy", c.y)
				.attr("r", tick => yScale(tick))
				.attr("fill", "none")
				.attr("opacity", 0.2)
				.attr("stroke", "gold");
			circumferencesUpdate.exit().remove();
		}
		///////////////

		// y axes
		const yAxes = DOMUtils.appendOrSelect(svg, "g.y-axes").attr("role", Roles.GROUP);
		const yAxisUpdate = yAxes.selectAll("path").data(yTicks, tick => tick);
		yAxisUpdate.join(
			enter => enter.append("path").attr("role", Roles.GRAPHICS_SYMBOL),
			update => update,
			exit => exit.remove()
		)
		.attr("transform", `translate(${c.x}, ${c.y})`)
		.attr("d", tick => {
			// for each tick, create array of data corrisponding to the points composing the shape
			const yShapeData = this.uniqKeys.map(key => ({ key, value: tick }));
			return radialLineGenerator(yShapeData);
		})
		.attr("fill", "none");

		// y labels (show only the min and the max labels)
		const yLabels = DOMUtils.appendOrSelect(svg, "g.y-labels").attr("role", Roles.GROUP);
		const yLabelUpdate = yLabels.selectAll("text").data(extent(yTicks));
		yLabelUpdate.join(
			enter => enter.append("text"),
			update => update,
			exit => exit.remove()
		)
		.text(tick => tick)
		.attr("x", tick => polarToCartesianCoords(- Math.PI / 2, yScale(tick), c).x + yLabelPadding)
		.attr("y", tick => polarToCartesianCoords(- Math.PI / 2, yScale(tick), c).y)
		.style("text-anchor", "start")
		.style("dominant-baseline", "middle");

		// x axes
		const xAxes = DOMUtils.appendOrSelect(svg, "g.x-axes").attr("role", Roles.GROUP);
		const xAxisUpdate = xAxes.selectAll("line").data(this.uniqKeys, key => key);
		xAxisUpdate.join(
			enter => enter.append("line").attr("role", Roles.GRAPHICS_SYMBOL),
			update => update,
			exit => exit.remove()
		)
		.attr("class", key => `x-axis-${kebabCase(key)}`) // replace spaces with -
		.attr("stroke-dasharray", "0")
		.attr("x1", key => polarToCartesianCoords(xScale(key), yScale.range()[0], c).x)
		.attr("y1", key => polarToCartesianCoords(xScale(key), yScale.range()[0], c).y)
		.attr("x2", key => polarToCartesianCoords(xScale(key), yScale.range()[1], c).x)
		.attr("y2", key => polarToCartesianCoords(xScale(key), yScale.range()[1], c).y);

		// x labels
		const xLabels = DOMUtils.appendOrSelect(svg, "g.x-labels").attr("role", Roles.GROUP);
		const xLabelUpdate = xLabels.selectAll("text").data(this.uniqKeys);
		xLabelUpdate.join(
			enter => enter.append("text"),
			update => update,
			exit => exit.remove()
		)
		.text(key => DEBUG ? `${key} ${radToDeg(xScale(key))}° <-- ${radToDeg(xScale(key) + Math.PI / 2)}°` : key)
		.attr("x", key => polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).x)
		.attr("y", key => polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).y)
		.style("text-anchor", key => radialLabelPlacement(xScale(key)).textAnchor)
		.style("dominant-baseline", key => radialLabelPlacement(xScale(key)).dominantBaseline);

		// blobs
		const blobs = DOMUtils.appendOrSelect(svg, "g.blobs").attr("role", Roles.GROUP);
		const blobUpdate = blobs.selectAll("path").data(this.groupedDataNormalized, group => group.name);
		blobUpdate.join(
			enter => enter.append("path").attr("role", Roles.GRAPHICS_SYMBOL),
			update => update,
			exit => exit.remove()
		)
		.attr("class", "blob")
		.attr("transform", `translate(${c.x}, ${c.y})`)
		.attr("d", group => radialLineGenerator(group.data))
		.attr("fill", group => colorScale(group.name))
		.style("fill-opacity", configuration.opacity.selected)
		.attr("stroke", group => colorScale(group.name));

		// data dots
		const dots = DOMUtils.appendOrSelect(svg, "g.dots").attr("role", Roles.GROUP);
		const dotsUpdate = dots.selectAll("circle").data(this.displayDataNormalized);
		dotsUpdate.join(
			enter => enter.append("circle").attr("role", Roles.GRAPHICS_SYMBOL),
			update => update,
			exit => exit.remove()
		)
		.attr("class", d => kebabCase(d.key))
		.attr("cx", d => polarToCartesianCoords(xScale(d.key), yScale(d.value), c).x)
		.attr("cy", d => polarToCartesianCoords(xScale(d.key), yScale(d.value), c).y)
		.attr("r", 0)
		.attr("opacity", 0)
		.attr("fill", d => colorScale(d[this.groupMapsTo]));

		// rectangles
		const xAxesRect = DOMUtils.appendOrSelect(svg, "g.x-axes-rect").attr("role", Roles.GROUP);
		const xAxisRectUpdate = xAxesRect.selectAll("rect").data(this.uniqKeys);
		xAxisRectUpdate.join(
			enter => enter.append("rect").attr("role", Roles.GRAPHICS_SYMBOL),
			update => update,
			exit => exit.remove()
		)
		.attr("x", c.x)
		.attr("y", c.y - xAxisRectHeight / 2)
		.attr("width", yScale.range()[1])
		.attr("height", xAxisRectHeight)
		.attr("fill", "red")
		.style("fill-opacity", DEBUG ? 0.1 : 0)
		.attr("transform", key => `rotate(${radToDeg(xScale(key))}, ${c.x}, ${c.y})`);

		// Add event listeners
		this.addEventListeners();
	}

	// Given a flat array of objects, if there are missing data on key,
	// creates corrisponding data with value = 0
	normalizeFlatData = (dataset: Array<Datum>) => {
		const completeBlankData = flatMapDeep(this.uniqKeys.map(key => {
			return this.uniqGroups.map(group => ({ key, [this.groupMapsTo]: group, value: null }));
		}));
		return Tools.merge(completeBlankData, dataset);
	}

	// Given a a grouped array of objects, if there are missing data on key,
	// creates corrisponding data with value = 0
	normalizeGroupedData = (dataset: any) => {
		return dataset.map(({ name, data }) => {
			const completeBlankData = this.uniqKeys.map(k => ({ [this.groupMapsTo]: name, key: k, value: null }));
			return { name, data: Tools.merge(completeBlankData, data) };
		});
	}

	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;
		const { opacity } = Configuration.options.radarChart.radar;
		this.parent.selectAll("g.blobs path")
			.transition(this.services.transitions.getTransition("legend-hover-blob"))
			.style("fill-opacity", group => {
				if (group.name !== hoveredElement.datum().name) {
					return opacity.unselected;
				}
				return opacity.selected;
			});
	}

	handleLegendMouseOut = (event: CustomEvent) => {
		const { opacity } = Configuration.options.radarChart.radar;
		this.parent.selectAll("g.blobs path")
			.transition(this.services.transitions.getTransition("legend-mouseout-blob"))
			.style("fill-opacity", opacity.selected);
	}

	destroy() {
		// Remove event listeners
		this.parent.selectAll(".x-axes-rect > rect")
			.on("mouseover", null)
			.on("mousemove", null)
			.on("mouseout", null);
		// Remove legend listeners
		const eventsFragment = this.services.events;
		eventsFragment.removeEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
		eventsFragment.removeEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
	}

	addEventListeners() {
		const self = this;

		// events on x axes rects
		this.parent.selectAll(".x-axes-rect > rect")
			.on("mouseover", function(datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Radar.X_AXIS_MOUSEOVER, {
					element: select(this),
					datum
				});
			})
			.on("mousemove", function(datum) {
				const hoveredElement = select(this);
				const axisLine = self.parent.select(`.x-axes .x-axis-${kebabCase(datum)}`);
				const dots = self.parent.selectAll(`.dots circle.${kebabCase(datum)}`);

				// Change style
				axisLine.classed("hovered", true)
					.attr("stroke-dasharray", "4 4");
				dots.classed("hovered", true)
					.transition(self.services.transitions.getTransition("radar_dots_mouseover"))
					.attr("opacity", 1)
					.attr("r", 5);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Radar.X_AXIS_MOUSEMOVE, {
					element: hoveredElement,
					datum
				});

				// get the items that should be highlighted
				const itemsToHighlight = self.displayDataNormalized.filter(d => d.key === datum);

				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					multidata: itemsToHighlight,
					type: TooltipTypes.GRIDLINE
				});
			})
			.on("click", function(datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Radar.X_AXIS_CLICK, {
					element: select(this),
					datum
				});
			})
			.on("mouseout", function(datum) {
				const hoveredElement = select(this);
				const axisLine = self.parent.select(`.x-axes .x-axis-${kebabCase(datum)}`);
				const dots = self.parent.selectAll(`.dots circle.${kebabCase(datum)}`);

				// Change style
				axisLine.classed("hovered", false)
					.attr("stroke-dasharray", "0");
				dots.classed("hovered", false)
					.transition(self.services.transitions.getTransition("radar_dots_mouseout"))
					.attr("opacity", 0)
					.attr("r", 0);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Radar.X_AXIS_MOUSEOUT, {
					element: hoveredElement,
					datum
				});

				// Hide tooltip
				self.services.events.dispatchEvent("hide-tooltip", { hoveredElement });
				self.services.events.dispatchEvent(Events.Tooltip.HIDE, { hoveredElement });
			});
	}
}
