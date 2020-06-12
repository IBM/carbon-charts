// Internal Imports
import { Scatter } from "./scatter";
import { TooltipTypes, Roles, Events } from "../../interfaces";
import { Tools } from "../../tools";

// D3 Imports
import { select, Selection, event as d3Event } from "d3-selection";

export class StackedScatter extends Scatter {
	type = "scatter-stacked";

	render(animate: boolean) {
		// Grab container SVG
		const svg = this.getContainerSVG();

		const options = this.model.getOptions();
		const { groupMapsTo } = options.data;

		const domainIdentifier = this.services.cartesianScales.getDomainIdentifier();
		const rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();

		const stackedData = this.model.getStackedData({
			percentage: options.percentage
		});

		// Update data on dot groups
		const circleGroups = svg
			.selectAll("g.dots")
			.data(stackedData, (d) => d[0].group);

		// Remove dot groups that need to be removed
		circleGroups.exit().attr("opacity", 0).remove();

		// Add the dot groups that need to be introduced
		const circleGroupsEnter = circleGroups
			.enter()
			.append("g")
			.classed("dots", true)
			.attr("role", Roles.GROUP);

		// Update data on all circles
		const circles = circleGroupsEnter
			.merge(circleGroups)
			.selectAll("circle.dot")
			.data((d) => d);

		// Remove circles that need to be removed
		circles.exit().attr("opacity", 0).remove();

		// Add the dot groups that need to be introduced
		const enteringCircles = circles
			.enter()
			.append("circle")
			.classed("dot", true)
			.attr("opacity", 0);

		// Apply styling & position
		const circlesToStyle = enteringCircles.merge(circles).datum((d) => {
			const group = d[groupMapsTo];

			return {
				[groupMapsTo]: group,
				[domainIdentifier]: d["data"]["sharedStackKey"],
				[rangeIdentifier]: d[1]
			};
		});
		this.styleCircles(circlesToStyle, animate);

		// Add event listeners to elements drawn
		this.addEventListeners();
	}
}
