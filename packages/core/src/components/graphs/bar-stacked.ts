// Internal Imports
import { Tools } from '../../tools';
import { Bar } from './bar';
import {
	Roles,
	Events,
	CartesianOrientations,
	ColorClassNameTypes,
	RenderTypes,
} from '../../interfaces';

// D3 Imports
import { select } from 'd3-selection';

export class StackedBar extends Bar {
	type = 'stacked-bar';
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
		// Grab container SVG
		const svg = this.getComponentContainer({ withinChartClip: true });

		// Chart options mixed with the internal configurations
		const options = this.getOptions();
		const { groupMapsTo } = options.data;

		// Create the data and keys that'll be used by the stack layout
		const stackData = this.model.getStackedData({
			groups: this.configs.groups,
		});

		// Update data on all bar groups
		const barGroups = svg
			.selectAll('g.bars')
			.data(stackData, (d) => Tools.getProperty(d, 0, groupMapsTo));

		// Remove elements that need to be exited
		// We need exit at the top here to make sure that
		// Data filters are processed before entering new elements
		// Or updating existing ones
		barGroups.exit().attr('opacity', 0).remove();

		// Add bar groups that need to be introduced
		barGroups
			.enter()
			.append('g')
			.classed('bars', true)
			.attr('role', Roles.GROUP)
			.attr('data-name', 'bars');

		// Update data on all bars
		const bars = svg
			.selectAll('g.bars')
			.selectAll('path.bar')
			.data(
				(d) => d,
				(d) => d.data.sharedStackKey
			);

		// Remove bars that need to be removed
		bars.exit().remove();

		bars.enter()
			.append('path')
			.merge(bars)
			.classed('bar', true)
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
				const key = d.data.sharedStackKey;

				/*
				 * Orientation support for horizontal/vertical bar charts
				 * Determine coordinates needed for a vertical set of paths
				 * to draw the bars needed, and pass those coordinates down to
				 * generateSVGPathString() to decide whether it needs to flip them
				 */
				const barWidth = this.getBarWidth();
				const x0 =
					this.services.cartesianScales.getDomainValue(key, i) -
					barWidth / 2;
				const x1 = x0 + barWidth;
				const y0 = this.services.cartesianScales.getRangeValue(d[0], i);
				let y1 = this.services.cartesianScales.getRangeValue(d[1], i);

				// don't show if part of bar is out of zoom domain
				if (this.isOutsideZoomedDomain(x0, x1)) {
					return;
				}
				// Add the divider gap
				if (
					Math.abs(y1 - y0) > 0 &&
					Math.abs(y1 - y0) > options.bars.dividerSize
				) {
					if (
						this.services.cartesianScales.getOrientation() ===
						CartesianOrientations.VERTICAL
					) {
						y1 += 1;
					} else {
						y1 -= 1;
					}
				}

				return Tools.generateSVGPathString(
					{ x0, x1, y0, y1 },
					this.services.cartesianScales.getOrientation()
				);
			})
			.attr('opacity', 1)
			// a11y
			.attr('role', Roles.GRAPHICS_SYMBOL)
			.attr('aria-roledescription', 'bar')
			.attr('aria-label', (d) => d[1] - d[0]);

		// Add event listeners for the above elements
		this.addEventListeners();
	}

	// Highlight elements that match the hovered legend item
	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;

		const { groupMapsTo } = this.model.getOptions().data;

		this.parent
			.selectAll('path.bar')
			.transition(
				this.services.transitions.getTransition('legend-hover-bar')
			)
			.attr('opacity', (d) =>
				d[groupMapsTo] !== hoveredElement.datum()['name'] ? 0.3 : 1
			);
	};

	// Un-highlight all elements
	handleLegendMouseOut = (event: CustomEvent) => {
		this.parent
			.selectAll('path.bar')
			.transition(
				this.services.transitions.getTransition('legend-mouseout-bar')
			)
			.attr('opacity', 1);
	};

	addEventListeners() {
		const options = this.getOptions();
		const { groupMapsTo } = options.data;

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

				const displayData = self.model.getDisplayData(
					self.configs.groups
				);

				let matchingDataPoint = displayData.find((d) => {
					const domainIdentifier = self.services.cartesianScales.getDomainIdentifier(
						d
					);
					const rangeIdentifier = self.services.cartesianScales.getRangeIdentifier(
						d
					);
					return (
						d[rangeIdentifier] === datum.data[datum.group] &&
						d[domainIdentifier].toString() ===
							datum.data.sharedStackKey &&
						d[groupMapsTo] === datum.group
					);
				});

				if (matchingDataPoint === undefined) {
					// use the primary range and domain ids
					const domainIdentifier = self.services.cartesianScales.getDomainIdentifier();
					const rangeIdentifier = self.services.cartesianScales.getRangeIdentifier();
					matchingDataPoint = {
						[domainIdentifier]: datum.data.sharedStackKey,
						[rangeIdentifier]: datum.data[datum.group],
						[groupMapsTo]: datum.group,
					};
				}

				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					data: [matchingDataPoint],
				});
			})
			.on('mousemove', function (event, datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Bar.BAR_MOUSEMOVE, {
					element: hoveredElement,
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
