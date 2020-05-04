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
	polarToCartesianCoords,
	distanceBetweenPointOnCircAndVerticalDiameter
} from "../../services/angle-utils";

// D3 Imports
import { select } from "d3-selection";
import { scaleBand, scaleLinear, ScaleLinear } from "d3-scale";
import { max, extent } from "d3-array";
import { lineRadial, curveLinearClosed } from "d3-shape";

const DEBUG = false;

// used to make transitions
let oldYScale: ScaleLinear<number, number>;

interface Datum {
	group?: string;
	key: string;
	value: number;
}
interface GroupedDatum {
	name: string;
	data: Array<Datum>;
}

export class Radar extends Component {
	type = "radar";
	svg: SVGElement;
	groupMapsTo: string;
	uniqKeys: string[];
	uniqGroups: string[];
	displayDataNormalized: Array<Datum>;
	groupedDataNormalized: Array<GroupedDatum>;

	init() {
		const { events } = this.services;
		// Highlight correct line legend item hovers
		events.addEventListener(Events.Legend.ITEM_HOVER, this.handleLegendOnHover);
		// Un-highlight lines on legend item mouseouts
		events.addEventListener(Events.Legend.ITEM_MOUSEOUT, this.handleLegendMouseOut);
	}

	render(animate = true) {
		const self = this;

		this.svg = this.getContainerSVG();
		const { width, height } = DOMUtils.getSVGElementSize(this.parent, { useAttrs: true });
		if (!width || !height) {
			return;
		}

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

		const xLabelPadding = 10;
		const yLabelPadding = 8;
		const labelHeight = this.labelDimensions(this.uniqKeys[0]).height;
		const margin = 2 * (labelHeight + yLabelPadding);
		const size = Math.min(width, height);
		const diameter = size - margin;
		const radius = diameter / 2;
		const yTicksNumber = 4;
		const minRange = 10;
		const xAxisRectHeight = 50;

		// given a key, return the corrisponding angle in radiants
		// rotated by -PI/2 because we want angle 0° at -y (12 o’clock)
		const xScale = scaleBand<string>()
			.domain(this.displayDataNormalized.map(d => d.key))
			.range([0, 2 * Math.PI].map(a => a - Math.PI / 2) as [Angle, Angle]);

		const yScale = scaleLinear()
			.domain([0, max(this.displayDataNormalized.map(d => d.value))])
			.range([minRange, radius])
			.nice(yTicksNumber);
		const yTicks = yScale.ticks(yTicksNumber);

		const colorScale = (group: string): string => this.model.getFillColor(group);

		// constructs a new radial line generator
		// the angle accessor returns the angle in radians with 0° at -y (12 o’clock)
		// so map back the angle
		const radialLineGenerator = lineRadial<Datum>()
			.angle(d => xScale(d.key) + Math.PI / 2)
			.radius(d => yScale(d.value))
			.curve(curveLinearClosed);

		// this line generator is necessary in order to make a transition of a value from the
		// position it occupies using the old scale to the position it occupies using the new scale
		const oldRadialLineGenerator = lineRadial<Datum>()
			.angle(radialLineGenerator.angle())
			.radius(d => oldYScale ? oldYScale(d.value) : minRange)
			.curve(radialLineGenerator.curve());

		// compute the space that each x label needs
		const horizSpaceNeededByEachXLabel = this.uniqKeys.map(key => {
			const tickWidth = this.labelDimensions(key).width;
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
		// Drawing section
		/////////////////////////////

		if (DEBUG) {
			const debugContainer = DOMUtils.appendOrSelect(this.svg, "g.debug");
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
			const vertDiam = DOMUtils.appendOrSelect(debugContainer, "line.vertDiam")
				.attr("x1", c.x)
				.attr("y1", c.y - radius - 10)
				.attr("x2", c.x)
				.attr("y2", c.y + radius + 10)
				.attr("opacity", 0.2)
				.attr("stroke", "gold");
			const horizDiam = DOMUtils.appendOrSelect(debugContainer, "line.horizDiam")
				.attr("x1", c.x - radius - 10)
				.attr("y1", c.y)
				.attr("x2", c.x + radius + 10)
				.attr("y2", c.y)
				.attr("opacity", 0.2)
				.attr("stroke", "gold");
		}

		// y axes
		const yAxes = DOMUtils.appendOrSelect(this.svg, "g.y-axes").attr("role", Roles.GROUP);
		const yAxisUpdate = yAxes.selectAll("path").data(yTicks, tick => tick);
		// for each tick, create array of data corrisponding to the points composing the shape
		const shapeData = (tick: number) => this.uniqKeys.map(key => ({ key, value: tick })) as Datum[];
		yAxisUpdate.join(
			enter => enter
				.append("path")
				.attr("role", Roles.GRAPHICS_SYMBOL)
				.attr("opacity", 0)
				.attr("transform", `translate(${c.x}, ${c.y})`)
				.attr("fill", "none")
				.attr("d", tick => oldRadialLineGenerator(shapeData(tick)))
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_y_axes_enter", animate))
					.attr("opacity", 1)
					.attr("d", tick => radialLineGenerator(shapeData(tick)))
				),
			update => update
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_y_axes_update", animate))
					.attr("opacity", 1)
					.attr("transform", `translate(${c.x}, ${c.y})`)
					.attr("d", tick => radialLineGenerator(shapeData(tick)))
				),
			exit => exit
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_y_axes_exit", animate))
					.attr("d", tick => radialLineGenerator(shapeData(tick)))
					.attr("opacity", 0)
					.remove()
				)
		);

