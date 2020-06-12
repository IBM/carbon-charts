// Internal Imports
import { Component } from "../component";
import * as Configuration from "../../configuration";
import { Roles, Events } from "../../interfaces";
import { Tools } from "../../tools";

// D3 Imports
import { line } from "d3-shape";

export class Line extends Component {
	type = "line";

	init() {
		const { events } = this.services;
		// Highlight correct line legend item hovers
		events.addEventListener(
			Events.Legend.ITEM_HOVER,
			this.handleLegendOnHover
		);
		// Un-highlight lines on legend item mouseouts
		events.addEventListener(
			Events.Legend.ITEM_MOUSEOUT,
			this.handleLegendMouseOut
		);
	}

	render(animate = true) {
		const svg = this.getContainerSVG();
		const { cartesianScales, curves } = this.services;

		const getDomainValue = (d, i) => cartesianScales.getDomainValue(d, i);
		const getRangeValue = (d, i) => cartesianScales.getRangeValue(d, i);
		const [
			getXValue,
			getYValue
		] = Tools.flipDomainAndRangeBasedOnOrientation(
			getDomainValue,
			getRangeValue,
			cartesianScales.getOrientation()
		);
		const options = this.model.getOptions();

		// D3 line generator function
		const lineGenerator = line()
			.x(getXValue)
			.y(getYValue)
			.curve(curves.getD3Curve())
			.defined((datum: any, i) => {
				const rangeIdentifier = cartesianScales.getRangeIdentifier();
				const value = datum[rangeIdentifier];
				if (value === null || value === undefined) {
					return false;
				}

				return true;
			});

		let data = [];
		if (this.configs.stacked) {
			const stackedData = this.model.getStackedData({
				percentage: options.percentage
			});

			data = stackedData.map((d) => ({
				name: d[0].group,
				data: d.map((datum) => ({
					date: datum.data.sharedStackKey,
					group: datum.group,
					value: datum[1]
				})),
				hidden: !Tools.some(d, (datum) => datum[0] !== datum[1])
			}));
		} else {
			data = this.model.getGroupedData();
		}

		// Update the bound data on lines
		const lines = svg
			.selectAll("path.line")
			.data(data, (group) => group.name);

		// Remove elements that need to be exited
		// We need exit at the top here to make sure that
		// Data filters are processed before entering new elements
		// Or updating existing ones
		lines.exit().attr("opacity", 0).remove();

		// Add lines that need to be introduced
		const enteringLines = lines
			.enter()
			.append("path")
			.classed("line", true)
			.attr("opacity", 0);

		// Apply styles and datum
		enteringLines
			.merge(lines)
			.data(data, (group) => group.name)
			.attr("stroke", (group, i) => {
				return this.model.getStrokeColor(group.name);
			})
			// a11y
			.attr("role", Roles.GRAPHICS_SYMBOL)
			.attr("aria-roledescription", "line")
			.attr("aria-label", (group) => {
				const { data: groupData } = group;
				const rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
				return groupData
					.map((datum) => datum[rangeIdentifier])
					.join(",");
			})
			// Transition
			.transition(
				this.services.transitions.getTransition(
					"line-update-enter",
					animate
				)
			)
			.attr("opacity", (d) => (d.hidden ? 0 : 1))
			.attr("d", (group) => {
				const { data: groupData } = group;
				return lineGenerator(groupData);
			});
	}

	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;

		this.parent
			.selectAll("path.line")
			.transition(
				this.services.transitions.getTransition("legend-hover-line")
			)
			.attr("opacity", (group) => {
				if (group.name !== hoveredElement.datum()["name"]) {
					return Configuration.lines.opacity.unselected;
				}

				return Configuration.lines.opacity.selected;
			});
	};

	handleLegendMouseOut = (event: CustomEvent) => {
		this.parent
			.selectAll("path.line")
			.transition(
				this.services.transitions.getTransition("legend-mouseout-line")
			)
			.attr("opacity", Configuration.lines.opacity.selected);
	};

	destroy() {
		// Remove event listeners
		this.parent
			.selectAll("path.line")
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
