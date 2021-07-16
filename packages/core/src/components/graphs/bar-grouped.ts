// Internal Imports
import { Bar } from './bar';
import { Tools } from '../../tools';
import {
	CartesianOrientations,
	ColorClassNameTypes,
	Events,
	RenderTypes,
	Roles,
} from '../../interfaces';

// D3 Imports
import { select } from 'd3-selection';
import { ScaleBand, scaleBand } from 'd3-scale';

export class GroupedBar extends Bar {
	type = 'grouped-bar';
	renderType = RenderTypes.SVG;

	groupScale: ScaleBand<any>;

	padding = 5;

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
		// Chart options mixed with the internal configurations
		const displayData = this.model.getDisplayData(this.configs.groups);
		const options = this.getOptions();
		const { groupMapsTo } = options.data;

		// Get unique labels
		this.setGroupScale();

		// Grab container SVG
		const svg = this.getComponentContainer({ withinChartClip: true });

		const allDataLabels = Tools.removeArrayDuplicates(
			displayData.map((datum) => {
				const domainIdentifier = this.services.cartesianScales.getDomainIdentifier(
					datum
				);
				return datum[domainIdentifier];
			})
		);

		// Update data on bar groups
		const barGroups = svg
			.selectAll('g.bars')
			.data(allDataLabels, (label) => label);

		// Remove dot groups that need to be removed
		barGroups.exit().attr('opacity', 0).remove();

		// Add the bar groups that need to be introduced
		const barGroupsEnter = barGroups
			.enter()
			.append('g')
			.classed('bars', true)
			.attr('role', Roles.GROUP)
			.attr('data-name', 'bars');

		// Update data on all bars
		const allBarGroups = barGroupsEnter.merge(barGroups);

		allBarGroups
			// Transition
			.transition(
				this.services.transitions.getTransition(
					'bar-group-update-enter',
					animate
				)
			)
			.attr('transform', (label, i) => {
				const scaleValue = this.services.cartesianScales.getDomainValue(
					label,
					i
				);
				const translateBy = scaleValue - this.getGroupWidth() / 2;
				// const translateBy = scaleValue - this.getGroupWidth(null) / 2 + this.getBarWidth(null);

				if (
					this.services.cartesianScales.getOrientation() ===
					CartesianOrientations.VERTICAL
				) {
					return `translate(${translateBy}, 0)`;
				} else {
					// translate in the y direction for horizontal groups
					return `translate(0, ${translateBy})`;
				}
			});

		const bars = allBarGroups.selectAll('path.bar').data(
			(label) => this.getDataCorrespondingToLabel(label),
			(d) => d[groupMapsTo]
		);

		// Remove bars that are no longer needed
		bars.exit().attr('opacity', 0).remove();

		// Add the bars that need to be introduced
		const barsEnter = bars.enter().append('path').attr('opacity', 0);

		// code for vertical grouped bar charts
		barsEnter
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
			.attr('d', (d) => {
				/*
				 * Orientation support for horizontal/vertical bar charts
				 * Determine coordinates needed for a vertical set of paths
				 * to draw the bars needed, and pass those coordinates down to
				 * generateSVGPathString() to decide whether it needs to flip them
				 */
				const startX = this.groupScale(d[groupMapsTo]);
				const barWidth = this.getBarWidth();

				const x0 = startX;
				const x1 = startX + barWidth;
				const rangeAxis = this.services.cartesianScales.getRangeAxisPosition(
					{ datum: d }
				);
				const y0 = this.services.cartesianScales.getValueThroughAxisPosition(
					rangeAxis,
					0
				);
				const y1 = this.services.cartesianScales.getRangeValue(d);

				// don't show if part of bar is out of zoom domain
				if (this.isOutsideZoomedDomain(x0, x1)) {
					return;
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
			.attr('aria-label', (d) => d.value);

		// Add event listeners to elements drawn
		this.addEventListeners();
	}

	// Highlight elements that match the hovered legend item
	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;

		const { groupMapsTo } = this.getOptions().data;

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

				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					data: [datum],
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

	protected getDataCorrespondingToLabel(label: string) {
		const displayData = this.model.getDisplayData(this.configs.groups);

		return displayData.filter((datum) => {
			const domainIdentifier = this.services.cartesianScales.getDomainIdentifier(
				datum
			);
			return datum[domainIdentifier] === label;
		});
	}

	protected getGroupWidth() {
		const activeData = this.model.getGroupedData(this.configs.groups);
		const totalGroupPadding = this.getTotalGroupPadding();

		return this.getBarWidth() * activeData.length + totalGroupPadding;
	}

	protected getTotalGroupPadding() {
		const activeData = this.model.getGroupedData(this.configs.groups);

		if (activeData.length === 1) {
			return 0;
		}

		const domainScale = this.services.cartesianScales.getDomainScale();
		const padding = Math.min(5, 5 * (domainScale.step() / 70));

		return padding * (activeData.length - 1);
	}

	// Gets the correct width for bars based on options & configurations
	protected getBarWidth() {
		const options = this.getOptions();
		const providedWidth = Tools.getProperty(options, 'bars', 'width');
		const providedMaxWidth = Tools.getProperty(options, 'bars', 'maxWidth');

		// If there's a provided width, compare with maxWidth and
		// Determine which to return
		if (providedWidth !== null) {
			if (
				providedMaxWidth === null ||
				providedWidth <= providedMaxWidth
			) {
				return providedWidth;
			}
		}

		const activeData = this.model.getGroupedData(this.configs.groups);
		const numOfActiveDataGroups = activeData.length;
		const totalGroupPadding = this.getTotalGroupPadding();

		const domainScale = this.services.cartesianScales.getDomainScale();
		return Math.min(
			providedMaxWidth,
			(domainScale.step() - totalGroupPadding) / numOfActiveDataGroups
		);
	}

	protected setGroupScale() {
		const activeData = this.model.getActiveDataGroupNames(
			this.configs.groups
		);

		this.groupScale = scaleBand()
			.domain(activeData)
			.rangeRound([0, this.getGroupWidth()]);
	}
}
