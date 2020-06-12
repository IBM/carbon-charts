// Internal Imports
import { Bar } from "./bar";
import { Tools } from "../../tools";
import {
	CartesianOrientations,
	Events,
	Roles,
	TooltipTypes
} from "../../interfaces";

// D3 Imports
import { map } from "d3-collection";
import { select } from "d3-selection";
import { color } from "d3-color";
import { ScaleBand, scaleBand } from "d3-scale";

export class GroupedBar extends Bar {
	type = "grouped-bar";

	groupScale: ScaleBand<any>;

	padding = 5;

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
		// Chart options mixed with the internal configurations
		const displayData = this.model.getDisplayData();

		const options = this.model.getOptions();
		const { groupMapsTo } = options.data;
		const domainIdentifier = this.services.cartesianScales.getDomainIdentifier();

		// Get unique labels
		this.setGroupScale();

		// Grab container SVG
		const svg = this.getContainerSVG();

		const allDataLabels = map(
			displayData,
			(datum) => datum[domainIdentifier]
		).keys();

		// Update data on bar groups
		const barGroups = svg
			.selectAll("g.bars")
			.data(allDataLabels, (label) => label);

		// Remove dot groups that need to be removed
		barGroups.exit().attr("opacity", 0).remove();

		// Add the bar groups that need to be introduced
		const barGroupsEnter = barGroups
			.enter()
			.append("g")
			.classed("bars", true)
			.attr("role", Roles.GROUP)
			.attr("aria-labelledby", (d) => d);

		// Update data on all bars
		const bars = barGroupsEnter
			.merge(barGroups)
			.attr("transform", (label, i) => {
				const scaleValue = this.services.cartesianScales.getDomainValue(
					label,
					i
				);
				const translateBy = scaleValue - this.getGroupWidth() / 2;
				// const translateBy = scaleValue - this.getGroupWidth(null) / 2 + this.getBarWidth(null);

				if (
					this.services.cartesianScales.getOrientation() ===
					CartesianOrientations.VERTICAL
				) {
					return `translate(${translateBy}, 0)`;
				} else {
					// translate in the y direction for horizontal groups
					return `translate(0, ${translateBy})`;
				}
			})
			.selectAll("path.bar")
			.data((label) => this.getDataCorrespondingToLabel(label));

		// Remove bars that are no longer needed
		bars.exit().attr("opacity", 0).remove();

		// Add the circles that need to be introduced
		const barsEnter = bars.enter().append("path").attr("opacity", 0);

		// code for vertical grouped bar charts
		barsEnter
			.merge(bars)
			.classed("bar", true)
			.transition(
				this.services.transitions.getTransition(
					"bar-update-enter",
					animate
				)
			)
			.attr("fill", (d) => this.model.getFillColor(d[groupMapsTo]))
			.attr("d", (d) => {
				/*
				 * Orientation support for horizontal/vertical bar charts
				 * Determine coordinates needed for a vertical set of paths
				 * to draw the bars needed, and pass those coordinates down to
				 * generateSVGPathString() to decide whether it needs to flip them
				 */
				const startX = this.groupScale(d[groupMapsTo]);
				const barWidth = this.getBarWidth();

				const x0 = startX;
				const x1 = startX + barWidth;
				const y0 = this.services.cartesianScales.getRangeValue(0);
				const y1 = this.services.cartesianScales.getRangeValue(d.value);

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

		// Add event listeners to elements drawn
		this.addEventListeners();
	}

	// Highlight elements that match the hovered legend item
	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;

		const { groupMapsTo } = this.model.getOptions().data;

		this.parent
			.selectAll("path.bar")
			.transition(
				this.services.transitions.getTransition("legend-hover-bar")
			)
			.attr("opacity", (d) =>
				d[groupMapsTo] !== hoveredElement.datum()["name"] ? 0.3 : 1
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

	addEventListeners() {
		const self = this;
		const options = this.model.getOptions();
		const { groupMapsTo } = options.data;

		this.parent
			.selectAll("path.bar")
			.on("mouseover", function (datum) {
				const hoveredElement = select(this);

				hoveredElement
					.transition(
						self.services.transitions.getTransition(
							"graph_element_mouseover_fill_update"
						)
					)
					.attr("fill", (d: any) =>
						color(self.model.getFillColor(d[groupMapsTo]))
							.darker(0.7)
							.toString()
					);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEOVER, {
					element: hoveredElement,
					datum
				});

				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					type: TooltipTypes.DATAPOINT
				});
			})
			.on("mousemove", function (datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEMOVE, {
					element: select(this),
					datum
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

				const { groupMapsTo } = self.model.getOptions().data;
				hoveredElement
					.transition(
						self.services.transitions.getTransition(
							"graph_element_mouseout_fill_update"
						)
					)
					.attr("fill", (d: any) =>
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

	protected getDataCorrespondingToLabel(label: string) {
		const displayData = this.model.getDisplayData();
		const domainIdentifier = this.services.cartesianScales.getDomainIdentifier();

		return displayData.filter((datum) => datum[domainIdentifier] === label);
	}

	protected getGroupWidth() {
		const numOfActiveDataGroups = this.model.getActiveDataGroupNames()
			.length;
		const totalGroupPadding = this.getTotalGroupPadding();

		return this.getBarWidth() * numOfActiveDataGroups + totalGroupPadding;
	}

	protected getTotalGroupPadding() {
		const numOfActiveDataGroups = this.model.getActiveDataGroupNames()
			.length;

		if (numOfActiveDataGroups === 1) {
			return 0;
		}

		const domainScale = this.services.cartesianScales.getDomainScale();
		const padding = Math.min(5, 5 * (domainScale.step() / 70));

		return padding * (numOfActiveDataGroups - 1);
	}

	// Gets the correct width for bars based on options & configurations
	protected getBarWidth() {
		const options = this.model.getOptions();
		const providedWidth = Tools.getProperty(options, "bars", "width");
		const providedMaxWidth = Tools.getProperty(options, "bars", "maxWidth");

		// If there's a provided width, compare with maxWidth and
		// Determine which to return
		if (providedWidth !== null) {
			if (providedMaxWidth === null) {
				return providedWidth;
			} else if (providedWidth <= providedMaxWidth) {
				return providedWidth;
			}
		}

		const numOfActiveDataGroups = this.model.getActiveDataGroupNames()
			.length;
		const totalGroupPadding = this.getTotalGroupPadding();

		const domainScale = this.services.cartesianScales.getDomainScale();
		return Math.min(
			providedMaxWidth,
			(domainScale.step() - totalGroupPadding) / numOfActiveDataGroups
		);
	}

	protected setGroupScale() {
		this.groupScale = scaleBand()
			.domain(this.model.getActiveDataGroupNames())
			.rangeRound([0, this.getGroupWidth()]);
	}
}
