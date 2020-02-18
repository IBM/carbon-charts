// Internal Imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import textWidth from "text-width";

// D3 Imports
import { mouse, event as d3Event } from "d3-selection";
import { TooltipTypes, Events } from "../../interfaces";

const THRESHOLD = 5;

function pointIsMatch(dx: number, x: number) {
	return dx > x - THRESHOLD && dx < x + THRESHOLD;
}

export class Ruler extends Component {
	type = "ruler";
	backdrop: any;

	render() {
		// Draw the backdrop
		this.drawBackdrop();
		this.addBackdropEventListeners();
		DOMUtils.appendOrSelect(this.backdrop, "g.x.grid");
		DOMUtils.appendOrSelect(this.backdrop, "g.y.grid");
	}

	showRuler([x, y]: [number, number]) {
		const svg = this.parent;
		const ruler = DOMUtils.appendOrSelect(svg, "g.ruler").attr("opacity", 1);
		const line = DOMUtils.appendOrSelect(ruler, "line.ruler-line");
		const dataPoints = svg.selectAll("[role=graphics-symbol]");

		// TODO: need to use right accessor
		const data = Array.prototype.concat(
			...this.model.getData().datasets.map(dataset => dataset.data.map(d => d.date))
		);

		const height = Number(this.backdrop.attr("height"));
		const scale = this.services.cartesianScales.getMainXScale();
		const values = data.filter(d => pointIsMatch(Number(scale(d)), x));
		const highlightItems = values.map(v =>
			this.services.cartesianScales.getDataFromDomain(v)
		)[0];

		if (highlightItems && highlightItems.length > 0) {
			const hoveredElements = dataPoints.filter(d => pointIsMatch(scale(d.date), x));
			hoveredElements.dispatch("mouseover");

			this.services.events.dispatchEvent("show-tooltip", {
				hoveredElement: line,
				multidata: highlightItems,
				type: TooltipTypes.GRIDLINE
			});

		} else {
			dataPoints.dispatch("mouseout");
		}

		// set line position
		line.attr("y1", 0)
			.attr("y2", height)
			.attr("x1", x)
			.attr("x2", x);

		// if scale can't be inverted don't show axis tooltip
		if (!scale.invert) {
			return;
		}

		// append axis tooltip
		const axisTooltip = DOMUtils.appendOrSelect(ruler, "g.ruler-axis-tooltip");
		const axisTooltipValue = `${scale.invert(x)}`.substr(0, 10);
		const axisTooltipWidth = textWidth(axisTooltipValue, {
			size: 12
		});
		const axisTooltipHeight = 20;
		const axisTooltipOffset = 5;

		DOMUtils.appendOrSelect(axisTooltip, "rect.axis-tooltip-box")
			.attr("x", x - axisTooltipWidth / 2)
			.attr("y", height + axisTooltipOffset)
			.attr("width", axisTooltipWidth)
			.attr("height", axisTooltipHeight);

		DOMUtils.appendOrSelect(axisTooltip, "text.axis-tooltip-text")
			.attr("x", x)
			.attr("y", height + axisTooltipOffset + axisTooltipHeight / 2)
			.text(axisTooltipValue);
	}

	hideRuler() {
		const svg = this.parent;
		const ruler = DOMUtils.appendOrSelect(svg, "g.ruler");

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

		this.backdrop.merge(backdropRect)
			.attr("x", xScaleStart)
			.attr("y", yScaleStart)
			.attr("width", xScaleEnd - xScaleStart)
			.attr("height", yScaleEnd - yScaleStart)
			.lower();

		backdropRect.attr("width", "100%")
			.attr("height", "100%");
	}
}
