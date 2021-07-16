import { Component } from '../component';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import { ChartModel } from '../../model';
import {
	AxisPositions,
	Events,
	RenderTypes,
	ScaleTypes,
} from '../../interfaces';
import { select } from 'd3-selection';
import pointer from 'd3-selection/src/pointer';

// Carbon position service
import Position, { PLACEMENTS } from '@carbon/utils-position';

// import the settings for the css prefix
import settings from 'carbon-components/es/globals/js/settings';
import {
	formatTick,
	computeTimeIntervalName,
} from '../../services/time-series';

export class Threshold extends Component {
	type = 'threshold';
	renderType = RenderTypes.SVG;

	label: any;

	positionService = new Position();

	constructor(model: ChartModel, services: any) {
		super(model, services);
	}

	render(animate = false) {
		const axesOptions = Tools.getProperty(this.getOptions(), 'axes');

		const thresholdData = [];

		Object.keys(axesOptions).forEach((axisPosition) => {
			if (Object.values(AxisPositions).includes(axisPosition as any)) {
				const axisOptions = axesOptions[axisPosition];

				if (
					axisOptions.thresholds &&
					axisOptions.thresholds.length > 0
				) {
					thresholdData.push({
						axisPosition,
						thresholds: axisOptions.thresholds,
					});
				}
			}
		});

		// Grab container SVG
		const svg = this.getComponentContainer({ withinChartClip: true });

		// Update data on all axis threshold groups
		const thresholdAxisGroups = svg
			.selectAll('g.axis-thresholds')
			.data(thresholdData, (thresholdData) => thresholdData.axisPosition);

		// Remove axis threshold groups that are no longer needed
		thresholdAxisGroups.exit().attr('opacity', 0).remove();

		// Add the axis threshold groups that need to be introduced
		const thresholdAxisGroupsEnter = thresholdAxisGroups
			.enter()
			.append('g');

		const thresholdAxisGroupsMerge = thresholdAxisGroupsEnter.merge(
			thresholdAxisGroups
		);
		thresholdAxisGroupsMerge.attr(
			'class',
			(d) => `axis-thresholds ${d.axisPosition}`
		);

		const thresholdGroups = thresholdAxisGroupsMerge
			.selectAll('g.threshold-group')
			.data((d) =>
				d.thresholds.map((threshold) => {
					threshold.axisPosition = d.axisPosition;
					return threshold;
				})
			);

		// Remove threshold groups that are no longer needed
		thresholdGroups.exit().attr('opacity', 0).remove();

		// Add the threshold groups that need to be introduced
		const thresholdGroupsEnter = thresholdGroups.enter().append('g');

		thresholdGroupsEnter.append('line').attr('class', 'threshold-line');
		thresholdGroupsEnter
			.append('rect')
			.attr('class', 'threshold-hoverable-area');

		const thresholdGroupsMerge = thresholdGroupsEnter.merge(
			thresholdGroups
		);
		thresholdGroupsMerge.attr('class', 'threshold-group');

		const self = this;
		thresholdAxisGroupsMerge.each(function ({ axisPosition }) {
			const scale = self.services.cartesianScales.getScaleByPosition(
				axisPosition
			);
			const scaleType = self.services.cartesianScales.getScaleTypeByPosition(
				axisPosition
			);
			const mainXScale = self.services.cartesianScales.getMainXScale();
			const mainYScale = self.services.cartesianScales.getMainYScale();
			const isScaleTypeLabels = scaleType === ScaleTypes.LABELS;
			const [xScaleStart, xScaleEnd] = mainXScale.range();
			const [yScaleEnd, yScaleStart] = mainYScale.range();

			const { cartesianScales } = self.services;
			const orientation = cartesianScales.getOrientation();
			const getDomainValue = (d) => cartesianScales.getDomainValue(d);
			const getRangeValue = (d) => cartesianScales.getRangeValue(d);
			const [
				getXValue,
				getYValue,
			] = Tools.flipDomainAndRangeBasedOnOrientation(
				getDomainValue,
				getRangeValue,
				orientation
			);

			const group = select(this);
			if (
				axisPosition === AxisPositions.TOP ||
				axisPosition === AxisPositions.BOTTOM
			) {
				group
					.selectAll('line.threshold-line')
					.transition(
						self.services.transitions.getTransition(
							'threshold-line-update',
							animate
						)
					)
					.attr('y1', yScaleStart)
					.attr('y2', yScaleEnd)
					.attr(
						'x1',
						({ value }) =>
							getXValue(value) +
							(isScaleTypeLabels ? scale.step() / 2 : 0)
					)
					.attr(
						'x2',
						({ value }) =>
							getXValue(value) +
							(isScaleTypeLabels ? scale.step() / 2 : 0)
					)
					.style('stroke', ({ fillColor }) => fillColor);

				// Set hoverable area width and rotate it
				group
					.selectAll('rect.threshold-hoverable-area')
					.attr('x', 0)
					.attr('y', ({ value }) => -getXValue(value))
					.attr('width', Math.abs(yScaleEnd - yScaleStart))
					.classed('rotate', true);
			} else {
				group
					.selectAll('line.threshold-line')
					.transition(
						self.services.transitions.getTransition(
							'threshold-line-update',
							animate
						)
					)
					.attr('x1', xScaleStart)
					.attr('x2', xScaleEnd)
					.attr(
						'y1',
						({ value }) =>
							getYValue(value) +
							(isScaleTypeLabels ? scale.step() / 2 : 0)
					)
					.attr(
						'y2',
						({ value }) =>
							getYValue(value) +
							(isScaleTypeLabels ? scale.step() / 2 : 0)
					)
					.style('stroke', ({ fillColor }) => fillColor);

				// Set hoverable area width
				group
					.selectAll('rect.threshold-hoverable-area')
					.attr('x', xScaleStart)
					.attr('y', ({ value }) => getYValue(value))
					.attr('width', Math.abs(xScaleEnd - xScaleStart))
					.classed('rotate', false);
			}
		});

		// Add event listener for showing the threshold tooltip
		this.services.events.addEventListener(Events.Threshold.SHOW, (e) => {
			this.setThresholdLabelPosition(e.detail.datum);

			this.label.classed('hidden', false);
		});

		// Add event listener for hiding the threshold tooltip
		this.services.events.addEventListener(Events.Threshold.HIDE, (e) => {
			this.label.classed('hidden', true);
		});

		this.appendThresholdLabel();

		this.addEventListeners();
	}

