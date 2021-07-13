import { AxisChartsTooltip } from './tooltip-axis';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import {
	CartesianOrientations,
	Events,
} from './../../interfaces';

// import the settings for the css prefix
import settings from 'carbon-components/es/globals/js/settings';

// D3 Imports
import { select } from 'd3-selection';
import { min } from 'd3-array';

export class TooltipHistogram extends AxisChartsTooltip {
	init() {
		// Grab the tooltip element
		const holder = select(this.services.domUtils.getHolder());
		const chartprefix = Tools.getProperty(
			this.model.getOptions(),
			'style',
			'prefix'
		);
		this.tooltip = DOMUtils.appendOrSelect(
			holder,
			`div.${settings.prefix}--${chartprefix}--tooltip`
		);

		// Apply html content to the tooltip
		const tooltipTextContainer = DOMUtils.appendOrSelect(
			this.tooltip,
			'div.content-box'
		);
		this.tooltip.style('max-width', null);

		// listen to show-tooltip Custom Events to render the tooltip
		this.services.events.addEventListener(Events.Tooltip.SHOW, (e) => {
			// check the type of tooltip and that it is enabled
			if (
				Tools.getProperty(
					this.model.getOptions(),
					'tooltip',
					'datapoint',
					'enabled'
				)
			) {
				const data = e.detail.data;
				console.log("data1", data)
				const multidata = data.multidata;
				const hoveredElement = e.detail.hoveredElement.node();

				const defaultHTML =
					multidata.length > 1
						? this.getMultilineTooltipHTML(data)
						: this.getTooltipHTML(data);

				// if there is a provided tooltip HTML function call it and pass the defaultHTML
				if (
					Tools.getProperty(
						this.model.getOptions(),
						'tooltip',
						'customHTML'
					)
				) {
					tooltipTextContainer.html(
						this.model
							.getOptions()
							.tooltip.customHTML(data, defaultHTML)
					);
				} else {
					// default tooltip
					tooltipTextContainer.html(defaultHTML);
				}

				const position = this.getTooltipPosition(hoveredElement, data) as any;
				// Position the tooltip relative to the bars
				this.positionTooltip(e.detail.multidata ? undefined : position);
			}

			// Fade in
			this.tooltip.classed('hidden', false);
		});

		// listen to hide-tooltip Custom Events to hide the tooltip
		this.services.events.addEventListener(Events.Tooltip.HIDE, () => {
			this.tooltip.classed('hidden', true);
		});
	}

	/**
	 * Get the position of the tooltip relative to the active hovered bar. Tooltip should appear above
	 * positive valued data and below negative value data.
	 * @param hoveredElement
	 */
	getTooltipPosition(hoveredElement, data?: any) {
		const groupId = data['group-id'];
		const groupElements = document.querySelectorAll(
			`[group-id="${groupId}"]`
		);
		const groupTop = min(
			Array.from(groupElements).map(
				(d: any) => d.getBoundingClientRect().top
			)
		);
		const holderPosition = select(this.services.domUtils.getHolder())
			.node()
			.getBoundingClientRect();
		const { verticalOffset } = this.model.getOptions().tooltip.datapoint;

		const barPosition = hoveredElement.getBoundingClientRect();
		const tooltipPos = {
			left:
				barPosition.left - holderPosition.left + barPosition.width / 2,
			top: groupTop - holderPosition.top - verticalOffset,
		};

		return { placement: "top", position: tooltipPos };
	}

	/**
	 * Returns the html for the bar single point tooltip
	 * @param data associated values for the hovered bar
	 */
	getTooltipHTML(e: any) {
		const data = e.detail.data;
		const options = this.model.getOptions();
		const { bin } = data;
		console.log("data", data)
		const { value } = data.multidata[0];
		const { cartesianScales } = this.services;
		const { title: domainTitle } = Tools.getProperty(
			options,
			'axes',
			cartesianScales.getDomainAxisPosition()
		);
		const { title: rangeTitle } = Tools.getProperty(
			options,
			'axes',
			cartesianScales.getRangeAxisPosition()
		);
		const formattedValue = Tools.getProperty(
			this.model.getOptions(),
			'tooltip',
			'valueFormatter'
		)
			? this.model.getOptions().tooltip.valueFormatter(value)
			: value.toLocaleString('en');

		return `
		<ul class='multi-tooltip'>
			<li>
				<div class='title-val'>
					<p class='label'>${domainTitle}</p>
					<p class='value'>${bin.x0 + '-' + (bin.x1 - 1)}</p>
				</div>
			</li>
			<li>
				<div class='title-val'>
					<p class='label'>${rangeTitle}</p>
					<p class='value'>${formattedValue}</p>
				</div>
			</li>
		</ul>
		`;
	}

	/**
	 * Multip tooltips for bar charts include totals for each stack
	 * @param data
	 */
	getMultilineTooltipHTML(data: any) {
		const segments = data.multidata;
		const options = this.model.getOptions();

		segments.reverse();
		// in a vertical bar chart the tooltip should display in order of the drawn bars
		// in horizontal stacked bar, the order of the bars from Left to Right are displayed top down in tooltip
		if (
			this.services.cartesianScales.getOrientation() ===
			CartesianOrientations.VERTICAL
		) {
			segments.reverse();
		}

		// get the total for the stacked tooltip
		let total = segments.reduce((sum, item) => sum + item.value, 0);
		// format the total value
		total = Tools.getProperty(
			this.model.getOptions(),
			'tooltip',
			'valueFormatter'
		)
			? this.model.getOptions().tooltip.valueFormatter(total)
			: total.toLocaleString('en');

		const { groupMapsTo } = this.model.getOptions().data;
		const { bin } = data;
		const { cartesianScales } = this.services;
		const { title } = Tools.getProperty(
			options,
			'axes',
			cartesianScales.getDomainAxisPosition()
		);
		const titleHTML = `<li>
			<div class='title-val'>
				<p class='label'>${title}</p>
				<p class='value'>${bin.x0 + '-' + (bin.x1 - 1)}</p>
			</div>
		</li>`;
		const totalHTML = `<li>
			<div class='total-val'>
				<p class='label'>Total</p>
				<p class='value'>${total}</p>
			</div>
		</li>`;

		return (
			`<ul class='multi-tooltip'>` +
			titleHTML +
			segments
				.map((datum) => {
					const formattedValue = Tools.getProperty(
						this.model.getOptions(),
						'tooltip',
						'valueFormatter'
					)
						? this.model
								.getOptions()
								.tooltip.valueFormatter(datum.value)
						: datum.value.toLocaleString('en');
					const indicatorColor = this.model.getStrokeColor(
						datum[groupMapsTo]
					);

					return `
					<li>
						<div class="datapoint-tooltip">
							<a style="background-color:${indicatorColor}" class="tooltip-color"></a>
							<p class="label">${datum[groupMapsTo]}</p>
							<p class="value">${formattedValue}</p>
						</div>
					</li>`;
				})
				.join('') +
			totalHTML +
			`</ul>`
		);
	}
}
