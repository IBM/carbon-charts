// Internal Imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import { Tools } from "../../tools";
import { Skeletons, CartesianOrientations } from "../../interfaces/enums";

// D3 Imports
import { scaleLinear } from "d3-scale";
import { easeLinear } from "d3-ease";
import { arc } from "d3-shape";

export class Skeleton extends Component {
	type = "skeleton";
	xScale: any;
	yScale: any;
	backdrop: any;

	render() {
		const svg = this.parent;
		const parent = svg.node().parentNode;
		const { width, height } = DOMUtils.getSVGElementSize(parent, {
			useAttrs: true
		});
		svg.attr("width", width).attr("height", height);

		const isDataLoading = Tools.getProperty(
			this.model.getOptions(),
			"data",
			"loading"
		);
		const error = Tools.getProperty(
			this.model.getOptions(),
			"data",
			"error"
		);

		// display a skeleton if there is no chart data or the loading flag is set to true
		if (isDataLoading) {
			this.renderSkeleton(isDataLoading);
		}

		// if we're done loading, and there's an error, render the skeleton (no shimmer) with an error message
		if (!isDataLoading && error) {
			this.renderSkeleton(false);
			this.renderErrorMesssage(error);
		}

		// if neither are true, clean up
		if (!isDataLoading && !error) {
			this.removeSkeleton();
			this.removeErrorMessage();
		}
	}

	renderSkeleton(showShimmerEffect: boolean) {
		if (this.configs.skeleton === Skeletons.GRID) {
			this.renderGridSkeleton(showShimmerEffect);
		} else if (this.configs.skeleton === Skeletons.VERT_OR_HORIZ) {
			this.renderVertOrHorizSkeleton(showShimmerEffect);
		} else if (this.configs.skeleton === Skeletons.PIE) {
			this.renderPieSkeleton(showShimmerEffect);
		} else if (this.configs.skeleton === Skeletons.DONUT) {
			this.renderDonutSkeleton(showShimmerEffect);
		} else {
			throw new Error(
				`"${this.configs.skeleton}" is not a valid Skeleton type.`
			);
		}
	}

	renderGridSkeleton(showShimmerEffect: boolean) {
		this.setScales();
		this.drawBackdrop(showShimmerEffect);
		this.drawXGrid(showShimmerEffect);
		this.drawYGrid(showShimmerEffect);
		if (showShimmerEffect) {
			this.setShimmerEffect("shimmer-lines");
		}
	}

	renderVertOrHorizSkeleton(showShimmerEffect: boolean) {
		const orientation = this.services.cartesianScales.getOrientation();
		this.setScales();
		this.drawBackdrop(showShimmerEffect);
		if (orientation === CartesianOrientations.VERTICAL) {
			this.drawYGrid(showShimmerEffect);
		}
		if (orientation === CartesianOrientations.HORIZONTAL) {
			this.drawXGrid(showShimmerEffect);
		}
		this.setShimmerEffect("shimmer-lines");
	}

	renderPieSkeleton(showShimmerEffect: boolean) {
		const outerRadius = this.computeOuterRadius();
		const innerRadius = 0;
		this.drawRing(outerRadius, innerRadius, showShimmerEffect);
		if (showShimmerEffect) {
			this.setShimmerEffect("shimmer-areas");
		}
	}

	renderDonutSkeleton(showShimmerEffect: boolean) {
		const outerRadius = this.computeOuterRadius();
		const innerRadius = this.computeInnerRadius();
		this.drawRing(outerRadius, innerRadius, showShimmerEffect);
		if (showShimmerEffect) {
			this.setShimmerEffect("shimmer-areas");
		}
	}

	setScales() {
		const xRange = this.services.cartesianScales.getMainXScale().range();
		const yRange = this.services.cartesianScales.getMainYScale().range();
		this.xScale = scaleLinear().domain([0, 1]).range(xRange);
		this.yScale = scaleLinear().domain([0, 1]).range(yRange);
	}

	drawBackdrop(showShimmerEffect: boolean) {
		const svg = this.parent;
		const parent = svg.node().parentNode;
		const { width, height } = DOMUtils.getSVGElementSize(parent, {
			useAttrs: true
		});

		this.backdrop = DOMUtils.appendOrSelect(svg, "svg.chart-skeleton.DAII")
			.attr("width", width)
			.attr("height", height);

		const backdropRect = DOMUtils.appendOrSelect(
			this.backdrop,
			"rect.chart-skeleton-backdrop"
		);
		backdropRect.attr("width", "100%").attr("height", "100%");

		const [xScaleStart, xScaleEnd] = this.xScale.range();
		const [yScaleEnd, yScaleStart] = this.yScale.range();

		this.backdrop
			.merge(backdropRect)
			.attr("x", xScaleStart)
			.attr("y", yScaleStart);

		backdropRect
			.classed("shimmer-effect-lines", showShimmerEffect)
			.classed("empty-state-lines", !showShimmerEffect);
	}