	getFormattedValue(datum) {
		const { value, axisPosition } = datum;
		const options = this.getOptions();
		const scaleType = this.services.cartesianScales.getScaleTypeByPosition(
			axisPosition
		);

		// If scale is time, format the threshold date as the ticks format
		if (scaleType === ScaleTypes.TIME) {
			const isVertical = [
				AxisPositions.LEFT,
				AxisPositions.RIGHT,
			].includes(axisPosition);
			const mainXScale = this.services.cartesianScales.getMainXScale();
			const mainYScale = this.services.cartesianScales.getMainYScale();
			const scale = isVertical ? mainYScale : mainXScale;

			const timeScaleOptions = Tools.getProperty(options, 'timeScale');
			const timeInterval = computeTimeIntervalName(scale.ticks());
			return formatTick(
				value,
				0,
				scale.ticks(),
				timeInterval,
				timeScaleOptions
			);
		}

		return value.toLocaleString('en');
	}

	appendThresholdLabel() {
		const holder = select(this.services.domUtils.getHolder());

		const chartprefix = Tools.getProperty(
			this.getOptions(),
			'style',
			'prefix'
		);

		this.label = DOMUtils.appendOrSelect(
			holder,
			`div.${settings.prefix}--${chartprefix}--threshold--label`
		).classed('hidden', true);
	}

	setThresholdLabelPosition(datum) {
		const holder = this.services.domUtils.getHolder();
		const target = this.label.node();
		const mouseRelativePos = pointer(holder);

		// Format the threshold value using valueFormatter if defined in user-provided options
		const formattedValue = datum.valueFormatter
			? datum.valueFormatter(datum.value)
			: this.getFormattedValue(datum);

		this.label
			.html(`${datum.label || 'Threshold'}: ${formattedValue}`)
			.style('background-color', datum.fillColor);

		// Find out whether threshold label should be shown on the left or right side
		const bestPlacementOption = this.positionService.findBestPlacementAt(
			{
				left: mouseRelativePos[0],
				top: mouseRelativePos[1],
			},
			target,
			[
				PLACEMENTS.RIGHT,
				PLACEMENTS.LEFT,
				PLACEMENTS.TOP,
				PLACEMENTS.BOTTOM,
			],
			() => ({
				width: holder.offsetWidth,
				height: holder.offsetHeight,
			})
		);

		// Get coordinates to where label should be positioned
		const pos = this.positionService.findPositionAt(
			{
				left: mouseRelativePos[0],
				top: mouseRelativePos[1],
			},
			target,
			bestPlacementOption
		);

		this.positionService.setElement(target, pos);
	}

	addEventListeners() {
		const self = this;

		// Grab container SVG
		const svg = this.getComponentContainer({ withinChartClip: true });

		// Add events to the threshold hoverable area
		svg.selectAll('rect.threshold-hoverable-area')
			.on('mouseover mousemove', function () {
				select(this.parentNode)
					.select('line.threshold-line')
					.classed('active', true);

				self.services.events.dispatchEvent(Events.Threshold.SHOW, {
					hoveredElement: select(this),
					datum: select(this).datum(),
				});
			})
			.on('mouseout', function () {
				select(this.parentNode)
					.select('line.threshold-line')
					.classed('active', false);

				self.services.events.dispatchEvent(Events.Threshold.HIDE, {
					hoveredElement: select(this),
					datum: select(this).datum(),
				});
			});
	}
}
