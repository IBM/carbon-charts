// Internal Imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import { TooltipTypes, CartesianOrientations } from "../../interfaces";
import { Tools } from "../../tools";

// D3 Imports
import { mouse, Selection } from "d3-selection";

type GenericSvgSelection = Selection<SVGElement, any, SVGElement, any>;

const THRESHOLD = 5;

/** check if x is inside threshold area extents  */
function pointIsWithinThreshold(dx: number, x: number) {
	return dx > x - THRESHOLD && dx < x + THRESHOLD;
}

export class Ruler extends Component {
	type = "ruler";
	backdrop: GenericSvgSelection;
	elementsToHighlight: GenericSvgSelection;

	render() {
		this.drawBackdrop();
		this.addBackdropEventListeners();
	}

	showRuler([x, y]: [number, number]) {
		const svg = this.parent;
		const orientation: CartesianOrientations = this.services.cartesianScales.getOrientation();
		const mouseCoordinate =
			orientation === CartesianOrientations.HORIZONTAL ? y : x;
		const ruler = DOMUtils.appendOrSelect(svg, "g.ruler");
		const rulerLine = DOMUtils.appendOrSelect(ruler, "line.ruler-line");
		const dataPointElements: GenericSvgSelection = svg.selectAll(
			"[role=graphics-symbol]"
		);
		const displayData = this.model.getDisplayData();
		const rangeScale = this.services.cartesianScales.getRangeScale();
		const [yScaleEnd, yScaleStart] = rangeScale.range();
		const scaledData: {
			domainValue: number;
			originalData: any;
		}[] = displayData.map((d) => ({
			domainValue: this.services.cartesianScales.getDomainValue(d),
			originalData: d
		}));

		/**
		 * Find matches, reduce is used instead of filter
		 * to only get elements which belong to the same axis coordinate
		 */
		const dataPointsMatchingRulerLine: {
			domainValue: number;
			originalData: any;
		}[] = scaledData
			.filter((d) =>
				pointIsWithinThreshold(d.domainValue, mouseCoordinate)
			)
			.reduce((accum, currentValue) => {
				if (accum.length === 0) {
					accum.push(currentValue);
					return accum;
				}

				// store the first element of the accumulator array to compare it with current element being processed
				const sampleAccumValue = accum[0].domainValue;

				const distanceToCurrentValue = Math.abs(
					mouseCoordinate - currentValue.domainValue
				);
				const distanceToAccumValue = Math.abs(
					mouseCoordinate - sampleAccumValue
				);

				if (distanceToCurrentValue > distanceToAccumValue) {
					// if distance with current value is bigger than already existing value in the accumulator, skip current iteration
					return accum;
				} else if (distanceToCurrentValue < distanceToAccumValue) {
					// currentValue data point is closer to mouse inside the threshold area, so reinstantiate array
					accum = [currentValue];
				} else {
					// currentValue is equal to already stored values, which means there's another match on the same coordinate
					accum.push(currentValue);
				}

				return accum;
			}, []);

		// some data point match
		if (dataPointsMatchingRulerLine.length > 0) {
			const rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
			const tooltipData = dataPointsMatchingRulerLine
				.map((d) => d.originalData)
				.filter((d) => {
					const value = d[rangeIdentifier];
					return value !== null && value !== undefined;
				});

			// get elements on which we should trigger mouse events
			const domainValuesMatchingRulerLine = dataPointsMatchingRulerLine.map(
				(d) => d.domainValue
			);
			const elementsToHighlight = dataPointElements.filter((d) => {
				const domainValue = this.services.cartesianScales.getDomainValue(
					d
				);
				return domainValuesMatchingRulerLine.includes(domainValue);
			});

			/** if we pass from a trigger area to another one
			 * mouseout on previous elements won't get dispatched
			 * so we need to do it manually
			 */
			if (
				this.elementsToHighlight &&
				this.elementsToHighlight.size() > 0 &&
				!Tools.isEqual(this.elementsToHighlight, elementsToHighlight)
			) {
				this.hideRuler();
			}

			elementsToHighlight.dispatch("mouseover");

			// set current hovered elements
			this.elementsToHighlight = elementsToHighlight;

			this.services.events.dispatchEvent("show-tooltip", {
				hoveredElement: rulerLine,
				multidata: tooltipData,
				type: TooltipTypes.GRIDLINE
			});

			ruler.attr("opacity", 1);

			// line snaps to matching point
			const sampleMatch = dataPointsMatchingRulerLine[0];
			if (orientation === "horizontal") {
				rulerLine
					.attr("x1", yScaleStart)
					.attr("x2", yScaleEnd)
					.attr("y1", sampleMatch.domainValue)
					.attr("y2", sampleMatch.domainValue);
			} else {
				rulerLine
					.attr("y1", yScaleStart)
					.attr("y2", yScaleEnd)
					.attr("x1", sampleMatch.domainValue)
					.attr("x2", sampleMatch.domainValue);
			}
		} else {
			this.hideRuler();
		}
	}

	hideRuler() {
		const svg = this.parent;
		const ruler = DOMUtils.appendOrSelect(svg, "g.ruler");
		const dataPointElements = svg.selectAll("[role=graphics-symbol]");

		dataPointElements.dispatch("mouseout");
		this.services.events.dispatchEvent("hide-tooltip");
		ruler.attr("opacity", 0);
	}

	/**
	 * Adds the listener on the X grid to trigger multiple point tooltips along the x axis.
	 */
	addBackdropEventListeners() {
		const self = this;

		this.backdrop
			.on("mousemove mouseover", function () {
				const pos = mouse(self.parent.node());

				self.showRuler(pos);
			})
			.on("mouseout", function () {
				self.hideRuler();
			});
	}

	drawBackdrop() {
		const svg = this.parent;

		const mainXScale = this.services.cartesianScales.getMainXScale();
		const mainYScale = this.services.cartesianScales.getMainYScale();

		const [xScaleStart, xScaleEnd] = mainXScale.range();
		const [yScaleEnd, yScaleStart] = mainYScale.range();

		// Get height from the grid
		this.backdrop = DOMUtils.appendOrSelect(svg, "svg.chart-grid-backdrop");
		const backdropRect = DOMUtils.appendOrSelect(
			this.backdrop,
			"rect.chart-grid-backdrop"
		);

		this.backdrop
			.merge(backdropRect)
			.attr("x", xScaleStart)
			.attr("y", yScaleStart)
			.attr("width", xScaleEnd - xScaleStart)
			.attr("height", yScaleEnd - yScaleStart)
			.lower();

		backdropRect.attr("width", "100%").attr("height", "100%");
	}
}
