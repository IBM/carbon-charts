// Internal Imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import { Tools } from '../../tools';
import {
	CalloutDirections,
	Roles,
	Events,
	Alignments,
	ColorClassNameTypes,
	RenderTypes,
} from '../../interfaces';
import * as Configuration from '../../configuration';

// D3 Imports
import { select } from 'd3-selection';
import { arc, pie } from 'd3-shape';
import { interpolate } from 'd3-interpolate';

// Pie slice tween function
function arcTween(a, arcFunc) {
	const i = interpolate(this._current, a);

	return (t) => {
		this._current = i(t);
		return arcFunc(this._current);
	};
}

export class Pie extends Component {
	type = 'pie';
	renderType = RenderTypes.SVG;

	// We need to store our arcs
	// So that addEventListeners()
	// Can access them
	arc: any;
	hoverArc: any;

	init() {
		const eventsFragment = this.services.events;

		// Highlight correct circle on legend item hovers
		eventsFragment.addEventListener(
			Events.Legend.ITEM_HOVER,
			this.handleLegendOnHover
		);

		// Un-highlight circles on legend item mouseouts
		eventsFragment.addEventListener(
			Events.Legend.ITEM_MOUSEOUT,
			this.handleLegendMouseOut
		);
	}

	getInnerRadius() {
		return Configuration.pie.innerRadius;
	}

