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

		const isDataEmpty = this.model.isDataEmpty();
		const isDataLoading = Tools.getProperty(
			this.model.getOptions(),
			"data",
			"loading"
		);

		if (isDataEmpty) {
			this.renderSkeleton(isDataLoading);
		} else if (!isDataEmpty && isDataLoading) {
			throw new Error(
				`Something went wrong. You can't provided non-empty data and data loading together.`
			);
		} else {
			this.removeSkeleton();
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
}
