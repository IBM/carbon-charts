// Internal Imports
import { Title } from './title';
import { DOMUtils } from '../../services';
import { Tools } from '../../tools';
import { Statuses } from './../../interfaces/enums';
import * as Configuration from '../../configuration';

export class MeterTitle extends Title {
	type = 'meter-title';

	render() {
		const dataset = this.model.getDisplayData()[0];
		const options = this.getOptions();
		const svg = this.getContainerSVG();
		const { groupMapsTo } = options.data;

		const proportional = Tools.getProperty(
			options,
			'meter',
			'proportional'
		);

		if (proportional) {
			this.displayTotal();
			this.displayBreakdownTitle();
		} else {
			// the title for a meter, is the label for that dataset
			const title = svg
				.selectAll('text.meter-title')
				.data([dataset[groupMapsTo]]);

			title
				.enter()
				.append('text')
				.classed('meter-title', true)
				.merge(title)
				.attr('x', 0)
				.attr('y', '1em')
				.text((d) => d);

			title.exit().remove();


			// appends the associated percentage after title
			this.appendPercentage();

			// if status ranges are provided (custom or default), display indicator
			this.displayStatus();

		}
		// get the max width of a title (with consideration for the status/percentage)
		const maxWidth = this.getMaxTitleWidth();
		const titleElement = DOMUtils.appendOrSelect(
			svg,
			'text.meter-title'
		);

		if (
			maxWidth > 0 &&
			titleElement.node().getComputedTextLength() > maxWidth
		) {
			this.truncateTitle(titleElement, maxWidth);
		}

	}

	displayBreakdownTitle() {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.getOptions();
		const datasetsTotal = this.model.getMaximumDomain(
			this.model.getDisplayData()
		);
		const total = Tools.getProperty(
			options,
			'meter',
			'proportional',
			'total'
		);
		const unit = Tools.getProperty(options, 'meter', 'proportional', 'unit')
			? Tools.getProperty(options, 'meter', 'proportional', 'unit')
			: '';

		let data;
		if (datasetsTotal === total) {
			data = null;
		} else {
			const difference =
				total !== null ? total - datasetsTotal : datasetsTotal;
			//breakdownFormatter
			const breakdownFormatter = Tools.getProperty(
				options,
				'meter',
				'proportional',
				'breakdownFormatter'
			);
			data =
				breakdownFormatter !== null
					? breakdownFormatter({
						datasetsTotal: datasetsTotal,
						total: total,
					})
					: `${datasetsTotal} ${unit} used (${difference} ${unit} available)`;
		}

		// the breakdown part to whole of the datasets to the overall total
		const title = svg
			.selectAll('text.proportional-meter-title')
			.data([data]);

		title
			.enter()
			.append('text')
			.classed('proportional-meter-title', true)
			.merge(title)
			.attr('x', 0)
			.attr('y', '1em')
			.text((d) => d);

		title.exit().remove();

		const maxWidth = this.getMaxTitleWidth();
		const titleElement = DOMUtils.appendOrSelect(
			svg,
			'text.proportional-meter-title'
		);

		if (
			maxWidth > 0 &&
			titleElement.node().getComputedTextLength() > maxWidth
		) {
			this.truncateTitle(titleElement, maxWidth);
		}
	}

	// show the total for prop meter
	displayTotal() {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.getOptions();

		const total = Tools.getProperty(
			options,
			'meter',
			'proportional',
			'total'
		)
			? Tools.getProperty(options, 'meter', 'proportional', 'total')
			: this.model.getMaximumDomain(this.model.getDisplayData());
		const unit = Tools.getProperty(options, 'meter', 'proportional', 'unit')
			? Tools.getProperty(options, 'meter', 'proportional', 'unit')
			: '';

		// totalFormatter function
		const totalFormatter = Tools.getProperty(
			options,
			'meter',
			'proportional',
			'totalFormatter'
		);

		const totalString =
			totalFormatter !== null
				? totalFormatter(total)
				: `${total} ${unit} total`;

		const containerBounds = DOMUtils.getSVGElementSize(
			this.services.domUtils.getMainSVG(),
			{ useAttr: true }
		);

		// need to check if the width is 0, and try to use the parent attribute
		// this can happen if the chart is toggled on/off and the height is 0 for the parent, it wont validateDimensions
		const containerWidth = containerBounds.width
			? containerBounds.width
			: this.parent.node().getAttribute('width');

		const title = svg
			.selectAll('text.proportional-meter-total')
			.data([totalString]);

		title
			.enter()
			.append('text')
			.classed('proportional-meter-total', true)
			.merge(title)
			.attr('x', containerWidth)
			.attr('y', '1em')
			.attr('text-anchor', 'end')
			.text((d) => d);

		title.exit().remove();
	}

