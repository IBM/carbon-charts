// Internal Imports
import { Component } from "../component";
import * as Configuration from "../../configuration";
import { CartesianOrientations, Events } from "../../interfaces";

// D3 Imports
import { area, line } from "d3-shape";

export class ConfidenceInterval extends Component {
	type = "area";

	init() {
		const eventsFragment = this.services.events;

		// Highlight correct area on legend item hovers
		eventsFragment.addEventListener(
			Events.Legend.ITEM_HOVER,
			this.handleLegendOnHover
		);

		// Un-highlight area on legend item mouseouts
		eventsFragment.addEventListener(
			Events.Legend.ITEM_MOUSEOUT,
			this.handleLegendMouseOut
		);
	}

	render(animate = true) {
		const svg = this.getContainerSVG({ withinChartClip: true });
		let domain = [0, 0];

		const { cartesianScales, curves } = this.services;

		const orientation = cartesianScales.getOrientation();

		const areaGenerator = area().curve(this.services.curves.getD3Curve());

		// Update the bound data on area groups
		const groupedData = this.model.getGroupedData();

		const confidence = groupedData && groupedData.length === 1;

		if (!confidence) {
			console.warn(
				"Confidence Intervals can only be shown when having 1 single dataset"
			); // eslint-disable-line no-console
		}

		if (orientation === CartesianOrientations.VERTICAL) {
			areaGenerator
				.x((d, i) => cartesianScales.getDomainValue(d, i))
				.y0((d, i) =>
					confidence
						? cartesianScales.getRangeValue(d, i, confidence)[2]
						: cartesianScales.getRangeValue(d, i, confidence)
				)
				.y1((d, i) =>
					confidence
						? cartesianScales.getRangeValue(d, i, confidence)[1]
						: cartesianScales.getRangeValue(d, i, confidence)
				);
			domain = this.services.cartesianScales.getMainYScale().domain();
		} else {
			areaGenerator
				.x0((d, i) =>
					confidence
						? cartesianScales.getRangeValue(d, i, confidence)[2]
						: cartesianScales.getRangeValue(d, i, confidence)
				)
				.x1((d, i) =>
					confidence
						? cartesianScales.getRangeValue(d, i, confidence)[1]
						: cartesianScales.getRangeValue(d, i, confidence)
				)
				.y((d, i) => cartesianScales.getDomainValue(d, i));
			domain = this.services.cartesianScales.getMainXScale().domain();
		}

		const areas = svg
			.selectAll("path.area")
			.data(groupedData, (group) => group.name);

		// Remove elements that need to be exited
		// We need exit at the top here to make sure that
		// Data filters are processed before entering new elements
		// Or updating existing ones
		areas.exit().attr("opacity", 0).remove();

		const self = this;

		// Enter paths that need to be introduced
		const enteringAreas = areas.enter().append("path");
		enteringAreas
			.attr("opacity", 0)
			.merge(areas)
			.attr("fill", (group) => {
				return this.model.getFillColor(group.name);
			})
			.transition(
				this.services.transitions.getTransition(
					"area-update-enter",
					animate
				)
			)
			.attr("opacity", 1)
			.style("fill-opacity", Configuration.area.opacity.selected)
			.attr("class", "area")
			.attr("d", (group) => {
				const { data } = group;
				return areaGenerator(data);
			})
			.attr("stroke", (group) => {
				return this.model.getStrokeColor(group.name);
			})
			.style("stroke-dasharray", "2, 2")
			.attr("stroke-width", 0.7 + "px");
	}

	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;

		this.parent
			.selectAll("path.area")
			.transition(
				this.services.transitions.getTransition("legend-hover-area")
			)
			.attr("opacity", (group) => {
				if (group.name !== hoveredElement.datum()["name"]) {
					return Configuration.area.opacity.unselected;
				}

				return Configuration.area.opacity.selected;
			});
	};

	handleLegendMouseOut = (event: CustomEvent) => {
		this.parent
			.selectAll("path.area")
			.transition(
				this.services.transitions.getTransition("legend-mouseout-area")
			)
			.attr("opacity", Configuration.area.opacity.selected);
	};

	destroy() {
		// Remove event listeners
		this.parent
			.selectAll("path.area")
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