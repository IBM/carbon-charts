// Internal Imports
import { Component } from "../component";
import * as Configuration from "../../configuration";
import { Roles, ScaleTypes, Events, TooltipTypes } from "../../interfaces";

// D3 Imports
import { area } from "d3-shape";
import { select, color } from "d3";

export class StackedArea extends Component {
	type = "area-stacked";

	areaGenerator: any;

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
		const svg = this.getContainerSVG();
		const self = this;
		const options = this.model.getOptions();

		const mainXScale = this.services.cartesianScales.getMainXScale();
		const mainYScale = this.services.cartesianScales.getMainYScale();

		const domainAxisPosition = this.services.cartesianScales.getDomainAxisPosition();
		const domainScaleType = this.services.cartesianScales.getScaleTypeByPosition(
			domainAxisPosition
		);
		const isTimeSeries = domainScaleType === ScaleTypes.TIME;

		if (!isTimeSeries) {
			return;
		}

		const stackedData = this.model.getStackedData({
			percentage: options.percentage
		});

		const areas = svg
			.selectAll("path.area")
			.data(stackedData, (d) => d[0].group);

		// D3 area generator function
		this.areaGenerator = area()
			// @ts-ignore
			.x((d) => mainXScale(new Date(d.data.sharedStackKey)))
			.y0((d) => mainYScale(d[0]))
			.y1((d) => mainYScale(d[1]))
			.curve(this.services.curves.getD3Curve());

		areas.exit().attr("opacity", 0).remove();

		const enteringAreas = areas.enter().append("path").attr("opacity", 0);

		enteringAreas
			.merge(areas)
			.data(stackedData, (d) => d[0].group)
			.attr("fill", (d) => self.model.getFillColor(d[0].group))
			.attr("role", Roles.GRAPHICS_SYMBOL)
			.attr("aria-roledescription", "area")
			.transition(
				this.services.transitions.getTransition(
					"area-update-enter",
					animate
				)
			)
			.attr("opacity", Configuration.area.opacity.selected)
			.attr("class", "area")
			.attr("d", this.areaGenerator);
	}

	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;

		this.parent
			.selectAll("path.area")
			.transition(
				this.services.transitions.getTransition("legend-hover-area")
			)
			.attr("opacity", (d) => {
				if (d[0].group !== hoveredElement.datum().name) {
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
			.on("mouseover", null)
			.on("mousemove", null)
			.on("mouseout", null);
	}
}