	/**
	 * Appends the corresponding status based on the value and the peak.
	 */
	displayStatus() {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.getOptions();

		const containerBounds = DOMUtils.getSVGElementSize(
			this.services.domUtils.getMainSVG(),
			{ useAttr: true }
		);

		// need to check if the width is 0, and try to use the parent attribute
		// this can happen if the chart is toggled on/off and the height is 0 for the parent, it wont validateDimensions
		const containerWidth = containerBounds.width
			? containerBounds.width
			: this.parent.node().getAttribute('width');

		// get the status from the model
		const status = this.model.getStatus();
		const radius = Configuration.meter.status.indicatorSize / 2;

		// create a group for the icon/inner path
		const statusGroup = DOMUtils.appendOrSelect(svg, `g.status-indicator`)
			.attr(
				'class',
				status !== null ? `status-indicator status--${status}` : ''
			)
			.attr('transform', `translate(${containerWidth - radius}, 0)`);

		const data = status ? [status] : [];
		const icon = statusGroup.selectAll('circle.status').data(data);

		icon.enter()
			.append('circle')
			.merge(icon)
			.attr('class', 'status')
			.attr('r', radius)
			.attr('cx', 0)
			.attr('cy', `calc(1em / 2)`);

		const innerIcon = statusGroup.selectAll('path.innerFill').data(data);

		innerIcon
			.enter()
			.append('path')
			.merge(innerIcon)
			.attr('d', self.getStatusIconPathString(status))
			.attr('transform', `translate(-${radius}, 0)`)
			.attr('class', 'innerFill');

		innerIcon.exit().remove();
		icon.exit().remove();
	}

	/**
	 * Appends the associated percentage to the end of the title
	 */
	appendPercentage() {
		const dataValue = this.model.getDisplayData()[0].value;

		// use the title's position to append the percentage to the end
		const svg = this.getContainerSVG();
		const title = DOMUtils.appendOrSelect(svg, 'text.meter-title');

		// check if it is enabled
		const data =
			Tools.getProperty(
				this.getOptions(),
				'meter',
				'statusBar',
				'percentageIndicator',
				'enabled'
			) === true
				? [dataValue]
				: [];

		// append a percentage if it is enabled, update it
		const percentage = svg.selectAll('text.percent-value').data(data);

		// the horizontal offset of the percentage value from the title
		const offset = Configuration.meter.statusBar.paddingRight;

		percentage
			.enter()
			.append('text')
			.classed('percent-value', true)
			.merge(percentage)
			.text((d) => `${d}%`)
			.attr(
				'x',
				+title.attr('x') + title.node().getComputedTextLength() + offset
			) // set the position to after the title
			.attr('y', title.attr('y'));

		percentage.exit().remove();
	}

	/**
	 * Uses the parent class truncate logic
	 * @param title d3 selection of title element that will be truncated
	 * @param titlestring the original string that needs truncation
	 * @param maxWidth the max width the title can take
	 */
	truncateTitle(title, maxWidth) {
		super.truncateTitle(title, maxWidth);

		// update the position on the percentage to be inline with the title
		const tspan = DOMUtils.appendOrSelect(this.parent, 'tspan');
		const offset = Configuration.meter.statusBar.paddingRight;
		const tspanLength = Math.ceil(tspan.node().getComputedTextLength());

		const percentage = DOMUtils.appendOrSelect(
			this.parent,
			'text.percent-value'
		);
		percentage.attr(
			'x',
			+title.attr('x') +
			title.node().getComputedTextLength() +
			tspanLength +
			offset
		);
	}

	// computes the maximum space a title can take
	protected getMaxTitleWidth() {
		// get a reference to the title elements to calculate the size the title can be
		const containerBounds = DOMUtils.getSVGElementSize(
			this.services.domUtils.getMainSVG(),
			{ useAttr: true }
		);

		const proportional = Tools.getProperty(
			this.getOptions(),
			'meter',
			'proportional'
		);

		// need to check if the width is 0, and try to use the parent attribute
		const containerWidth = containerBounds.width
			? containerBounds.width
			: this.parent.node().getAttribute('width');

		if (proportional !== null) {
			const total = DOMUtils.appendOrSelect(
				this.parent,
				'text.proportional-meter-total'
			).node();

			const  totalWidth = DOMUtils.getSVGElementSize(total, { useBBox: true })
				.width;

			return containerWidth - totalWidth - Configuration.meter.total.paddingLeft;
		} else {
			const percentage = DOMUtils.appendOrSelect(
				this.parent,
				'text.percent-value'
			);
			// the title needs to fit the width of the container without crowding the status, and percentage value
			const offset = Configuration.meter.statusBar.paddingRight;
			const percentageWidth = percentage.node().getComputedTextLength();

			const statusGroup = DOMUtils.appendOrSelect(
				this.parent,
				'g.status-indicator'
			).node();
			const statusWidth =
				DOMUtils.getSVGElementSize(statusGroup, { useBBox: true })
					.width + Configuration.meter.status.paddingLeft;

			return containerWidth - percentageWidth - offset - statusWidth;
		}
	}

	/**
	 * Get the associated status icon for the data
	 * @param status the active status for the meter chart
	 */
	protected getStatusIconPathString(status) {
		switch (status) {
			case Statuses.SUCCESS:
				return 'M6.875 11.3125 3.75 8.1875 4.74375 7.25 6.875 9.34375 11.50625 4.75 12.5 5.7375 Z';
			case Statuses.DANGER:
				return 'M10.7 11.5 4.5 5.3 5.3 4.5 11.5 10.7 Z';
			case Statuses.WARNING:
				return 'M7.9375,11.125 C7.41973305,11.125 7,11.544733 7,12.0625 C7,12.580267 7.41973305,13 7.9375,13 C8.45526695,13 8.875,12.580267 8.875,12.0625 C8.875,11.544733 8.45526695,11.125 7.9375,11.125 M7.3125, 3 8.5625, 3 8.5625, 9.875 7.3125, 9.875, 7.3125, 3 Z';
		}
	}
}
