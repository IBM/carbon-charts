// Internal Imports
import { Tools } from "../../tools";
import { Bar } from "./bar";
import {
	Roles,
	TooltipTypes,
	Events,
	CartesianOrientations
} from "../../interfaces";

// D3 Imports
import { select, selectAll } from "d3-selection";
import { color } from "d3-color";
import { map } from "d3-collection";
import { Component } from "../component";
import { DOMUtils } from "../../services/essentials/dom-utils";

export class Histogram extends Component {
	type = "histogram";

	init() {
		const eventsFragment = this.services.events;

		// Highlight correct circle on legend item hovers
		eventsFragment.addEventListener(
			Events.Legend.ITEM_HOVER,
			this.handleLegendOnHover
		);

		// Un-highlight circles on legend item mouseouts
		eventsFragment.addEventListener(
			Events.Legend.ITEM_MOUSEOUT,
			this.handleLegendMouseOut
		);
	}

	render(animate: boolean) {
		// Grab container SVG
		const svg = this.getContainerSVG();

		// Chart options mixed with the internal configurations
		const displayData = this.model.getDisplayData();
		const options = this.model.getOptions();
		const { groupIdentifier } = options;
		const { groupMapsTo } = options.data;

		const domainIdentifier = this.services.cartesianScales.getDomainIdentifier();

		// Create the data and keys that'll be used by the stack layout
		const stackKeys = map(
			displayData,
			(datum) => datum[domainIdentifier]
		).keys();
		const stackData = this.model.getStackedData();

		const x = this.services.cartesianScales.getMainXScale();
		const bins = this.model.getHistogramBins();

		if (!bins) {
			return;
		}

		const binsMap = bins.reduce((mapped, bin) => {
			mapped[bin.x0] = bin;
			return mapped;
		}, {});

		// Update data on all bar groups
		const barGroups = svg.selectAll("g.bars").data(stackData, (d) => d.key);

		barGroups.exit().attr("opacity", 0).remove();

		// Add bar groups that need to be introduced
		barGroups
			.enter()
			.append("g")
			.classed("bars", true)
			.attr("role", Roles.GROUP);

		// Update data on all bars
		const bars = svg
			.selectAll("g.bars")
			.selectAll("path.bar")
			.data((data) => data);

		// Remove bars that need to be removed
		bars.exit().remove();

		bars.enter()
			.append("path")
			.merge(bars)
			.classed("bar", true)
			.attr(groupIdentifier, (d, i) => i)
			.transition(
				this.services.transitions.getTransition(
					"bar-update-enter",
					animate
				)
			)
			.attr("fill", (d) => this.model.getFillColor(d[groupMapsTo]))
			.attr("d", (d, i) => {
				const key = stackKeys[i];
				const bin = binsMap[key];
				if (!bin) {
					return;
				}

				/*
				 * Orientation support for horizontal/vertical bar charts
				 * Determine coordinates needed for a vertical set of paths
				 * to draw the bars needed, and pass those coordinates down to
				 * generateSVGPathString() to decide whether it needs to flip them
				 */
				const barWidth = x(bin.x1) - x(bin.x0) - 1;
				const x0 = this.services.cartesianScales.getDomainValue(
					bin.x0,
					i
				);
				const x1 = x0 + barWidth;

				const y0 = this.services.cartesianScales.getRangeValue(d[0], i);
				let y1 = this.services.cartesianScales.getRangeValue(d[1], i);

				// Add the divider gap
				if (
					Math.abs(y1 - y0) > 0 &&
					Math.abs(y1 - y0) > options.bars.dividerSize
				) {
					if (
						this.services.cartesianScales.getOrientation() ===
						CartesianOrientations.VERTICAL
					) {
						y1 += 1;
					} else {
						y1 -= 1;
					}
				}

				return Tools.generateSVGPathString(
					{ x0, x1, y0, y1 },
					this.services.cartesianScales.getOrientation()
				);
			})
			.attr("opacity", 1)
			// a11y
			.attr("role", Roles.GRAPHICS_SYMBOL)
			.attr("aria-roledescription", "bar")
			.attr("aria-label", (d) => d.value);

		// Add event listeners for the above elements
		this.addEventListeners(binsMap);
	}

	// Highlight elements that match the hovered legend item
	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;

		this.parent
			.selectAll("path.bar")
			.transition(
				this.services.transitions.getTransition("legend-hover-bar")
			)
			.attr("opacity", (d) =>
				d.datasetLabel !== hoveredElement.datum()["key"] ? 0.3 : 1
			);
	};

	// Un-highlight all elements
	handleLegendMouseOut = (event: CustomEvent) => {
		this.parent
			.selectAll("path.bar")
			.transition(
				this.services.transitions.getTransition("legend-mouseout-bar")
			)
			.attr("opacity", 1);
	};

	addEventListeners(binsMap) {
		const options = this.model.getOptions();
		const { groupIdentifier } = options;
		const { groupMapsTo } = options.data;

		const self = this;
		this.parent
			.selectAll("path.bar")
			.on("mouseover", function (datum) {
				const hoveredElement = select(this);
				const groupId = hoveredElement.attr(groupIdentifier);

				// Select all same group elements
				selectAll(`[${groupIdentifier}="${groupId}"]`)
					.transition(
						self.services.transitions.getTransition(
							"graph_element_mouseout_fill_update"
						)
					)
					.attr("fill", (d) =>
						color(self.model.getFillColor(d[groupMapsTo]))
							.darker(0.7)
							.toString()
					);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEOVER, {
					element: hoveredElement,
					datum,
					[groupIdentifier]: groupId
				});
			})
			.on("mousemove", function (datum) {
				const hoveredElement = select(this);
				const groupId = hoveredElement.attr(groupIdentifier);
				const rangeIdentifier = self.services.cartesianScales.getRangeIdentifier();

				const multidata = [];
				const groupElements = selectAll(
					`[${groupIdentifier}="${hoveredElement.attr(
						groupIdentifier
					)}"]`
				);
				groupElements.each((d) =>
					multidata.push({
						[groupMapsTo]: d[groupMapsTo],
						[rangeIdentifier]: d["data"][d[groupMapsTo]]
					})
				);

				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					data: {
						bin: binsMap[datum.data["sharedStackKey"]],
						multidata,
						[groupIdentifier]: groupId
					},
					type: TooltipTypes.DATAPOINT
				});
			})
			.on("click", function (datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_CLICK, {
					element: select(this),
					datum
				});
			})
			.on("mouseout", function (datum) {
				const hoveredElement = select(this);
				hoveredElement.classed("hovered", false);

				// Select all same group elements
				selectAll(
					`[${groupIdentifier}="${hoveredElement.attr(
						groupIdentifier
					)}"]`
				)
					.transition(
						self.services.transitions.getTransition(
							"graph_element_mouseout_fill_update"
						)
					)
					.attr("fill", (d) =>
						self.model.getFillColor(d[groupMapsTo])
					);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEOUT, {
					element: hoveredElement,
					datum
				});

				// Hide tooltip
				self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
					hoveredElement
				});
			});
	}

	destroy() {
		// Remove event listeners
		this.parent
			.selectAll("path.bar")
			.on("mouseover", null)
			.on("mousemove", null)
			.on("mouseout", null);

		// Remove legend listeners
		const eventsFragment = this.services.events;
		eventsFragment.removeEventListener(
			Events.Legend.ITEM_HOVER,
			this.handleLegendOnHover
		);
		eventsFragment.removeEventListener(
			Events.Legend.ITEM_MOUSEOUT,
			this.handleLegendMouseOut
		);
	}
}
