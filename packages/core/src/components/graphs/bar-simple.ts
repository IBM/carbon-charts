// Internal Imports
import { Bar } from './bar';
import {
	Events,
	Roles,
	RenderTypes,
	ColorClassNameTypes,
	CartesianOrientations,
} from '../../interfaces';
import { Tools } from '../../tools';

// D3 Imports
import { select } from 'd3-selection';

export class SimpleBar extends Bar {
	type = 'simple-bar';
	renderType = RenderTypes.SVG;

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

	render(animate: boolean) {
		const options = this.getOptions();
		const { groupMapsTo } = options.data;

		// Grab container SVG
		const svg = this.getComponentContainer({ withinChartClip: true });

		const data = this.model.getDisplayData(this.configs.groups);

		const orientation = this.services.cartesianScales.getOrientation();

		// Update data on all bars
		const bars = svg
			.selectAll('path.bar')
			.data(data, (datum) => datum[groupMapsTo]);

		// Remove bars that are no longer needed
		bars.exit().attr('opacity', 0).remove();

		// Add the paths that need to be introduced
		const barsEnter = bars.enter().append('path').attr('opacity', 0);

		barsEnter
			.merge(bars)
			.classed('bar', true)
			.attr('width', this.getBarWidth.bind(this))
			.transition(
				this.services.transitions.getTransition(
					'bar-update-enter',
					animate
				)
			)
			.attr('class', (d) =>
				this.model.getColorClassName({
					classNameTypes: [ColorClassNameTypes.FILL],
					dataGroupName: d[groupMapsTo],
					originalClassName: 'bar',
				})
			)
			.style('fill', (d) => this.model.getFillColor(d[groupMapsTo]))
			.attr('d', (d, i) => {
				/*
				 * Orientation support for horizontal/vertical bar charts
				 * Determine coordinates needed for a vertical set of paths
				 * to draw the bars needed, and pass those coordinates down to
				 * generateSVGPathString() to decide whether it needs to flip them
				 */
				const rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
				const barWidth = this.getBarWidth();
				const value = d[rangeIdentifier];

				const x0 =
					this.services.cartesianScales.getDomainValue(d, i) -
					barWidth / 2;
				const x1 = x0 + barWidth;
				let y0, y1;
				if (Array.isArray(value) && value.length === 2) {
					y0 = this.services.cartesianScales.getRangeValue(value[0]);
					y1 = this.services.cartesianScales.getRangeValue(
						value[1],
						i
					);
				} else {
					const rangeScale = this.services.cartesianScales.getRangeScale();
					const yScaleDomainStart = rangeScale.domain()[0];

					y0 = this.services.cartesianScales.getRangeValue(
						Math.max(0, yScaleDomainStart)
					);
					y1 = this.services.cartesianScales.getRangeValue(d, i);
				}

				const difference = Math.abs(y1 - y0);
				// Set a min-2px size for the bar
				if (difference !== 0 && difference < 2) {
					if (
						(value > 0 &&
							orientation === CartesianOrientations.VERTICAL) ||
						(value < 0 &&
							orientation === CartesianOrientations.HORIZONTAL)
					) {
						y1 = y0 - 2;
					} else {
						y1 = y0 + 2;
					}
				}

				// don't show if part of bar is out of zoom domain
				if (this.isOutsideZoomedDomain(x0, x1)) {
					return;
				}

				return Tools.generateSVGPathString(
					{ x0, x1, y0, y1 },
					orientation
				);
			})
			.attr('opacity', 1)
			// a11y
			.attr('role', Roles.GRAPHICS_SYMBOL)
			.attr('aria-roledescription', 'bar')
			.attr('aria-label', (d) => d.value);

		// Add event listeners to elements drawn
		this.addEventListeners();
	}

	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;
		const { groupMapsTo } = this.getOptions().data;

		this.parent
			.selectAll('path.bar')
			.transition(
				this.services.transitions.getTransition(
					'legend-hover-simple-bar'
				)
			)
			.attr('opacity', (d) =>
				d[groupMapsTo] !== hoveredElement.datum()['name'] ? 0.3 : 1
			);
	};

	handleLegendMouseOut = (event: CustomEvent) => {
		this.parent
			.selectAll('path.bar')
			.transition(
				this.services.transitions.getTransition(
					'legend-mouseout-simple-bar'
				)
			)
			.attr('opacity', 1);
	};

	addEventListeners() {
		const self = this;
		this.parent
			.selectAll('path.bar')
			.on('mouseover', function (event, datum) {
				const hoveredElement = select(this);
				hoveredElement.classed('hovered', true);
				hoveredElement.transition(
					self.services.transitions.getTransition(
						'graph_element_mouseover_fill_update'
					)
				);
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEOVER, {
					element: hoveredElement,
					datum,
				});

				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					data: [datum],
				});
			})
			.on('mousemove', function (event, datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEMOVE, {
					element: select(this),
					datum,
				});

				self.services.events.dispatchEvent(Events.Tooltip.MOVE);
			})
			.on('click', function (event, datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_CLICK, {
					element: select(this),
					datum,
				});
			})
			.on('mouseout', function (event, datum) {
				const hoveredElement = select(this);
				hoveredElement.classed('hovered', false);

				hoveredElement.transition(
					self.services.transitions.getTransition(
						'graph_element_mouseout_fill_update'
					)
				);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEOUT, {
					element: hoveredElement,
					datum,
				});

				// Hide tooltip
				self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
					hoveredElement,
				});
			});
	}

	destroy() {
		// Remove event listeners
		this.parent
			.selectAll('path.bar')
			.on('mouseover', null)
			.on('mousemove', null)
			.on('mouseout', null);

		// Remove legend listeners
		const eventsFragment = this.services.events;
		eventsFragment.removeEventListener(
			Events.Legend.ITEM_HOVER,
			this.handleLegendOnHover
		);
		eventsFragment.removeEventListener(
			Events.Legend.ITEM_MOUSEOUT,
			this.handleLegendMouseOut
		);
	}
}
