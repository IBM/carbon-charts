// Internal Imports
import { Scatter } from "./scatter";
import { Tools } from "../../tools";
import { CartesianOrientations, ColorClassNameTypes } from "../../interfaces";

export class Lollipop extends Scatter {
	type = "lollipop";

	render(animate: boolean) {
		// Grab container SVG
		const svg = this.getContainerSVG({ withinChartClip: true });

		const options = this.model.getOptions();

		const { groupMapsTo } = options.data;

		const { cartesianScales } = this.services;
		const mainXScale = cartesianScales.getMainXScale();
		const mainYScale = cartesianScales.getMainYScale();
		const domainIdentifier = cartesianScales.getDomainIdentifier();

		const getDomainValue = (d, i) => cartesianScales.getDomainValue(d, i);
		const getRangeValue = (d, i) => cartesianScales.getRangeValue(d, i);
		const orientation = cartesianScales.getOrientation();
		const [
			getXValue,
			getYValue
		] = Tools.flipDomainAndRangeBasedOnOrientation(
			getDomainValue,
			getRangeValue,
			orientation
		);

		// Update data on lines
		const lines = svg
			.selectAll("line.line")
			.data(
				this.getScatterData(),
				(datum) => `${datum[groupMapsTo]}-${datum[domainIdentifier]}`
			);

		// Remove lines that are no longer needed
		lines.exit().attr("opacity", 0).remove();

		// Remove lines that need to be removed
		const enteringLines = lines.enter().append("line").attr("opacity", 0);

		const allLines = enteringLines
			.merge(lines)
			.classed("line", true)
			.attr("class", (d) =>
				this.model.getColorClassName({
					classNameTypes: [ColorClassNameTypes.STROKE],
					dataGroupName: d[groupMapsTo],
					originalClassName: "line"
				})
			)
			.transition(
				this.services.transitions.getTransition(
					"lollipop-line-update-enter",
					animate
				)
			)
			.attr("stroke", (d) =>
				this.model.getFillColor(d[groupMapsTo], d[domainIdentifier], d)
			)
			.attr("opacity", 1);

		if (orientation === CartesianOrientations.HORIZONTAL) {
			allLines
				.attr("y1", getYValue)
				.attr("y2", getYValue)
				.attr("x1", mainXScale.range()[0])
				.attr(
					"x2",
					(d, i) => (getXValue(d, i) as any) - options.points.radius
				);
		} else {
			allLines
				.attr("x1", getXValue)
				.attr("x2", getXValue)
				.attr("y1", mainYScale.range()[0])
				.attr(
					"y2",
					(d, i) => (getYValue(d, i) as any) + options.points.radius
				);
		}
	}
}