	drawXGrid(showShimmerEffect: boolean) {
		const height = this.backdrop.attr("height");
		const width = this.backdrop.attr("width");
		const ticksNumber = Tools.getProperty(
			this.model.getOptions(),
			"grid",
			"x",
			"numberOfTicks"
		);
		const ticksValues = this.xScale
			.ticks(ticksNumber)
			.map((d) => d * width);

		const xGridG = DOMUtils.appendOrSelect(this.backdrop, "g.x.skeleton");
		const update = xGridG.selectAll("line").data(ticksValues);
		update
			.enter()
			.append("line")
			.merge(update)
			.attr("x1", (d) => d)
			.attr("x2", (d) => d)
			.attr("y1", 0)
			.attr("y2", height);

		xGridG
			.selectAll("line")
			.classed("shimmer-effect-lines", showShimmerEffect)
			.classed("empty-state-lines", !showShimmerEffect);
	}

	drawYGrid(showShimmerEffect: boolean) {
		const height = this.backdrop.attr("height");
		const width = this.backdrop.attr("width");
		const ticksNumber = Tools.getProperty(
			this.model.getOptions(),
			"grid",
			"y",
			"numberOfTicks"
		);
		const ticksValues = this.xScale
			.ticks(ticksNumber)
			.map((d) => d * height);

		const yGridG = DOMUtils.appendOrSelect(this.backdrop, "g.y.skeleton");
		const update = yGridG.selectAll("line").data(ticksValues);
		update
			.enter()
			.append("line")
			.merge(update)
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", (d) => d)
			.attr("y2", (d) => d);

		yGridG
			.selectAll("line")
			.classed("shimmer-effect-lines", showShimmerEffect)
			.classed("empty-state-lines", !showShimmerEffect);
	}

	drawRing(outerRadius: number, innerRadius: number, shimmer = true) {
		const svg = this.parent;
		const { width, height } = DOMUtils.getSVGElementSize(
			svg.node().parentNode,
			{ useAttrs: true }
		);

		const container = DOMUtils.appendOrSelect(svg, "svg.chart-skeleton")
			.attr("width", width)
			.attr("height", height);
		const options = this.model.getOptions().pie;

		const skeletonAreaContainer = DOMUtils.appendOrSelect(
			container,
			"rect.chart-skeleton-area-container"
		)
			.attr("width", width)
			.attr("height", height)
			.attr("fill", "none");

		const arcPathGenerator = arc()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius)
			.startAngle(0)
			.endAngle(Math.PI * 2);

		// centering circle inside the container
		const tcx = outerRadius + Math.abs(options.radiusOffset);
		const tcy =
			outerRadius + (Math.min(width, height) - outerRadius * 2) / 2;

