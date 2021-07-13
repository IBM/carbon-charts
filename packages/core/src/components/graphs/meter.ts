// Internal Imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import { Tools } from '../../tools';
import { Roles, ColorClassNameTypes, Events } from '../../interfaces';
import * as Configuration from '../../configuration';

// D3 Imports
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

export class Meter extends Component {
	type = 'meter';

	getStackedBounds(data, scale) {
		let prevX = 0;
		const stackedData = data.map((d, i) => {
			if (i !== 0) {
				prevX += scale(d.value);
				return {
					...d,
					width: Math.abs(scale(d.value) - Configuration.meter.dividerWidth),
					x: prevX - scale(d.value),
				};
			} else {
				prevX = scale(d.value);
				return { ...d, width: Math.abs(scale(d.value) - Configuration.meter.dividerWidth), x: 0 };
			}
		});

		return stackedData;
	}

	render(animate = true) {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.getOptions();
		const proportional = Tools.getProperty(
			options,
			'meter',
			'proportional'
		);
		const data = this.model.getDisplayData();
		const status = this.model.getStatus();

		const { width } = DOMUtils.getSVGElementSize(this.parent, {
			useAttrs: true,
		});
		const { groupMapsTo } = options.data;

		let domainMax;
		if (Tools.getProperty(options, 'meter', 'proportional') === null) {
			domainMax = 100;
		} else {
			const total = Tools.getProperty(
				options,
				'meter',
				'proportional',
				'total'
			);
			domainMax = total
				? total
				: this.model.getMaximumDomain(this.model.getDisplayData());
		}

		// each meter has a scale for the value but no visual axis
		const xScale = scaleLinear().domain([0, domainMax]).range([0, width]);
		const stackedData = this.getStackedBounds(data, xScale);

		const userProvidedHeight = Tools.getProperty(
			options,
			'meter',
			'height'
		);

		// draw the container to hold the value
		DOMUtils.appendOrSelect(svg, 'rect.container')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', width)
			.attr(
				'height',
				userProvidedHeight ? userProvidedHeight : proportional ? Configuration.meter.height.proportional : Configuration.meter.height.default
			);

		// draw the container max range value indicator
		DOMUtils.appendOrSelect(svg, 'line.rangeIndicator')
			.attr('x1', width)
			.attr('x2', width)
			.attr('y1', 0)
			.attr('y2', userProvidedHeight ? userProvidedHeight : proportional ? Configuration.meter.height.proportional : Configuration.meter.height.default)

		// rect with the value binded
		const valued = svg.selectAll('rect.value').data(stackedData);

		// if user provided a color for the bar, we dont want to attach a status class
		const className =
			status != null && !self.model.isUserProvidedColorScaleValid()
				? `value status--${status}`
				: 'value';

		// draw the value bar
		valued
			.enter()
			.append('rect')
			.classed('value', true)
			.merge(valued)
			.attr('x', (d) => {
				return d.x;
			})
			.attr('y', 0)
			.attr('height', () => {
				const userProvidedHeight = Tools.getProperty(
					options,
					'meter',
					'height'
				);
				return userProvidedHeight
					? userProvidedHeight
					: proportional
						? Configuration.meter.height.proportional
						: Configuration.meter.height.default
			})
			.attr('class', (d) =>
				this.model.getColorClassName({
					classNameTypes: [ColorClassNameTypes.FILL],
					dataGroupName: d[groupMapsTo],
					originalClassName: className,
				})
			)
			.transition(
				this.services.transitions.getTransition(
					'meter-bar-update',
					animate
				)
			)
			.attr('width', (d, i) => {
				return d.value > domainMax ? xScale(domainMax) : d.width;
			})
			.style('fill', (d) => self.model.getFillColor(d[groupMapsTo]))
			// a11y
			.attr('role', Roles.GRAPHICS_SYMBOL)
			.attr('aria-roledescription', 'value')
			.attr('aria-label', (d) => d.value);

		valued.exit().remove();

		// draw the peak
		const peakValue = proportional
			? null
			: Tools.getProperty(options, 'meter', 'peak');

		let peakData = peakValue;
		if (peakValue !== null) {
			if (peakValue > domainMax) {
				peakData = domainMax;
			} else if (peakValue < data[0].value) {
				peakData = data[0].value > domainMax ? domainMax : data[0].value;
			}
		}

		// if a peak is supplied within the domain, we want to render it
		const peak = svg.selectAll('line.peak').data(peakData == null ? [] : [peakData]);

		peak.enter()
			.append('line')
			.classed('peak', true)
			.merge(peak)
			.attr('y1', 0)
			.attr('y2', () => {
				const userProvidedHeight = Tools.getProperty(
					options,
					'meter',
					'height'
				);
				return userProvidedHeight ? userProvidedHeight : 8;
			})
			.transition(
				this.services.transitions.getTransition(
					'peak-line-update',
					animate
				)
			)
			.attr('x1', (d) => xScale(d))
			.attr('x2', (d) => xScale(d))
			// a11y
			.attr('role', Roles.GRAPHICS_SYMBOL)
			.attr('aria-roledescription', 'peak')
			.attr('aria-label', (d) => d);

		peak.exit().remove();

		// this forces the meter chart to only take up as much height as needed (if no height is provided)
		this.services.domUtils.setSVGMaxHeight();

		if (proportional) {
			// Add event listeners to elements and legend
			this.addEventListeners();
		}
	}

	// add event listeners for tooltips on proportional meter bars
	addEventListeners() {
		const options = this.getOptions();
		const { groupMapsTo } = options.data;
		const self = this;

		this.parent
			.selectAll('rect.value')
			.on('mouseover', function (datum) {
				const hoveredElement = select(this);
				hoveredElement.classed('hovered', true);

				hoveredElement.transition(
					self.services.transitions.getTransition(
						'graph_element_mouseover_fill_update'
					)
				);

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Meter.METER_MOUSEOVER,
					{
						element: hoveredElement,
						datum,
					}
				);

				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					items: [
						{
							label: datum[groupMapsTo],
							value: datum.value,
						},
					],
				});
			})
			.on('mousemove', function (datum) {
				const hoveredElement = select(this);
				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Meter.METER_MOUSEMOVE,
					{
						element: hoveredElement,
						datum,
					}
				);

				self.services.events.dispatchEvent(Events.Tooltip.MOVE);
			})
			.on('click', function (datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Meter.METER_CLICK, {
					element: select(this),
					datum,
				});
			})
			.on('mouseout', function (datum) {
				const hoveredElement = select(this);
				hoveredElement.classed('hovered', false);

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Meter.METER_MOUSEOUT,
					{
						element: hoveredElement,
						datum,
					}
				);

				// Hide tooltip
				self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
					hoveredElement,
				});
			});
	}

	destroy() {
		// Remove event listeners
		this.parent
			.selectAll('rect.value')
			.on('mouseover', null)
			.on('mousemove', null)
			.on('mouseout', null)
			.on('click', null);
	}
}
