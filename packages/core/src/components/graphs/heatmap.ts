// Internal Imports
import { Component } from "../component";
import * as Configuration from "../../configuration";
import { Roles, Events } from "../../interfaces";
import { Tools } from "../../tools";

// D3 Imports
import { scaleLinear } from "d3-scale";

const colorScale = scaleLinear()
	.domain([0, 50, 100])
	.range(["#faf7ff", "#9964ec", "#32145f"] as any);

const colors = {};

export class Heatmap extends Component {
	type = "heatmap";

	render(animate = true) {
		const svg = this.getContainerSVG();
		const { cartesianScales, curves } = this.services;

		const displayData = this.model.getDisplayData();

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

		svg.html("");

		const mainXScale = cartesianScales.getMainXScale();
		const mainYScale = cartesianScales.getMainYScale();

		const allDataValues = displayData.map((datum) => datum["hour"]);

		const xBandWidth =
			mainXScale(new Date(allDataValues[1])) -
			mainXScale(new Date(allDataValues[0]));
		const yBandWidth = mainYScale(2) - mainYScale(3);

		allDataValues.pop();
		for (let y = 0; y < 20; y++) {
			allDataValues.forEach((datum) => {
				let color = colors[datum + y];
				if (!color) {
					color = colorScale(Math.random() * 100);
					colors[datum + y] = color;
				}

				svg.append("rect")
					.attr("x", mainXScale(new Date(datum)))
					.attr("y", mainYScale(y) - yBandWidth / 2 - 5)
					.attr("width", xBandWidth)
					.attr("height", yBandWidth)
					.attr("fill", color);
			});
		}
	}
}