		DOMUtils.appendOrSelect(container, "path")
			.attr("class", "skeleton-area-shape")
			.attr("transform", `translate(${tcx}, ${tcy})`)
			.attr("d", arcPathGenerator)
			.classed("shimmer-effect-areas", shimmer)
			.classed("empty-state-areas", !shimmer);
	}

	// same logic in pie
	computeOuterRadius() {
		const options = this.model.getOptions();
		const { width, height } = DOMUtils.getSVGElementSize(
			this.parent.node().parentNode,
			{ useAttrs: true }
		);
		const radius = Math.min(width, height) / 2;
		return radius + options.pie.radiusOffset;
	}

	// same logic in donut
	computeInnerRadius() {
		return this.computeOuterRadius() * (3 / 4);
	}

	setShimmerEffect(gradientId: string) {
		const animationDuration = 2000; // ms
		const delay = 1000; // ms
		const shimmerWidth = 0.2;
		const stopBgShimmerClass = "stop-bg-shimmer";
		const stopShimmerClass = "stop-shimmer";
		const container = this.parent.select(".chart-skeleton");
		const { width } = DOMUtils.getSVGElementSize(this.parent, {
			useAttrs: true
		});
		const startPoint = 0;
		const endPoint = width;

		// append the defs as first child of container
		const defs = DOMUtils.appendOrSelect(container, "defs").lower();
		const linearGradient = DOMUtils.appendOrSelect(defs, "linearGradient")
			.attr("id", gradientId)
			.attr("x1", startPoint - 3 * shimmerWidth * width)
			.attr("x2", endPoint)
			.attr("y1", 0)
			.attr("y2", 0)
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("gradientTransform", `translate(0, 0)`);
		const stops = `
			<stop class="${stopBgShimmerClass}" offset="${startPoint}"></stop>
			<stop class="${stopShimmerClass}" offset="${startPoint + shimmerWidth}"></stop>
			<stop class="${stopBgShimmerClass}" offset="${
			startPoint + 2 * shimmerWidth
		}"></stop>
		`;
		linearGradient.html(stops);

		repeat();
		function repeat() {
			linearGradient
				.attr(
					"gradientTransform",
					`translate(${startPoint - 3 * shimmerWidth * width}, 0)`
				)
				.transition()
				.duration(animationDuration)
				.delay(delay)
				.ease(easeLinear)
				.attr(
					"gradientTransform",
					`translate(${endPoint + 3 * shimmerWidth * width}, 0)`
				)
				.on("end", repeat);
		}
	}

	removeSkeleton() {
		const container = this.parent.select(".chart-skeleton");
		container.remove();
	}

	renderErrorMesssage(error) {
		const skeleton = this.parent.select(".chart-skeleton");

		const errorContainer = DOMUtils.appendOrSelect(
			skeleton,
			"svg.bx--cc--error-message"
		)
			.attr("width", "90%")
			.attr("height", "25%")
			.attr("x", "16") // usually 1rem
			.attr("y", "45%");

		// Error icon
		const radius = 8;
		const errorIcon = errorContainer
			.selectAll("circle.bx--cc--error-message__icon")
			.data([
				{
					cx: "0",
					cy: "0",
					r: radius
				}
			]);

		errorIcon
			.enter()
			.append("circle")
			.classed("bx--cc--error-message__icon", true)
			.merge(errorIcon)
			.attr("cx", (d) => d.cx)
			.attr("cy", (d) => d.cy)
			.attr("r", (d) => d.r)
			.attr("transform", (d) => `translate(${d.r}, ${d.r})`);

		DOMUtils.appendOrSelect(
			errorContainer,
			"circle.bx--cc--error-message__icon"
		);

		errorIcon.exit().remove();

		// Exclamation point

		const exclamationPoint = errorContainer.selectAll(
			"path.bx--cc--error-message__exclamation-point"
		);

		exclamationPoint
			.enter()
			.append("path")
			.classed("bx--cc--error-message__exclamation-point", true)
			.merge(exclamationPoint)
			.attr(
				"d",
				"M7.9375,11.125 C7.41973305,11.125 7,11.544733 7,12.0625 C7,12.580267 7.41973305,13 7.9375,13 C8.45526695,13 8.875,12.580267 8.875,12.0625 C8.875,11.544733 8.45526695,11.125 7.9375,11.125 M7.3125, 3 8.5625, 3 8.5625, 9.875 7.3125, 9.875, 7.3125, 3 Z"
			);

		DOMUtils.appendOrSelect(
			errorContainer,
			"path.bx--cc--error-message__exclamation-point"
		);

		exclamationPoint.exit().remove();

		// Title
		const errorTitle = errorContainer
			.selectAll("text.bx--cc--error-message__title")
			.data([error.title]);

		const textHorizontalOffset = radius + 16;
		const textVerticalOffset = 12.5; // this roughly centers our text with the icon

		errorTitle
			.enter()
			.append("text")
			.classed("bx--cc--error-message__title", true)
			.merge(errorTitle)
			.attr("x", textHorizontalOffset)
			.attr("y", textVerticalOffset)
			.html((d) => d);

		DOMUtils.appendOrSelect(
			errorContainer,
			"text.bx--cc--error-message__title"
		);

		errorTitle.exit().remove();

		// Subtitle
		const errorSubtitle = errorContainer
			.selectAll("text.bx--cc--error-message__subtitle")
			.data([error.subtitle]);

		errorSubtitle
			.enter()
			.append("text")
			.classed("bx--cc--error-message__subtitle", true)
			.merge(errorSubtitle)
			.attr("x", textHorizontalOffset)
			.attr("y", textVerticalOffset + 16)
			.html((d) => d);

		DOMUtils.appendOrSelect(
			errorContainer,
			"text.bx--cc--error-message__subtitle"
		);

		errorSubtitle.exit().remove();
	}

	removeErrorMessage() {
		const container = this.parent.select(".bx--cc--error-message");
		container.remove();
	}
}
