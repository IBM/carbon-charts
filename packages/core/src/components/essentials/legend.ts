// Internal Imports
import { Component } from '../component';
import { Tools } from '../../tools';
import {
	Alignments,
	ColorClassNameTypes,
	LegendItemType,
	RenderTypes,
	Roles,
	Events,
	TruncationTypes,
} from '../../interfaces';
import * as Configuration from '../../configuration';

// D3 Imports
import { select } from 'd3-selection';

export class Legend extends Component {
	type = 'legend';
	renderType = RenderTypes.HTML;

	render() {
		const options = this.getOptions();
		const legendOptions = Tools.getProperty(options, 'legend');
		const alignment = Tools.getProperty(legendOptions, 'alignment');

		const legendOrientation = Tools.getProperty(
			options,
			'legend',
			'orientation'
		);

		let dataGroups = this.model.getDataGroups();

		// Check if there are disabled legend items
		const { DISABLED } = Configuration.legend.items.status;
		const hasDeactivatedItems = dataGroups.some(
			(dataGroup) => dataGroup.status === DISABLED
		);
		const userProvidedOrder = Tools.getProperty(legendOptions, 'order');

		const svg = this.getComponentContainer()
			.classed('center-aligned', alignment === Alignments.CENTER)
			.classed(legendOrientation, true)
			.classed('has-deactivated-items', hasDeactivatedItems)
			.attr('role', Roles.GROUP)
			.attr('data-name', 'legend-items');

		if (userProvidedOrder) {
			dataGroups = this.sortDataGroups(dataGroups, userProvidedOrder);
		}

		const legendItems = svg
			.selectAll('div.legend-item')
			.data(dataGroups, (dataGroup) => dataGroup.name);

		const addedLegendItems = legendItems
			.enter()
			.append('div')
			.attr('class', 'legend-item');

		addedLegendItems
			.merge(svg.selectAll('div.legend-item'))
			.classed('active', function (d, i) {
				return d.status === Configuration.legend.items.status.ACTIVE;
			});

		const legendClickable = Tools.getProperty(
			this.getOptions(),
			'legend',
			'clickable'
		);
		svg.classed('clickable', legendClickable);

		const checkboxRadius = Configuration.legend.checkbox.radius;

		const addedCheckboxes = addedLegendItems
			.append('div')
			.classed('checkbox', true);

		addedCheckboxes
			.merge(legendItems.select('div.checkbox'))
			.attr('role', Roles.CHECKBOX)
			.attr('tabindex', legendClickable ? 0 : -1)
			.attr('aria-label', (d) => d.name)
			.attr(
				'aria-checked',
				({ status }) =>
					status === Configuration.legend.items.status.ACTIVE
			)
			.attr('width', checkboxRadius * 2)
			.attr('height', checkboxRadius * 2)
			.attr('rx', 1)
			.attr('ry', 1)
			.attr('class', (d, i) =>
				this.model.getColorClassName({
					classNameTypes: [ColorClassNameTypes.BACKGROUND],
					dataGroupName: d.name,
					originalClassName: 'checkbox',
				})
			)
			.style('background', (d) =>
				d.status === Configuration.legend.items.status.ACTIVE
					? this.model.getFillColor(d.name) ||
					  this.model.getStrokeColor(d.name)
					: null
			)
			.classed('active', function (d, i) {
				return d.status === Configuration.legend.items.status.ACTIVE;
			});

		const addedCheckIcons = addedCheckboxes
			.append('svg')
			.attr('focusable', false)
			.attr('preserveAspectRatio', 'xMidYMid meet')
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr('width', '11')
			.attr('height', '11')
			.attr('viewBox', '0 0 31 28')
			.attr('aria-hidden', true)
			.style('will-change', 'transform')
			.append('path')
			.attr(
				'd',
				'M13 21.2l-7.1-7.1-1.4 1.4 7.1 7.1L13 24 27.1 9.9l-1.4-1.5z'
			);

		const addedLegendItemsText = addedLegendItems
			.append('p')
			.merge(legendItems.select('p'));

		this.truncateLegendText(addedLegendItemsText);

		const additionalItemsOption = Tools.getProperty(
			options,
			'legend',
			'additionalItems'
		);

		// add additional legend items
		if (additionalItemsOption && dataGroups.length) {
			const self = this;

			const additionalItems = svg
				.selectAll('div.additional-item')
				.data(additionalItemsOption);

			additionalItems.exit().remove();

			const addedAdditionalItems = additionalItems
				.enter()
				.append('div')
				.merge(additionalItems)
				.classed('legend-item', true)
				.classed('additional', true);

			// remove nested child elements that no longer needed
			addedAdditionalItems.selectAll('*').remove();

			// get index of item with same type to assign distinct classname
			let previousType;
			let indexOfItem = 1;

			// add different type of legend items
			addedAdditionalItems
				.append('svg')
				.classed('icon', true)
				.each(function (d, i) {
					const additionalItem = select(this);

					if (!previousType || previousType != d.type) {
						previousType = d.type;
						indexOfItem = 1;
					} else {
						indexOfItem++;
					}

					self.addAdditionalItem(additionalItem, d, indexOfItem);
				});

			const addedAdditionalItemsText = addedAdditionalItems
				.append('p')
				.merge(addedAdditionalItems.select('p'));

			this.truncateLegendText(addedAdditionalItemsText);
		}

		// Remove old elements as needed.
		legendItems
			.exit()
			.on('mouseover', null)
			.on('click', null)
			.on('mouseout', null)
			.remove();

		if (legendClickable && addedLegendItems.size() > 1) {
			this.addEventListeners();
		}
	}

