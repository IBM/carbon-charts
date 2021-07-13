import { Component } from '../component';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import { ChartModel } from '../../model';
import { Events, TruncationTypes } from '../../interfaces';
import * as Configuration from '../../configuration';

// Carbon position service
import Position, { PLACEMENTS } from '@carbon/utils-position';

// import the settings for the css prefix
import settings from 'carbon-components/es/globals/js/settings';

// D3 Imports
import { select, mouse } from 'd3-selection';

import { format } from 'date-fns';

export class Tooltip extends Component {
	type = 'tooltip';

	// flag for checking whether tooltip event listener is added or not
	isEventListenerAdded = false;
	tooltip: any;
	positionService = new Position();

	constructor(model: ChartModel, services: any, configs?: any) {
		super(model, services, configs);

		this.init();
	}

	handleShowTooltip = (e) => {
		const data = e.detail.data || e.detail.items;
		// console.log("data", data)
		const defaultHTML = this.getTooltipHTML(e);

		const tooltipTextContainer = DOMUtils.appendOrSelect(
			this.tooltip,
			'div.content-box'
		);

		// if there is a provided tooltip HTML function call it
		if (Tools.getProperty(this.getOptions(), 'tooltip', 'customHTML')) {
			if (e.detail.content) {
				const labelHTML = `<div class="title-tooltip"><p>${e.detail.content}</p></div>`;
				tooltipTextContainer.html(labelHTML);
			} else {
				tooltipTextContainer.html(
					this.model
						.getOptions()
						.tooltip.customHTML(data, defaultHTML)
				);
			}
		} else {
			// Use default tooltip
			tooltipTextContainer.html(defaultHTML);
		}

		// Position the tooltip
		this.positionTooltip(e);

		// Fade in
		this.tooltip.classed('hidden', false).attr('aria-hidden', false);
	};

	handleHideTooltip = () => {
		this.tooltip.classed('hidden', true).attr('aria-hidden', true);
	};

	addTooltipEventListener() {
		// listen to move-tooltip Custom Events to move the tooltip
		this.services.events.addEventListener(
			Events.Tooltip.MOVE,
			(e: CustomEvent) => {
				this.positionTooltip(e);
			}
		);

		// listen to show-tooltip Custom Events to render the tooltip
		this.services.events.addEventListener(
			Events.Tooltip.SHOW,
			this.handleShowTooltip
		);

		// listen to hide-tooltip Custom Events to hide the tooltip
		this.services.events.addEventListener(
			Events.Tooltip.HIDE,
			this.handleHideTooltip
		);

		// listen to chart-mouseout event to hide the tooltip
		this.services.events.addEventListener(
			Events.Chart.MOUSEOUT,
			this.handleHideTooltip
		);
	}

	removeTooltipEventListener() {
		// remove move-tooltip Custom Events
		this.services.events.removeEventListener(Events.Tooltip.MOVE, null);

		// remove show-tooltip Custom Events
		this.services.events.removeEventListener(
			Events.Tooltip.SHOW,
			this.handleShowTooltip
		);

		// remove hide-tooltip Custom Events
		this.services.events.removeEventListener(
			Events.Tooltip.HIDE,
			this.handleHideTooltip
		);

		// remove the listener on chart-mouseout
		this.services.events.removeEventListener(
			Events.Chart.MOUSEOUT,
			this.handleHideTooltip
		);
	}

	getItems(e: CustomEvent) {
		if (e.detail.items) {
			return e.detail.items;
		}

		return [];
	}

	formatItems(items) {
		const options = this.getOptions();

		// get user provided custom values for truncation
		const truncationType = Tools.getProperty(
			options,
			'tooltip',
			'truncation',
			'type'
		);

		const truncationThreshold = Tools.getProperty(
			options,
			'tooltip',
			'truncation',
			'threshold'
		);

		const truncationNumCharacter = Tools.getProperty(
			options,
			'tooltip',
			'truncation',
			'numCharacter'
		);

		// truncate the label if it's too long
		// only applies to discrete type
		if (truncationType !== TruncationTypes.NONE) {
			return items.map((item) => {
				// get width of the label icon if it exists
				const labelIconSize = item.labelIcon ? 12 : 0;

				item.value = item.value
					? this.valueFormatter(item.value, item.label)
					: item.value;
				if (
					item.label &&
					item.label.length + labelIconSize > truncationThreshold
				) {
					item.label = Tools.truncateLabel(
						item.label,
						truncationType,
						truncationNumCharacter
					);
				}

				if (item.value && item.value.length > truncationThreshold) {
					item.value = Tools.truncateLabel(
						item.value,
						truncationType,
						truncationNumCharacter
					);
				}

				return item;
			});
		}

		return items;
	}