	render(animate = true) {
		const self = this;
		const svg = this.getComponentContainer();

		// remove any slices that are valued at 0 because they dont need to be rendered and will create extra padding
		const displayData = this.model
			.getDisplayData()
			.filter((data) => data.value > 0);
		const options = this.getOptions();
		const { groupMapsTo } = options.data;

		// Compute the outer radius needed
		const radius = this.computeRadius();

		this.arc = arc().innerRadius(this.getInnerRadius()).outerRadius(radius);

		// Set the hover arc radius
		this.hoverArc = arc()
			.innerRadius(this.getInnerRadius())
			.outerRadius(radius + Configuration.pie.hoverArc.outerRadiusOffset);

		// Setup the pie layout
		const pieLayout = pie()
			.value((d: any) => d.value)
			.sort(Tools.getProperty(options, 'pie', 'sortFunction'))
			.padAngle(Configuration.pie.padAngle);

		// Add data to pie layout
		const pieLayoutData = pieLayout(displayData);

		// Update data on all slices
		const slicesGroup = DOMUtils.appendOrSelect(svg, 'g.slices')
			.attr('role', Roles.GROUP)
			.attr('data-name', 'slices');

		const paths = slicesGroup
			.selectAll('path.slice')
			.data(pieLayoutData, (d) => d.data[groupMapsTo]);

		// Remove slices that need to be exited
		paths.exit().attr('opacity', 0).remove();

		// Add new slices that are being introduced
		const enteringPaths = paths
			.enter()
			.append('path')
			.classed('slice', true)
			.attr('opacity', 0);

		// Update styles & position on existing and entering slices
		enteringPaths
			.merge(paths)
			.attr('class', (d) =>
				this.model.getColorClassName({
					classNameTypes: [ColorClassNameTypes.FILL],
					dataGroupName: d.data[groupMapsTo],
					originalClassName: 'slice',
				})
			)
			.style('fill', (d) => self.model.getFillColor(d.data[groupMapsTo]))
			.attr('d', this.arc)
			.transition(
				this.services.transitions.getTransition(
					'pie-slice-enter-update',
					animate
				)
			)
			.attr('opacity', 1)
			// a11y
			.attr('role', Roles.GRAPHICS_SYMBOL)
			.attr('aria-roledescription', 'slice')
			.attr(
				'aria-label',
				(d) =>
					`${d.value}, ${
						Tools.convertValueToPercentage(
							d.data.value,
							displayData
						) + '%'
					}`
			)
			// Tween
			.attrTween('d', function (a) {
				return arcTween.bind(this)(a, self.arc);
			});

		// Draw the slice labels
		const renderLabels = options.pie.labels.enabled;
		const labelData = renderLabels
			? pieLayoutData.filter((x) => x.value > 0)
			: [];
		const labelsGroup = DOMUtils.appendOrSelect(svg, 'g.labels')
			.attr('role', Roles.GROUP)
			.attr('data-name', 'labels');

		const labels = labelsGroup
			.selectAll('text.pie-label')
			.data(labelData, (d: any) => d.data[groupMapsTo]);

		// Remove labels that are existing
		labels.exit().attr('opacity', 0).remove();

		// Add labels that are being introduced
		const enteringLabels = labels
			.enter()
			.append('text')
			.classed('pie-label', true);

		// Update styles & position on existing & entering labels
		const calloutData = [];
		enteringLabels
			.merge(labels)
			.style('text-anchor', 'middle')
			.text((d) => {
				if (options.pie.labels.formatter) {
					return options.pie.labels.formatter(d);
				}

				return (
					Tools.convertValueToPercentage(d.data.value, displayData) +
					'%'
				);
			})
			// Calculate dimensions in order to transform
			.datum(function (d) {
				const marginedRadius = radius + 7;

				const theta = (d.endAngle - d.startAngle) / 2 + d.startAngle;
				const deg = (theta / Math.PI) * 180;

				const textLength = this.getComputedTextLength();
				d.textOffsetX = textLength / 2;
				d.textOffsetY = deg > 90 && deg < 270 ? 10 : 0;

				d.xPosition =
					(d.textOffsetX + marginedRadius) * Math.sin(theta);
				d.yPosition =
					(d.textOffsetY + marginedRadius) * -Math.cos(theta);

				return d;
			})
			.attr('transform', function (d, i) {
				const totalSlices = labelData.length;
				const sliceAngleDeg =
					(d.endAngle - d.startAngle) * (180 / Math.PI);

				// check if last 2 slices (or just last) are < the threshold
				if (i >= totalSlices - 2) {
					if (
						sliceAngleDeg < Configuration.pie.callout.minSliceDegree
					) {
						let labelTranslateX, labelTranslateY;
						if (d.index === totalSlices - 1) {
							labelTranslateX =
								d.xPosition +
								Configuration.pie.callout.offsetX +
								Configuration.pie.callout.textMargin +
								d.textOffsetX;
							labelTranslateY =
								d.yPosition - Configuration.pie.callout.offsetY;

							// Set direction of callout
							d.direction = CalloutDirections.RIGHT;
							calloutData.push(d);
						} else {
							labelTranslateX =
								d.xPosition -
								Configuration.pie.callout.offsetX -
								d.textOffsetX -
								Configuration.pie.callout.textMargin;
							labelTranslateY =
								d.yPosition - Configuration.pie.callout.offsetY;

							// Set direction of callout
							d.direction = CalloutDirections.LEFT;
							calloutData.push(d);
						}

						return `translate(${labelTranslateX}, ${labelTranslateY})`;
					}
				}

				return `translate(${d.xPosition}, ${d.yPosition})`;
			});

		// Render pie label callouts
		this.renderCallouts(calloutData);

		const optionName = Tools.getProperty(options, 'donut')
			? 'donut'
			: 'pie';
		const alignment = Tools.getProperty(options, optionName, 'alignment');

		const { width } = DOMUtils.getSVGElementSize(this.getParent(), {
			useAttr: true,
		});

		// don't add padding for labels & callouts if they are disabled
		const xOffset = renderLabels ? Configuration.pie.xOffset : 0;
		const yOffset = renderLabels ? Configuration.pie.yOffset : 0;

		// Position Pie
		let pieTranslateX = radius + xOffset;
		if (alignment === Alignments.CENTER) {
			pieTranslateX = width / 2;
		} else if (alignment === Alignments.RIGHT) {
			pieTranslateX = width - radius - Configuration.pie.xOffset;
		}

		let pieTranslateY = radius + yOffset;
		if (calloutData.length > 0) {
			pieTranslateY += Configuration.pie.yOffsetCallout;
		}

		svg.attr('x', pieTranslateX + 7).attr('y', pieTranslateY);

		// Add event listeners
		this.addEventListeners();
	}