	sortDataGroups(dataGroups, legendOrder) {
		// Sort data in user defined order
		dataGroups.sort(
			(dataA, dataB) =>
				legendOrder.indexOf(dataA.name) -
				legendOrder.indexOf(dataB.name)
		);

		// If user only defined partial ordering, ordered items are placed before unordered ones
		if (legendOrder.length < dataGroups.length) {
			const definedOrderIndex = dataGroups.length - legendOrder.length;
			const definedOrder = dataGroups.slice(definedOrderIndex);

			return definedOrder.concat(dataGroups.slice(0, definedOrderIndex));
		}
		return dataGroups;
	}

	addAdditionalItem(additionalItem, itemConfig, indexOfItem) {
		const { width, height } = Configuration.legend.area;

		if (itemConfig.type === LegendItemType.RADIUS) {
			// Circular icon
			additionalItem
				.style('width', `${height}px`)
				.style('height', `${height}px`);
		} else {
			additionalItem
				.style('width', `${width}px`)
				.style('height', `${height}px`);
		}

		if (itemConfig.type === LegendItemType.RADIUS) {
			const { iconData, fill, stroke } = Configuration.legend.radius;

			const circleEnter = additionalItem
				.attr('fill', 'none')
				.selectAll('circle')
				.data(iconData)
				.enter();

			circleEnter
				.append('circle')
				.classed('radius', true)
				.attr('role', Roles.IMG)
				.attr('aria-label', 'radius')
				.attr('cx', (d) => d.cx)
				.attr('cy', (d) => d.cy)
				.attr('r', (d) => d.r)
				.style('fill', itemConfig.fill ? itemConfig.fill : fill)
				.style(
					'stroke',
					itemConfig.stroke ? itemConfig.stroke : stroke
				);
		} else if (itemConfig.type === LegendItemType.LINE) {
			const lineConfig = Configuration.legend.line;

			if (additionalItem.select('line.line').empty()) {
				additionalItem
					.append('line')
					.classed(`line-${indexOfItem}`, true)
					.attr('role', Roles.IMG)
					.attr('aria-label', 'line')
					.attr('x1', 0)
					.attr('y1', lineConfig.yPosition)
					.attr('x2', width)
					.attr('y2', lineConfig.yPosition)
					.style(
						'stroke',
						itemConfig.stroke
							? itemConfig.stroke
							: lineConfig.stroke
					)
					.style('stroke-width', lineConfig.strokeWidth);
			}
		} else if (itemConfig.type === LegendItemType.AREA) {
			if (additionalItem.select('rect.area').empty()) {
				additionalItem
					.append('rect')
					.classed(`area-${indexOfItem}`, true)
					.attr('role', Roles.IMG)
					.attr('aria-label', 'area')
					.attr('width', width)
					.attr('height', height)
					.style(
						'fill',
						indexOfItem > 3 && !itemConfig.fill
							? Configuration.legend.area.fill
							: itemConfig.fill
					)
					.style('stroke', itemConfig.stroke);
			}
		} else if (itemConfig.type === LegendItemType.SIZE) {
			const { iconData, fill, stroke } = Configuration.legend.size;

			const sizeEnter = additionalItem
				.attr('fill', 'none')
				.attr('role', Roles.IMG)
				.attr('aria-label', 'size')
				.selectAll('rect')
				.data(iconData)
				.enter();

			sizeEnter
				.append('rect')
				.classed('size', true)
				.attr('width', (d) => d.width)
				.attr('height', (d) => d.height)
				.attr('y', (d) => 0)
				.style('fill', itemConfig.fill ? itemConfig.fill : fill)
				.style('stroke', itemConfig.stroke ? itemConfig.stroke : stroke)
				.style('stroke-width', 1);
		} else if (itemConfig.type === LegendItemType.QUARTILE) {
			const { iconData } = Configuration.legend.quartile;

			const quartileEnter = additionalItem
				.selectAll('rect')
				.attr('role', Roles.IMG)
				.attr('aria-label', 'quartile')
				.data(iconData)
				.enter();

			quartileEnter
				.append('rect')
				.attr(
					'class',
					(d, i) => `quartile-${i === 0 ? 'wrapper' : 'line'}`
				)
				.attr('x', (d) => d.x)
				.attr('y', (d) => d.y)
				.attr('width', (d) => d.width)
				.attr('height', (d) => d.height);
		} else if (itemConfig.type === LegendItemType.ZOOM) {
			const { iconData, color } = Tools.getProperty(
				Configuration,
				'legend',
				'zoom'
			);

			const zoomEnter = additionalItem
				.attr('role', Roles.IMG)
				.attr('aria-label', 'zoom')
				.selectAll('g.icon')
				.data(iconData)
				.enter();

			// add '+' for the magnifying icon
			zoomEnter
				.append('g')
				.attr('x', (d) => d.x)
				.attr('y', (d) => d.y)
				.attr('width', (d) => d.width)
				.attr('height', (d) => d.height)
				.append('polygon')
				.attr(
					'points',
					'7.7 4.82 5.78 4.82 5.78 2.89 4.82 2.89 4.82 4.82 2.89 4.82 2.89 5.78 4.82 5.78 4.82 7.7 5.78 7.7 5.78 5.78 7.7 5.78 7.7 4.82'
				)
				.attr('fill', (d) =>
					itemConfig.color ? itemConfig.color : color
				);

			// add the magnifying zoom icon handle/circle
			zoomEnter
				.append('path')
				.attr(
					'd',
					'M9.36,8.67A5.22,5.22,0,0,0,10.59,5.3,5.3,5.3,0,1,0,5.3,10.59,5.22,5.22,0,0,0,8.67,9.36L12.32,13l.68-.68Zm-4.06,1A4.34,4.34,0,1,1,9.63,5.3,4.33,4.33,0,0,1,5.3,9.63Z'
				)
				.attr('fill', (d) =>
					itemConfig.color ? itemConfig.color : color
				);
		}
	}