	getTooltipHTML(e: CustomEvent) {
		let defaultHTML;
		if (e.detail.content) {
			defaultHTML = `<div class="title-tooltip"><p>${e.detail.content}</p></div>`;
		} else {
			const items = this.getItems(e);
			const formattedItems = this.formatItems(items);

			defaultHTML =
				`<ul class='multi-tooltip'>` +
				formattedItems
					.map(
						(item) =>
							`<li>
							<div class="datapoint-tooltip ${item.bold ? 'bold' : ''}">
								${item.class ? `<a class="tooltip-color ${item.class}"></a>` : ''}
								${
									item.color
										? '<a style="background-color: ' +
										  item.color +
										  '" class="tooltip-color"></a>'
										: ''
								}
								<div class="label">
								<p>${item.label || ''}</p>
								${item.labelIcon ? `<span class="label-icon"/>${item.labelIcon}</span>` : ''}
								</div>
								${
									item.value === undefined ||
									item.value === null
										? ''
										: `<p class="value"/>${item.value}</p>`
								}
							</div>
						</li>`
					)
					.join('') +
				`</ul>`;
		}

		return defaultHTML;
	}

	valueFormatter(value: any, label: string) {
		const options = this.getOptions();
		const valueFormatter = Tools.getProperty(
			options,
			'tooltip',
			'valueFormatter'
		);

		if (valueFormatter) {
			return valueFormatter(value, label);
		}

		if (typeof value.getTime === 'function') {
			return format(value, 'MMM d, yyyy');
		}

		return value.toLocaleString();
	}

	render() {
		const options = this.getOptions();
		const isTooltipEnabled = Tools.getProperty(
			options,
			'tooltip',
			'enabled'
		);
		if (isTooltipEnabled) {
			// Grab the tooltip element
			const holder = select(this.services.domUtils.getHolder());
			const chartprefix = Tools.getProperty(options, 'style', 'prefix');
			this.tooltip = DOMUtils.appendOrSelect(
				holder,
				`div.${settings.prefix}--${chartprefix}--tooltip`
			);

			this.tooltip.style('max-width', null);
			if (!this.isEventListenerAdded) {
				this.addTooltipEventListener();
				this.isEventListenerAdded = true;
			}
			this.tooltip.classed('hidden', true);
		} else if (!isTooltipEnabled && this.isEventListenerAdded) {
			// remove tooltip eventListener
			this.removeTooltipEventListener();
			this.isEventListenerAdded = false;
		}
	}

	positionTooltip(e: CustomEvent) {
		const holder = this.services.domUtils.getHolder();
		const target = this.tooltip.node();
		const options = this.getOptions();
		const isTopZoomBarEnabled = Tools.getProperty(
			options,
			'zoomBar',
			'top',
			'enabled'
		);

		let mouseRelativePos = Tools.getProperty(e, 'detail', 'mousePosition');
		if (!mouseRelativePos) {
			mouseRelativePos = mouse(holder);
		} else {
			const zoombarType = Tools.getProperty(
				options,
				'zoomBar',
				'top',
				'type'
			);
			const zoombarHeight = Configuration.zoomBar.height[zoombarType];

			// if the mouse position is from event (ruler)
			// we need add zoom bar height
			if (isTopZoomBarEnabled) {
				mouseRelativePos[1] +=
					zoombarHeight + Configuration.zoomBar.spacerHeight;

				// TODO - we need to add toolbar height when toolbar is available
			}
		}

		let pos;

		const holderWidth = holder.offsetWidth;
		const holderHeight = holder.offsetHeight;

		let bestPlacementOption;
		if (mouseRelativePos[0] / holderWidth > 0.9) {
			bestPlacementOption = PLACEMENTS.LEFT;
		} else if (mouseRelativePos[0] / holderWidth < 0.1) {
			bestPlacementOption = PLACEMENTS.RIGHT;
		} else {
			// Find out whether tooltip should be shown on the left or right side
			bestPlacementOption = this.positionService.findBestPlacementAt(
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
					width: holderWidth,
					height: holderHeight,
				})
			);
		}

		let { horizontalOffset } = Configuration.tooltips;
		if (bestPlacementOption === PLACEMENTS.LEFT) {
			horizontalOffset *= -1;
		}

		// Get coordinates to where tooltip should be positioned
		pos = this.positionService.findPositionAt(
			{
				left: mouseRelativePos[0] + horizontalOffset,
				top: mouseRelativePos[1],
			},
			target,
			bestPlacementOption
		);

		this.positionService.setElement(target, pos);
	}
}
