import { Component } from "../component";
import { Tools } from "../../tools";
import { DOMUtils } from "../../services";
import { ChartModel } from "../../model";
import { Events, ScaleTypes, TruncationTypes } from "../../interfaces";

// Carbon modal
import { Modal as CarbonModalComponent } from "carbon-components";

// import the settings for the css prefix
import settings from "carbon-components/es/globals/js/settings";

// D3 Imports
import { select } from "d3-selection";

// date formatting
import { format } from "date-fns";

export class Modal extends Component {
	type = "modal";

	// flag for checking whether tooltip event listener is added or not
	isEventListenerAdded = false;
	modal: any;

	constructor(model: ChartModel, services: any, configs?: any) {
		super(model, services, configs);

		this.init();
	}

	handleShowModal = () => {
		this.modal.html(this.getModalHTML());

		const modalInstance = CarbonModalComponent.create(this.modal.node());
		modalInstance.show();
	};

	handleHideModal = () => {};

	addEventListeners() {
		// listen to show-modal Custom Events to render the modal
		this.services.events.addEventListener(
			Events.Modal.SHOW,
			this.handleShowModal
		);

		// listen to hide-modal Custom Events to hide the modal
		this.services.events.addEventListener(
			Events.Modal.HIDE,
			this.handleHideModal
		);
	}

	removeEventListeners() {
		// remove show-modal Custom Events
		this.services.events.removeEventListener(
			Events.Modal.SHOW,
			this.handleShowModal
		);

		// remove hide-modal Custom Events
		this.services.events.removeEventListener(
			Events.Modal.HIDE,
			this.handleHideModal
		);
	}

	getModalHTML() {
		const displayData = this.model.getDisplayData();
		const options = this.model.getOptions();
		const { groupMapsTo } = options.data;

		const { cartesianScales } = this.services;
		const domainIdentifier = cartesianScales.getDomainIdentifier();
		const rangeIdentifier = cartesianScales.getRangeIdentifier();
		const domainScaleType = cartesianScales.getDomainAxisScaleType();

		let domainValueFormatter;
		if (domainScaleType === ScaleTypes.TIME) {
			domainValueFormatter = (d) => format(d, "MMM d, yyyy");
		}

		// domain & range labels
		const domainLabel = cartesianScales.getDomainLabel();
		const rangeLabel = cartesianScales.getRangeLabel();

		return `
		<div class="bx--modal-container">
			<div class="bx--modal-header">
			<p class="bx--modal-header__label bx--type-delta" id="modal-5ppouesvfhc-label">Optional label</p>
			<p class="bx--modal-header__heading bx--type-beta" id="modal-5ppouesvfhc-heading">Charting data</p>
			<button class="bx--modal-close" type="button" data-modal-close aria-label="close modal"  data-modal-primary-focus>
				<svg class="bx--modal-close__icon" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
					<title>Close Modal</title>
					<path d="M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z" fill-rule="nonzero"
					/>
				</svg>
			</button>
			</div>

			<div class="bx--modal-content">
				<table class="bx--data-table bx--data-table--no-border">
					<thead>
						<tr>
							<th scope="col">
								<div class="bx--table-header-label">Group</div>
							</th>
							<th scope="col">
								<div class="bx--table-header-label">${domainLabel}</div>
							</th>
							<th scope="col">
								<div class="bx--table-header-label">${rangeLabel}</div>
							</th>
						</tr>
					</thead>
					<tbody>
						${displayData
							.map(
								(datum) => `
							<tr>
								<td>${datum[groupMapsTo]}</td>
								<td>${
									datum[domainIdentifier] === null
										? "&ndash;"
										: domainValueFormatter
										? domainValueFormatter(
												datum[domainIdentifier]
										  )
										: datum[domainIdentifier]
								}</td>
								<td>${datum[rangeIdentifier] === null ? "&ndash;" : datum[rangeIdentifier]}</td>
							</tr>
						`
							)
							.join("")}
					</tbody>
				</table>
			</div>

		</div>`;
	}

	render() {
		const options = this.model.getOptions();
		if (!this.isEventListenerAdded) {
			// Grab the tooltip element
			const holder = select(this.services.domUtils.getHolder());
			const chartprefix = Tools.getProperty(options, "style", "prefix");
			this.modal = DOMUtils.appendOrSelect(
				holder,
				`div.${settings.prefix}--${chartprefix}--modal`
			);

			this.addEventListeners();
			this.isEventListenerAdded = true;
			this.modal
				.attr("data-modal", true)
				.attr("class", "bx--modal")
				.attr("role", "dialog")
				.attr("aria-modal", true)
				.attr("aria-labelledby", "modal-5ppouesvfhc-label")
				.attr("aria-describedby", "modal-5ppouesvfhc-heading")
				.attr("tabindex", -1);
		}
	}

	destroy() {
		// remove tooltip eventListener
		this.removeEventListeners();
		this.isEventListenerAdded = false;
	}
}
