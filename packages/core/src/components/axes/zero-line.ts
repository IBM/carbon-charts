// Internal Imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import { Tools } from "../../tools";

export class ZeroLine extends Component {
	type = "zero-line";

	render(animate: boolean) {
		const [
			minDomainValue,
			maxDomainValue
		] = this.services.cartesianScales.getRangeScale().domain();
		const drawZeroLine =
			(minDomainValue > 0 && maxDomainValue < 0) ||
			(minDomainValue < 0 && maxDomainValue > 0);

		// show zero line only if is necessary
		if (!drawZeroLine) {
			return;
		}

		// Grab container SVG
		const svg = this.getContainerSVG();

		// Get x & y position of the line
		const [x0, x1] = this.services.cartesianScales.getDomainScale().range();
		let yPosition = +this.services.cartesianScales.getRangeValue(0) + 0.5;

		// if scale domain contains NaN, return the first value of the range
		// this is necessary for the zero line y position that otherwise is NaN
		// so on the top of the chart while we want it on the bottom
		if (!yPosition) {
			const axisPosition = this.services.cartesianScales.getRangeAxisPosition();
			const scale = this.services.cartesianScales.getScaleByPosition(
				axisPosition
			);
			yPosition = scale.range()[0];
		}

		const lineCoordinates = Tools.flipSVGCoordinatesBasedOnOrientation(
			{
				x0,
				x1,
				y0: yPosition,
				y1: yPosition
			},
			this.services.cartesianScales.getOrientation()
		);

		const line = DOMUtils.appendOrSelect(svg, "line.domain");
		line.transition(
			this.services.transitions.getTransition("zero-line-update", animate)
		)
			.attr("y1", lineCoordinates.y0)
			.attr("y2", lineCoordinates.y1)
			.attr("x1", lineCoordinates.x0)
			.attr("x2", lineCoordinates.x1);
	}
}
