// Internal Imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import { TooltipTypes, AxisPositions } from "../../interfaces";

// D3 Imports
import { mouse, Selection } from "d3-selection";
import { scaleLinear } from "d3-scale";

import textWidth from "text-width";
import { isEqual } from "lodash-es";

type GenericSvgSelection = Selection<SVGElement, any, SVGElement, any>;

const THRESHOLD = 5;
const AXIS_TOOLTIP_TEXT_SIZE = 12;

/** check if x is inside threshold area extents  */
function pointIsMatch(dx: number, x: number) {
	return dx > x - THRESHOLD && dx < x + THRESHOLD;
}

export class Ruler extends Component {
	type = "ruler";
	backdrop: GenericSvgSelection;
	hoveredElements: GenericSvgSelection;

	render() {
		// if scale is not continuous do not show ruler
		if (this.services.cartesianScales.getMainXScale().invert === undefined) {
			return;
		}

		this.drawBackdrop();
		this.addBackdropEventListeners();
	}

	showRuler([x, y]: [number, number]) {
		const svg = this.parent;
		const ruler = DOMUtils.appendOrSelect(svg, "g.ruler");
		const line = DOMUtils.appendOrSelect(ruler, "line.ruler-line");
		const dataPoints: GenericSvgSelection = svg.selectAll("[role=graphics-symbol]");
		const mainXScale = this.services.cartesianScales.getMainXScale();
		const mainYScale = this.services.cartesianScales.getMainYScale();
		const [xScaleStart, xScaleEnd] = mainXScale.range();
		const [yScaleEnd, yScaleStart] = mainYScale.range();

		let lineX = x;

		const scaledData: number[] = Array.prototype.concat(
			...this.model
				.getData()
				.datasets.map(dataset =>
					dataset.data.map((d, i) =>
						Number(this.services.cartesianScales.getDomainValue(d, i))
					)
				)
		);

		/**
		 * Find matches, reduce is used instead of filter
		 * to only get elements which belong to the same axis coordinate
		 */
		const scaledValuesMatches: number[] = scaledData.reduce((acc, cur) => {
			const sampleAccValue = acc[0];

			// if current value is bigger than already existing values forget it
			if (sampleAccValue && cur > sampleAccValue) {
				return acc;
			}

			// there's a match and cur is either less then or equal to already stored values
			if (pointIsMatch(cur, x)) {
				if (sampleAccValue && cur < sampleAccValue) {
					// there's a closer data point in the threshold area, so reinstantiate array
					acc = [cur];
				} else {
					// cur is equal to already stored values, there's another match on the same coordinate
					acc.push(cur);
				}
			}

			return acc;
		}, []);

		// some data point match
		if (scaledValuesMatches.length > 0) {
			const sampleMatch = scaledValuesMatches[0];

			const highlightItems = this.services.cartesianScales.getDataFromDomain(
				mainXScale.invert(sampleMatch)
			);

			const hoveredElements = dataPoints.filter((d, i) =>
				scaledValuesMatches.includes(
					Number(this.services.cartesianScales.getDomainValue(d))
				)
			);

			/** if we pass from a trigger area to another one
			 * mouseout on previous elements won't get dispatched
			 * so we need to do it manually
			 */
			if (
				this.hoveredElements &&
				this.hoveredElements.size() > 0 &&
				!isEqual(this.hoveredElements, hoveredElements)
			) {
				this.hoveredElements.dispatch("mouseout");
			}

			hoveredElements.dispatch("mouseover");

			// set current hovered elements
			this.hoveredElements = hoveredElements;

			this.services.events.dispatchEvent("show-tooltip", {
				hoveredElement: line,
				multidata: highlightItems,
				type: TooltipTypes.GRIDLINE
			});

			// line snaps to matching point
			lineX = sampleMatch;
		} else {
			dataPoints.dispatch("mouseout");
		}

		ruler.attr("opacity", 1);
		line.attr("y1", yScaleStart)
			.attr("y2", yScaleEnd)
			.attr("x1", lineX)
			.attr("x2", lineX);

		// append axis tooltip

		const axisPosition: AxisPositions = this.services.cartesianScales.domainAxisPosition;
		const axisTooltip = DOMUtils.appendOrSelect(ruler, "g.ruler-axis-tooltip");

		const axisTooltipValue = `${mainXScale.invert(lineX)}`.substr(0, 10);
		const axisTooltipWidth = textWidth(axisTooltipValue, {
			size: AXIS_TOOLTIP_TEXT_SIZE
		});
		const axisTooltipHeight = 20;
		const axisTooltipOffset = 5;

		// make sure tooltip does not go out of axis bbox
		const axisTooltipX =
			lineX + axisTooltipWidth / 2 > xScaleEnd
				? xScaleEnd - axisTooltipWidth / 2
				: lineX - axisTooltipWidth / 2 < xScaleStart
				? xScaleStart + axisTooltipWidth / 2
				: lineX;

		const axisTooltipRectY =
			axisPosition === AxisPositions.BOTTOM
				? yScaleEnd + axisTooltipOffset
				: yScaleStart - axisTooltipHeight - axisTooltipOffset;

		DOMUtils.appendOrSelect(axisTooltip, "rect.axis-tooltip-box")
			.attr("x", axisTooltipX - axisTooltipWidth / 2)
			.attr("y", axisTooltipRectY)
			.attr("width", axisTooltipWidth)
			.attr("height", axisTooltipHeight);

		DOMUtils.appendOrSelect(axisTooltip, "text.axis-tooltip-text")
			.attr("x", axisTooltipX)
			.attr("y", axisTooltipRectY + axisTooltipHeight / 2)
			.text(axisTooltipValue);
	}

	hideRuler() {
		const svg = this.parent;
		const ruler = DOMUtils.appendOrSelect(svg, "g.ruler");
		const dataPoints = svg.selectAll("[role=graphics-symbol]");

		dataPoints.dispatch("mouseout");
		ruler.attr("opacity", 0);
	}

	/**
	 * Adds the listener on the X grid to trigger multiple point tooltips along the x axis.
	 */
	addBackdropEventListeners() {
		const self = this;

		this.backdrop
			.on("mousemove mouseover", function() {
				const chartContainer = self.services.domUtils.getMainSVG();
				const pos = mouse(chartContainer);

				self.showRuler(pos);
			})
			.on("mouseout", function() {
				self.hideRuler();
				self.services.events.dispatchEvent("hide-tooltip", {});
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
		const backdropRect = DOMUtils.appendOrSelect(this.backdrop, "rect.chart-grid-backdrop");

		this.backdrop
			.merge(backdropRect)
			.attr("x", xScaleStart)
			.attr("y", yScaleStart)
			.attr("width", xScaleEnd - xScaleStart)
			.attr("height", yScaleEnd - yScaleStart)
			.style("cursor", "crosshair")
			.lower();

		backdropRect.attr("width", "100%").attr("height", "100%");
	}
}