	renderCallouts(calloutData: any[]) {
		const svg = DOMUtils.appendOrSelect(
			this.getComponentContainer(),
			'g.callouts'
		)
			.attr('role', Roles.GROUP)
			.attr('data-name', 'callouts');

		// Update data on callouts
		const callouts = svg.selectAll('g.callout').data(calloutData);

		callouts.exit().remove();

		const enteringCallouts = callouts
			.enter()
			.append('g')
			.classed('callout', true)
			// a11y
			.attr('role', `${Roles.GRAPHICS_SYMBOL} ${Roles.GROUP}`)
			.attr('aria-roledescription', 'label callout');

		// Update data values for each callout
		// For the horizontal and vertical lines to use
		enteringCallouts.merge(callouts).datum(function (d) {
			const { xPosition, yPosition, direction } = d;

			if (direction === CalloutDirections.RIGHT) {
				d.startPos = {
					x: xPosition,
					y: yPosition + d.textOffsetY,
				};

				// end position for the callout line
				d.endPos = {
					x: xPosition + Configuration.pie.callout.offsetX,
					y:
						yPosition -
						Configuration.pie.callout.offsetY +
						d.textOffsetY,
				};

				// the intersection point of the vertical and horizontal line
				d.intersectPointX =
					d.endPos.x - Configuration.pie.callout.horizontalLineLength;
			} else {
				// start position for the callout line
				d.startPos = {
					x: xPosition,
					y: yPosition + d.textOffsetY,
				};

				// end position for the callout line should be bottom aligned to the title
				d.endPos = {
					x: xPosition - Configuration.pie.callout.offsetX,
					y:
						yPosition -
						Configuration.pie.callout.offsetY +
						d.textOffsetY,
				};

				// the intersection point of the vertical and horizontal line
				d.intersectPointX =
					d.endPos.x + Configuration.pie.callout.horizontalLineLength;
			}

			// Store the necessary data in the DOM element
			return d;
		});

		// draw vertical line
		const enteringVerticalLines = enteringCallouts
			.append('line')
			.classed('vertical-line', true);

		enteringVerticalLines
			.merge(svg.selectAll('line.vertical-line'))
			.datum(function (d: any) {
				return select(this.parentNode).datum();
			})
			.style('stroke-width', '1px')
			.attr('x1', (d) => d.startPos.x)
			.attr('y1', (d) => d.startPos.y)
			.attr('x2', (d) => d.intersectPointX)
			.attr('y2', (d) => d.endPos.y);

		// draw horizontal line
		const enteringHorizontalLines = enteringCallouts
			.append('line')
			.classed('horizontal-line', true);

		enteringHorizontalLines
			.merge(svg.selectAll('line.horizontal-line'))
			.datum(function (d: any) {
				return select(this.parentNode).datum();
			})
			.style('stroke-width', '1px')
			.attr('x1', (d) => d.intersectPointX)
			.attr('y1', (d) => d.endPos.y)
			.attr('x2', (d) => d.endPos.x)
			.attr('y2', (d) => d.endPos.y);
	}

	// Highlight elements that match the hovered legend item
	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;
		const { groupMapsTo } = this.getOptions().data;

		this.parent
			.selectAll('path.slice')
			.transition(
				this.services.transitions.getTransition('legend-hover-bar')
			)
			.attr('opacity', (d) =>
				d.data[groupMapsTo] !== hoveredElement.datum()['name'] ? 0.3 : 1
			);
	};

	// Un-highlight all elements
	handleLegendMouseOut = (event: CustomEvent) => {
		this.parent
			.selectAll('path.slice')
			.transition(
				this.services.transitions.getTransition('legend-mouseout-bar')
			)
			.attr('opacity', 1);
	};

	addEventListeners() {
		const self = this;
		this.parent
			.selectAll('path.slice')
			.on('mouseover', function (event, datum) {
				const hoveredElement = select(this);

				hoveredElement
					.classed('hovered', true)
					.transition(
						self.services.transitions.getTransition(
							'pie_slice_mouseover'
						)
					)
					.attr('d', self.hoverArc);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Pie.SLICE_MOUSEOVER, {
					element: select(this),
					datum,
				});

				const { groupMapsTo } = self.getOptions().data;
				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					items: [
						{
							label: datum.data[groupMapsTo],
							value: datum.data.value,
						},
					],
				});
			})
			.on('mousemove', function (event, datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Pie.SLICE_MOUSEMOVE, {
					element: hoveredElement,
					datum,
				});

				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.MOVE);
			})
			.on('click', function (event, datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Pie.SLICE_CLICK, {
					element: select(this),
					datum,
				});
			})
			.on('mouseout', function (event, datum) {
				const hoveredElement = select(this);
				hoveredElement
					.classed('hovered', false)
					.transition(
						self.services.transitions.getTransition(
							'pie_slice_mouseover'
						)
					)
					.attr('d', self.arc);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Pie.SLICE_MOUSEOUT, {
					element: hoveredElement,
					datum,
				});

				// Hide tooltip
				self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
					hoveredElement,
				});
			});
	}

	// Helper functions
	protected computeRadius() {
		const { width, height } = DOMUtils.getSVGElementSize(this.parent, {
			useAttrs: true,
		});

		const options = this.getOptions();
		const radius: number = Math.min(width, height) / 2;
		const renderLabels = options.pie.labels.enabled;

		return renderLabels ? radius + Configuration.pie.radiusOffset : radius;
	}
}
