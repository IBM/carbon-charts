import { Component } from "../component";
import { Tools } from "../../tools";
import { DOMUtils } from "../../services";
import { ChartModel } from "../../model";
import {
	AxisPositions,
	Events,
	ScaleTypes,
	CartesianOrientations
} from "../../interfaces";
import { select, mouse } from "d3-selection";

// Carbon position service
import Position, { PLACEMENTS } from "@carbon/utils-position";

// import the settings for the css prefix
import settings from "carbon-components/es/globals/js/settings";
import {
	formatTick,
	computeTimeIntervalName
} from "../../services/time-series";

export class Threshold extends Component {
	type = "threshold";

	threshold: any;
	thresholdClass: string;
	thresholdIdentifierClass: string;

	label: any;

	positionService = new Position();

	constructor(model: ChartModel, services: any, configs: any) {
		super(model, services, configs);
	}

	render(animate = false) {
		const { value, fillColor, axisPosition, index } = this.configs;
		const chartprefix = Tools.getProperty(
			this.model.getOptions(),
			"style",
			"prefix"
		);
		this.thresholdClass = `${settings.prefix}--${chartprefix}--threshold`;
		// We can have multiple thresholds, set an unique identifier
		this.thresholdIdentifierClass = `${axisPosition}-${index}`;

		this.threshold = DOMUtils.appendOrSelect(
			this.parent,
			`g.${this.thresholdClass}.${this.thresholdIdentifierClass}`
		).raise();
		// Append threshold hoverable area
		const thresholdRect = DOMUtils.appendOrSelect(
			this.threshold,
			`rect.threshold-hoverable-area`
		);
		// Append threshold line
		const thresholdLine = DOMUtils.appendOrSelect(
			this.threshold,
			`line.threshold-line`
		);

		// Set threshold line color from configs options
		// If not defined, the line takes the defined CSS color
		thresholdLine.style("stroke", fillColor);

		const scale = this.services.cartesianScales.getScaleByPosition(
			axisPosition
		);
		const scaleType = this.services.cartesianScales.getScaleTypeByPosition(
			axisPosition
		);
		const mainXScale = this.services.cartesianScales.getMainXScale();
		const mainYScale = this.services.cartesianScales.getMainYScale();
		const isScaleTypeLabels = scaleType === ScaleTypes.LABELS;
		const [xScaleStart, xScaleEnd] = mainXScale.range();
		const [yScaleEnd, yScaleStart] = mainYScale.range();

		const { cartesianScales } = this.services;
		const orientation = cartesianScales.getOrientation();
		const getDomainValue = (d) => cartesianScales.getDomainValue(d);
		const getRangeValue = (d) => cartesianScales.getRangeValue(d);
		const [
			getXValue,
			getYValue
		] = Tools.flipDomainAndRangeBasedOnOrientation(
			getDomainValue,
			getRangeValue,
			orientation
		);

		if (orientation === CartesianOrientations.VERTICAL) {
			const position =
				getXValue(value) + (isScaleTypeLabels ? scale.step() / 2 : 0);
			// Position the threshold on the x scale value
			this.threshold
				.transition(
					this.services.transitions.getTransition(
						"threshold-update",
						animate
					)
				)
				.attr("transform", `translate(${position}, ${yScaleStart})`);
			// Set line end point on the y-axis
			thresholdLine.attr("y2", yScaleEnd - yScaleStart);
			// Set hoverable area width and rotate it
			thresholdRect
				.attr("width", yScaleEnd - yScaleStart)
				.classed("rotate", true);
		} else {
			const position =
				getYValue(value) + (isScaleTypeLabels ? scale.step() / 2 : 0);
			// Position the threshold on the y scale value
			this.threshold
				.transition(
					this.services.transitions.getTransition(
						"threshold-update",
						animate
					)
				)
				.attr("transform", `translate(${xScaleStart}, ${position})`);
			// Set line end point on the x-axis
			thresholdLine.attr("x2", xScaleEnd - xScaleStart);
			// Set hoverable area width
			thresholdRect.attr("width", xScaleEnd - xScaleStart);
		}

		const self = this;
		this.services.events.addEventListener(Events.Threshold.SHOW, (e) => {
			const hovered = e.detail.hoveredElement.node();
			// If is this threshold
			if (hovered === self.threshold) {
				// Set label position and show it
				this.setThresholdLabelPosition();
				this.label.classed("hidden", false);
			}
		});

		this.services.events.addEventListener(Events.Threshold.HIDE, (e) => {
			this.label.classed("hidden", true);
		});

		this.appendThresholdLabel();

		this.addEventListeners();
	}

	getFormattedValue() {
		const { value, axisPosition } = this.configs;
		const options = this.model.getOptions();
		const scaleType = this.services.cartesianScales.getScaleTypeByPosition(
			axisPosition
		);

		// If scale is time, format the threshold date as the ticks format
		if (scaleType === ScaleTypes.TIME) {
			const isVertical = [
				AxisPositions.LEFT,
				AxisPositions.RIGHT
			].includes(axisPosition);
			const mainXScale = this.services.cartesianScales.getMainXScale();
			const mainYScale = this.services.cartesianScales.getMainYScale();
			const scale = isVertical ? mainYScale : mainXScale;

			const timeScaleOptions = Tools.getProperty(options, "timeScale");
			const timeInterval = computeTimeIntervalName(scale.ticks());
			return formatTick(value, 0, timeInterval, timeScaleOptions);
		}

		return value.toLocaleString("en");
	}

	appendThresholdLabel() {
		const {
			value,
			valueFormatter,
			fillColor,
			label = "Threshold"
		} = this.configs;
		const holder = select(this.services.domUtils.getHolder());
		// Format the threshold value using valueFormatter if defined in user-provided options
		const formattedValue = valueFormatter
			? valueFormatter(value)
			: this.getFormattedValue();

		this.label = DOMUtils.appendOrSelect(
			holder,
			`div.${this.thresholdClass}--label.${this.thresholdIdentifierClass}`
		);
		this.label
			.html(`${label}: ${formattedValue}`)
			.classed("hidden", true)
			.style("background-color", fillColor);
	}

	setThresholdLabelPosition() {
		const holder = this.services.domUtils.getHolder();
		const target = this.label.node();
		const mouseRelativePos = mouse(holder);

		// Find out whether threshold label should be shown on the left or right side
		const bestPlacementOption = this.positionService.findBestPlacementAt(
			{
				left: mouseRelativePos[0],
				top: mouseRelativePos[1]
			},
			target,
			[
				PLACEMENTS.RIGHT,
				PLACEMENTS.LEFT,
				PLACEMENTS.TOP,
				PLACEMENTS.BOTTOM
			],
			() => ({
				width: holder.offsetWidth,
				height: holder.offsetHeight
			})
		);

		// Get coordinates to where label should be positioned
		const pos = this.positionService.findPositionAt(
			{
				left: mouseRelativePos[0],
				top: mouseRelativePos[1]
			},
			target,
			bestPlacementOption
		);

		this.positionService.setElement(target, pos);
	}

	addEventListeners() {
		const self = this;

		// Add events to the threshold hoverable area
		DOMUtils.appendOrSelect(this.threshold, "rect")
			.on("mouseover mousemove", function () {
				self.threshold.classed("active", true);
				self.services.events.dispatchEvent(Events.Threshold.SHOW, {
					hoveredElement: select(self.threshold)
				});
			})
			.on("mouseout", function () {
				self.threshold.classed("active", false);
				self.services.events.dispatchEvent(Events.Threshold.HIDE, {
					hoveredElement: select(self.threshold)
				});
			});
	}
}