		// y labels (show only the min and the max labels)
		const yLabels = DOMUtils.appendOrSelect(this.svg, "g.y-labels").attr("role", Roles.GROUP);
		const yLabelUpdate = yLabels.selectAll("text").data(extent(yTicks));
		yLabelUpdate.join(
			enter => enter
				.append("text")
				.attr("opacity", 0)
				.text(tick => tick)
				.attr("x", tick => polarToCartesianCoords(- Math.PI / 2, yScale(tick), c).x + yLabelPadding)
				.attr("y", tick => polarToCartesianCoords(- Math.PI / 2, yScale(tick), c).y)
				.style("text-anchor", "start")
				.style("dominant-baseline", "middle")
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_y_labels_enter", animate))
					// .transition().duration(2000)
					.attr("opacity", 1)
				),
			update => update
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_y_labels_update", animate))
					.attr("opacity", 1)
					.attr("x", tick => polarToCartesianCoords(- Math.PI / 2, yScale(tick), c).x + yLabelPadding)
					.attr("y", tick => polarToCartesianCoords(- Math.PI / 2, yScale(tick), c).y)
				),
			exit => exit
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_y_labels_exit", animate))
					.attr("opacity", 0)
					.remove()
				)
		);

		// x axes
		const xAxes = DOMUtils.appendOrSelect(this.svg, "g.x-axes").attr("role", Roles.GROUP);
		const xAxisUpdate = xAxes.selectAll("line").data(this.uniqKeys, key => key);
		xAxisUpdate.join(
			enter => enter
				.append("line")
				.attr("role", Roles.GRAPHICS_SYMBOL)
				.attr("opacity", 0)
				.attr("class", key => `x-axis-${kebabCase(key)}`) // replace spaces with -
				.attr("stroke-dasharray", "0")
				.attr("x1", key => polarToCartesianCoords(xScale(key), 0, c).x)
				.attr("y1", key => polarToCartesianCoords(xScale(key), 0, c).y)
				.attr("x2", key => polarToCartesianCoords(xScale(key), 0, c).x)
				.attr("y2", key => polarToCartesianCoords(xScale(key), 0, c).y)
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_x_axes_enter", animate))
					.attr("opacity", 1)
					.attr("x1", key => polarToCartesianCoords(xScale(key), yScale.range()[0], c).x)
					.attr("y1", key => polarToCartesianCoords(xScale(key), yScale.range()[0], c).y)
					.attr("x2", key => polarToCartesianCoords(xScale(key), yScale.range()[1], c).x)
					.attr("y2", key => polarToCartesianCoords(xScale(key), yScale.range()[1], c).y)
				),
			update => update
			.call(selection => selection
				.transition(this.services.transitions.getTransition("radar_x_axes_update", animate))
				.attr("opacity", 1)
				.attr("x1", key => polarToCartesianCoords(xScale(key), yScale.range()[0], c).x)
				.attr("y1", key => polarToCartesianCoords(xScale(key), yScale.range()[0], c).y)
				.attr("x2", key => polarToCartesianCoords(xScale(key), yScale.range()[1], c).x)
				.attr("y2", key => polarToCartesianCoords(xScale(key), yScale.range()[1], c).y)
				),
			exit => exit
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_x_axes_exit", animate))
					.attr("opacity", 0)
					.remove()
				)
		);

		// x labels
		const xLabels = DOMUtils.appendOrSelect(this.svg, "g.x-labels").attr("role", Roles.GROUP);
		const xLabelUpdate = xLabels.selectAll("text").data(this.uniqKeys);
		xLabelUpdate.join(
			enter => enter
				.append("text")
				.text(key => DEBUG ? `${key} ${radToDeg(xScale(key))}° <-- ${radToDeg(xScale(key) + Math.PI / 2)}°` : key)
				.attr("opacity", 0)
				.attr("x", key => polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).x)
				.attr("y", key => polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).y)
				.style("text-anchor", key => radialLabelPlacement(xScale(key)).textAnchor)
				.style("dominant-baseline", key => radialLabelPlacement(xScale(key)).dominantBaseline)
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_x_labels_enter", animate))
					.attr("opacity", 1)
				),
			update => update
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_x_labels_update", animate))
					.attr("opacity", 1)
					.attr("x", key => polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).x)
					.attr("y", key => polarToCartesianCoords(xScale(key), yScale.range()[1] + xLabelPadding, c).y)
				),
			exit => exit
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_x_labels_exit", animate))
					.attr("opacity", 0)
					.remove()
				)
		);

		// blobs
		const blobs = DOMUtils.appendOrSelect(this.svg, "g.blobs").attr("role", Roles.GROUP);
		const blobUpdate = blobs.selectAll("path").data(this.groupedDataNormalized, group => group.name);
		blobUpdate.join(
			enter => enter
				.append("path")
				.attr("class", "blob")
				.attr("role", Roles.GRAPHICS_SYMBOL)
				.attr("opacity", 0)
				.attr("transform", `translate(${c.x}, ${c.y})`)
				.attr("fill", group => colorScale(group.name))
				.style("fill-opacity", configuration.opacity.selected)
				.attr("stroke", group => colorScale(group.name))
				.attr("d", group => oldRadialLineGenerator(group.data))
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_blobs_enter", animate))
					.attr("opacity", 1)
					.attr("d", group => radialLineGenerator(group.data))
				),
			update => update
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_blobs_update", animate))
					.attr("opacity", 1)
					.attr("transform", `translate(${c.x}, ${c.y})`)
					.attr("d", group => radialLineGenerator(group.data))
				),
			exit => exit
				.call(selection => selection
					.transition(this.services.transitions.getTransition("radar_blobs_exit", animate))
					.attr("d", group => radialLineGenerator(group.data))
					.attr("opacity", 0)
					.remove()
				)
		);

		// data dots
		const dots = DOMUtils.appendOrSelect(this.svg, "g.dots").attr("role", Roles.GROUP);
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
		const xAxesRect = DOMUtils.appendOrSelect(this.svg, "g.x-axes-rect").attr("role", Roles.GROUP);
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

		oldYScale = yScale; // save the current scale as the old one
	}

	// append temporarily the label to get the exact space that it occupies
	labelDimensions = (label: string) => {
		const tmpTick = DOMUtils.appendOrSelect(this.svg, `g.tmp-tick`);
		const tmpTickText = DOMUtils.appendOrSelect(tmpTick, `text`).text(label);
		const { width, height } = DOMUtils.getSVGElementSize(tmpTickText.node(), { useBBox: true });
		tmpTick.remove();
		return { width, height };
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
	normalizeGroupedData = (dataset: Array<GroupedDatum>) => {
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
