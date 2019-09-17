// Internal Imports
import * as Configuration from "./configuration";
import { Tools } from "./tools";
import * as colorPalettes from "./services/colorPalettes";

// D3
import { scaleOrdinal } from "d3-scale";

/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
export class ChartModel {
	// Callbacks
	/**
	 * Function to be called when data or options update within the model
	 * @type Function
	 */
	protected updateCallback: Function;

	// Internal Model state
	protected state: any = {};

	// Data labels
	/**
	 * A list of all the labels that have existed within the lifetime of the chart
	 * @type Array<string>
	 */
	protected allDataLabels: Array<string>;

	// Fill scales & fill related objects
	protected patternScale = {};
	protected colorScale: any = {};

	/**
	 * @return {Array} The chart's display data
	 */
	getDisplayData(processor?: Function) {
		const { ACTIVE } = Configuration.legend.items.status;
		const dataLabels = this.get("dataLabels");

		if (this.get("data")) {
			// Remove datasets that have been disabled
			const displayData = Tools.clone(this.get("data"));
			displayData.datasets = displayData.datasets.filter(dataset => {
				return dataLabels[dataset.label] === ACTIVE;
			});

			return displayData;
		}

		return null;
	}

	/**
	 * @return {Array} The chart's display data
	 */
	getData() {
		return this.get("data");
	}

	/**
	 *
	 * @param newData The new raw data to be set
	 * @return {Promise} The new display data that has been set
	 */
	setData(newData) {
		const dataLabels = {};
		newData.datasets.forEach(dataset => {
			dataLabels[dataset.label] = Configuration.legend.items.status.ACTIVE;
		});

		this.set({
			data: newData,
			dataLabels
		});

		return this.state.data;
	}

	/**
	 * @return {Object} The chart's options
	 */
	getOptions() {
		return this.state.options;
	}

	set(newState: any, skipUpdate?: boolean) {
		this.state = Object.assign({}, this.state, newState);

		if (!skipUpdate) {
			this.update();
		}
	}

	get(property?: string) {
		if (property) {
			return this.state[property];
		} else {
			return this.state;
		}
	}

	/**
	 *
	 * @param newOptions New options to be set
	 * @return {Object} The chart's options
	 */
	setOptions(newOptions) {
		this.set({
			options: newOptions
		});
	}


	/**
	 *
	 * @param newData New data to be set
	 * @param newOptions New options to be set
	 */
	setDataAndOptions(newData, newOptions) {
		if (newOptions) {
			this.setOptions(newOptions);
		}

		if (newData) {
			this.setData(newData);
		}
	}

	/**
	 *
	 * Updates miscellanous information within the model
	 * such as the color scales, or the legend data labels
	 */
	update() {
		if (this.getDisplayData()) {
			this.updateAllDataLabels();
			this.setColorScale();

			this.updateCallback();
		}
	}

	setUpdateCallback(cb: Function) {
		this.updateCallback = cb;
	}

	/*
	 * Data labels
	 *
	*/
	protected updateAllDataLabels() {
		// If allDataLabels hasn't been initialized yet
		// Set it to the current set of chart labels
		if (!this.allDataLabels) {
			this.allDataLabels = this.getDisplayData().labels;
		} else {
			// Loop through current chart labels
			this.getDisplayData().labels.forEach(label => {
				// If label hasn't been stored yet, store it
				if (this.allDataLabels.indexOf(label) === -1) {
					this.allDataLabels.push(label);
				}
			});
		}
	}

	toggleDataset(changedLabel: string) {
		const { ACTIVE, DISABLED } = Configuration.legend.items.status;
		const dataLabels = this.get("dataLabels");

		const hasDeactivatedItems = Object.keys(dataLabels).some(label => dataLabels[label] === DISABLED);
		// If there are deactivated items, toggle "changedLabel"
		if (hasDeactivatedItems) {
			dataLabels[changedLabel] = dataLabels[changedLabel] === DISABLED ? ACTIVE : DISABLED;
		} else {
			// If every item is active, then enable "changedLabel" and disable all other items
			Object.keys(dataLabels).forEach(label => {
				dataLabels[label] = (label === changedLabel ? ACTIVE : DISABLED);
			});
		}

		// Update model
		this.set({
			dataLabels
		});
	}

	/*
	 * Fill scales
	 *
	*/
	setColorScale() {
		if (this.getDisplayData().datasets[0].backgroundColors) {
			this.getDisplayData().datasets.forEach(dataset => {
				this.colorScale[dataset.label] = scaleOrdinal().range(dataset.backgroundColors).domain(this.allDataLabels);
			});
		} else {
			const colors = colorPalettes.DEFAULT;
			this.getDisplayData().datasets.forEach((dataset, i) => {
				this.colorScale[dataset.label] = scaleOrdinal().range([colors[i]]).domain(this.allDataLabels);
			});
		}
	}

	getFillColor(datasetLabel: any, label?: any, value?: any) {
		if (this.get("options").getFillColor && !this.get("options").accessibility) {
			return this.get("options").getFillColor(datasetLabel, label, value) || this.getFillScale()[datasetLabel](label);
		} else {
			return this.getFillScale()[datasetLabel](label);
		}
	}

	getStrokeColor(datasetLabel: any, label?: any, value?: any) {
		if (this.get("options").getStrokeColor) {
			return this.get("options").getStrokeColor(datasetLabel, label, value) || this.colorScale[datasetLabel](label);
		} else {
			return this.colorScale[datasetLabel](label);
		}
	}

	getFillScale() {
		// Choose patternScale or colorScale based on the "accessibility" flag
		return this.get("options").accessibility ? this.patternScale : this.colorScale;
	}
}