	truncateLegendText(addedLegendItemsText) {
		const trucationOptions = Tools.getProperty(
			this.getOptions(),
			'legend',
			'truncation'
		);
		// Truncation
		// get user provided custom values for truncation
		const truncationType = Tools.getProperty(trucationOptions, 'type');
		const truncationThreshold = Tools.getProperty(
			trucationOptions,
			'threshold'
		);
		const truncationNumCharacter = Tools.getProperty(
			trucationOptions,
			'numCharacter'
		);

		// truncate the legend label if it's too long
		if (truncationType !== TruncationTypes.NONE) {
			addedLegendItemsText.html(function (d) {
				if (d.name.length > truncationThreshold) {
					return Tools.truncateLabel(
						d.name,
						truncationType,
						truncationNumCharacter
					);
				} else {
					return d.name;
				}
			});
		} else {
			addedLegendItemsText.html((d) => d.name);
		}
	}

	addEventListeners() {
		const self = this;
		const svg = this.getComponentContainer();
		const options = this.getOptions();
		const legendOptions = Tools.getProperty(options, 'legend');
		const truncationThreshold = Tools.getProperty(
			legendOptions,
			'truncation',
			'threshold'
		);

		svg.selectAll('div.legend-item')
			.on('mouseover', function () {
				self.services.events.dispatchEvent(Events.Legend.ITEM_HOVER, {
					hoveredElement: select(this),
				});

				const hoveredItem = select(this);
				hoveredItem.select('div.checkbox').classed('hovered', true);

				const hoveredItemData = hoveredItem.datum() as any;
				if (hoveredItemData.name.length > truncationThreshold) {
					self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
						hoveredElement: hoveredItem,
						content: hoveredItemData.name,
					});
				}
			})
			.on('mousemove', function () {
				self.services.events.dispatchEvent(Events.Tooltip.MOVE);
			})
			.on('click', function () {
				self.services.events.dispatchEvent(Events.Legend.ITEM_CLICK, {
					clickedElement: select(this),
				});

				const clickedItem = select(this);
				const clickedItemData = clickedItem.datum() as any;

				self.model.toggleDataLabel(clickedItemData.name);
			})
			.on('mouseout', function () {
				const hoveredItem = select(this);
				hoveredItem.select('div.checkbox').classed('hovered', false);

				self.services.events.dispatchEvent(Events.Tooltip.HIDE);

				self.services.events.dispatchEvent(
					Events.Legend.ITEM_MOUSEOUT,
					{
						hoveredElement: hoveredItem,
					}
				);
			});

		svg.selectAll('div.legend-item div.checkbox').on('keyup', function (event, d) {
			if (event.key && (event.key === 'Enter' || event.key === ' ')) {
				event.preventDefault();

				self.model.toggleDataLabel(d.name);
			}
		});

		svg.selectAll('g.additional-item').on('mouseover', function () {
			const hoveredItem = select(this);

			const hoveredItemData = hoveredItem.datum() as any;
			if (hoveredItemData.name.length > truncationThreshold) {
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement: hoveredItem,
					content: hoveredItemData.name,
				});
			}
		});
	}
}
