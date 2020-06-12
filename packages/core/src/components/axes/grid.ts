// Internal Imports
import { Component } from "../component";
import { Tools } from "../../tools";
import { DOMUtils } from "../../services";

// D3 Imports
import { axisBottom, axisLeft } from "d3-axis";
import { mouse, select } from "d3-selection";
import { TooltipTypes, Events } from "../../interfaces";

export class Grid extends Component {
	type = "grid";

	backdrop: any;

	render(animate = true) {
		// Draw the backdrop
		this.drawBackdrop();
		DOMUtils.appendOrSelect(this.backdrop, "g.x.grid");
		DOMUtils.appendOrSelect(this.backdrop, "g.y.grid");

		this.drawXGrid(animate);
		this.drawYGrid(animate);
	}

	drawXGrid(animate: boolean) {
		const svg = this.parent;

		const height = this.backdrop.attr("height");

		const mainXScale = this.services.cartesianScales.getMainXScale();
		const xGrid = axisBottom(mainXScale)
			.tickSizeInner(-height)
			.tickSizeOuter(0);

		// Determine number of ticks
		const numberOfTicks = Tools.getProperty(
			this.model.getOptions(),
			"grid",
			"x",
			"numberOfTicks"
		);
		xGrid.ticks(numberOfTicks);

		const g = svg
			.select(".x.grid")
			.attr(
				"transform",
				`translate(${-this.backdrop.attr("x")}, ${height})`
			);

		if (animate) {
			const transition = this.services.transitions.getTransition(
				"grid-update"
			);
			g.transition(transition).call(xGrid);
		} else {
			g.call(xGrid);
		}

		this.cleanGrid(g);
	}

	drawYGrid(animate: boolean) {
		const svg = this.parent;
		const width = this.backdrop.attr("width");

		const mainYScale = this.services.cartesianScales.getMainYScale();
		const yGrid = axisLeft(mainYScale)
			.tickSizeInner(-width)
			.tickSizeOuter(0);

		// Determine number of ticks
		const numberOfTicks = Tools.getProperty(
			this.model.getOptions(),
			"grid",
			"y",
			"numberOfTicks"
		);
		yGrid.ticks(numberOfTicks);

		const g = svg
			.select(".y.grid")
			.attr("transform", `translate(0, ${-this.backdrop.attr("y")})`);

		if (animate) {
			const transition = this.services.transitions.getTransition(
				"grid-update"
			);
			g.transition(transition).call(yGrid);
		} else {
			g.call(yGrid);
		}

		this.cleanGrid(g);
	}

	/**
	 * Returns the threshold for the gridline tooltips based on the mouse location.
	 * Calculated based on the mouse position between the two closest gridlines or edges of chart.
	 */
	getGridlineThreshold(mousePos) {
		// use the space between axis grid ticks to adjust the threshold for the tooltips
		const svg = this.parent;

		// sort in ascending x translation value order
		const gridlinesX = svg
			.selectAll(".x.grid .tick")
			.nodes()
			.sort((a, b) => {
				return (
					Number(Tools.getTranslationValues(a).tx) -
					Number(Tools.getTranslationValues(b).tx)
				);
			});

		// find the 2 gridlines on either side of the mouse
		let floor = -1;
		let ceiling;
		if (!gridlinesX.length) {
			return;
		}

		gridlinesX.forEach((line: HTMLElement, i: any) => {
			if (mousePos[0] >= +Tools.getTranslationValues(line).tx) {
				floor++;
			}
		});
		ceiling = floor + 1 < gridlinesX.length ? floor + 1 : gridlinesX.length;

		// get the 'step' between chart gridlines
		const line1 = gridlinesX[floor];
		const line2 = gridlinesX[ceiling];
		let lineSpacing;

		// if the mouse is on edge of charts (mouseX < first gridline || mouseX > last gridline)
		// we can use the chart edge to determind the threshold for the gridlines
		if (!line1) {
			// we are between the first gridline and the chart edge
			lineSpacing = +Tools.getTranslationValues(line2).tx;
		} else if (!line2) {
			// we need to use the chart right bounds in case there isnt a domain axis
			const gridElement = svg.select("rect.chart-grid-backdrop").node();
			const width = DOMUtils.getSVGElementSize(gridElement).width;

			lineSpacing = width - +Tools.getTranslationValues(line1).tx;
		} else {
			// there are two gridlines to use
			lineSpacing =
				+Tools.getTranslationValues(line2).tx -
				+Tools.getTranslationValues(line1).tx;
		}
		const { threshold } = this.model.getOptions().tooltip.gridline;
		// return the threshold
		return lineSpacing * threshold;
	}

	/**
	 * Returns the active gridlines based on the gridline threshold and mouse position.
	 * @param position mouse positon
	 */
	getActiveGridline(position) {
		const userSpecifiedThreshold = Tools.getProperty(
			this.model.getOptions,
			"tooltip",
			"gridline",
			"threshold"
		);
		const threshold = userSpecifiedThreshold
			? userSpecifiedThreshold
			: this.getGridlineThreshold(position);
		const svg = this.parent;

		const xGridlines = svg.selectAll(".x.grid .tick").filter(function () {
			const translations = Tools.getTranslationValues(this);

			// threshold for when to display a gridline tooltip
			const bounds = {
				min: Number(translations.tx) - threshold,
				max: Number(translations.tx) + threshold
			};

			return bounds.min <= position[0] && position[0] <= bounds.max;
		});

		return xGridlines;
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

	cleanGrid(g) {
		const options = this.model.getOptions();
		g.selectAll("line").attr("stroke", options.grid.strokeColor);

		// Remove extra elements
		g.selectAll("text").remove();
		g.select(".domain").remove();
	}
}
