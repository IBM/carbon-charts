// Internal Imports
import * as Configuration from './configuration';
import { Tools } from './tools';
import { Events, ScaleTypes, ColorClassNameTypes } from './interfaces';

// D3
import { scaleOrdinal } from 'd3-scale';
import { stack } from 'd3-shape';

/** The charting model layer which includes mainly the chart data and options,
 * as well as some misc. information to be shared among components */
export class ChartModel {
	protected services: any;

	// Internal Model state
	protected state: any = {
		options: {},
	};

	// Data labels
	/**
	 * A list of all the data groups that have existed within the lifetime of the chart
	 * @type string[]
	 */
	protected allDataGroups: string[];

	// Fill scales & fill related objects
	protected colorScale: any = {};

	protected colorClassNames: any = {};

	constructor(services: any) {
		this.services = services;
	}

	getAllDataFromDomain(groups?) {
		if (!this.getData()) {
			return null;
		}
		const options = this.getOptions();
		// Remove datasets that have been disabled
		let allData = this.getData();
		const dataGroups = this.getDataGroups();
		const { groupMapsTo } = Tools.getProperty(options, 'data');
		const axesOptions = Tools.getProperty(options, 'axes');

		// filter out the groups that are irrelevant to the component
		if (groups) {
			allData = allData.filter((item) => groups.includes(item.group));
		}

		if (axesOptions) {
			Object.keys(axesOptions).forEach((axis) => {
				const mapsTo = axesOptions[axis].mapsTo;
				const scaleType = axesOptions[axis].scaleType;
				// make sure linear/log values are numbers
				if (
					scaleType === ScaleTypes.LINEAR ||
					scaleType === ScaleTypes.LOG
				) {
					allData = allData.map((datum) => {
						return {
							...datum,
							[mapsTo]:
								datum[mapsTo] === null
									? datum[mapsTo]
									: Number(datum[mapsTo]),
						};
					});
				}

				// Check for custom domain
				if (mapsTo && axesOptions[axis].domain) {
					if (scaleType === ScaleTypes.LABELS) {
						allData = allData.filter((datum) =>
							axesOptions[axis].domain.includes(datum[mapsTo])
						);
					} else {
						const [start, end] = axesOptions[axis].domain;
						// Filter out data outside domain if that datapoint is using that axis (has mapsTo property)
						allData = allData.filter(
							(datum) =>
								!(mapsTo in datum) ||
								(datum[mapsTo] >= start && datum[mapsTo] <= end)
						);
					}
				}
			});
		}

		return allData.filter((datum) => {
			return dataGroups.find(
				(group) => group.name === datum[groupMapsTo]
			);
		});
	}

	/**
	 * Charts that have group configs passed into them, only want to retrieve the display data relevant to that chart
	 * @param groups the included datasets for the particular chart
	 */
	getDisplayData(groups?) {
		if (!this.get('data')) {
			return null;
		}

		const { ACTIVE } = Configuration.legend.items.status;
		const dataGroups = this.getDataGroups(groups);
		const { groupMapsTo } = this.getOptions().data;
		const allDataFromDomain = this.getAllDataFromDomain(groups);

		return allDataFromDomain.filter((datum) => {
			return dataGroups.find(
				(dataGroup) =>
					dataGroup.name === datum[groupMapsTo] &&
					dataGroup.status === ACTIVE
			);
		});
	}

	getData() {
		return this.get('data');
	}

	isDataEmpty() {
		return !this.getData().length;
	}

	/**
	 *
	 * @param newData The new raw data to be set
	 */
	setData(newData) {
		const sanitizedData = this.sanitize(Tools.clone(newData));
		const dataGroups = this.generateDataGroups(sanitizedData);

		this.set({
			data: sanitizedData,
			dataGroups,
		});

		return sanitizedData;
	}

	getDataGroups(groups?) {
		const isDataLoading = Tools.getProperty(
			this.getOptions(),
			'data',
			'loading'
		);

		// No data should be displayed while data is still loading
		if (isDataLoading) {
			return [];
		}

		// if its a combo chart, the specific chart will pass the model the groups it needs
		if (groups) {
			return this.get('dataGroups').filter((dataGroup) =>
				groups.includes(dataGroup.name)
			);
		}
		return this.get('dataGroups');
	}

	getActiveDataGroups(groups?) {
		const { ACTIVE } = Configuration.legend.items.status;

		return this.getDataGroups(groups).filter(
			(dataGroup) => dataGroup.status === ACTIVE
		);
	}

	getDataGroupNames(groups?) {
		const dataGroups = this.getDataGroups(groups);
		return dataGroups.map((dataGroup) => dataGroup.name);
	}

	getActiveDataGroupNames(groups?) {
		const activeDataGroups = this.getActiveDataGroups(groups);
		return activeDataGroups.map((dataGroup) => dataGroup.name);
	}

	getGroupedData(groups?) {
		const displayData = this.getDisplayData(groups);
		const groupedData = {};
		const { groupMapsTo } = this.getOptions().data;

		displayData.map((datum) => {
			const group = datum[groupMapsTo];
			if (
				groupedData[group] !== null &&
				groupedData[group] !== undefined
			) {
				groupedData[group].push(datum);
			} else {
				groupedData[group] = [datum];
			}
		});

		return Object.keys(groupedData).map((groupName) => ({
			name: groupName,
			data: groupedData[groupName],
		}));
	}

	getDataValuesGroupedByKeys(groups?) {
		const options = this.getOptions();
		const { groupMapsTo } = options.data;
		const displayData = this.getDisplayData(groups);

		const stackKeys = Tools.removeArrayDuplicates(
			displayData.map((datum) => {
				const domainIdentifier = this.services.cartesianScales.getDomainIdentifier(
					datum
				);
				return datum[domainIdentifier];
			})
		);
		const axisPosition = this.services.cartesianScales.domainAxisPosition;
		const scaleType = options.axes[axisPosition].scaleType;

		// Sort keys
		if (scaleType === ScaleTypes.TIME) {
			stackKeys.sort((a: any, b: any) => {
				const dateA: any = new Date(a);
				const dateB: any = new Date(b);

				return dateA - dateB;
			});
		} else if (
			scaleType === ScaleTypes.LOG ||
			scaleType === ScaleTypes.LINEAR
		) {
			stackKeys.sort((a: any, b: any) => a - b);
		}

		const dataGroupNames = this.getDataGroupNames();

		return stackKeys.map((key) => {
			const correspondingValues = { sharedStackKey: key };
			dataGroupNames.forEach((dataGroupName) => {
				const correspondingDatum = displayData.find((datum) => {
					const domainIdentifier = this.services.cartesianScales.getDomainIdentifier(
						datum
					);
					return (
						datum[groupMapsTo] === dataGroupName &&
						datum[domainIdentifier].toString() === key
					);
				});

				const rangeIdentifier = this.services.cartesianScales.getRangeIdentifier(
					correspondingValues
				);
				correspondingValues[dataGroupName] = correspondingDatum
					? correspondingDatum[rangeIdentifier]
					: null;
			});
			return correspondingValues;
		}) as any;
	}

	getStackedData({ percentage = false, groups = null }) {
		const options = this.getOptions();
		const { groupMapsTo } = options.data;

		const dataGroupNames = this.getDataGroupNames(groups);
		const dataValuesGroupedByKeys = this.getDataValuesGroupedByKeys(groups);

		if (percentage) {
			const maxByKey = Tools.fromPairs(
				dataValuesGroupedByKeys.map((d: any) => [d.sharedStackKey, 0])
			);

			dataValuesGroupedByKeys.forEach((d: any) => {
				dataGroupNames.forEach((name) => {
					maxByKey[d.sharedStackKey] += d[name];
				});
			});

			// cycle through data values to get percentage
			dataValuesGroupedByKeys.forEach((d: any) => {
				dataGroupNames.forEach((name) => {
					if (maxByKey[d.sharedStackKey]) {
						d[name] = (d[name] / maxByKey[d.sharedStackKey]) * 100;
					} else {
						d[name] = 0;
					}
				});
			});
		}

		return stack()
			.keys(dataGroupNames)(dataValuesGroupedByKeys)
			.map((series, i) => {
				// Add data group names to each series
				return Object.keys(series)
					.filter((key: any) => !isNaN(key))
					.map((key) => {
						const element = series[key];
						element[groupMapsTo] = dataGroupNames[i];

						return element;
					});
			});
	}

	/**
	 * @return {Object} The chart's options
	 */
	getOptions() {
		return this.state.options;
	}

	set(newState: any, configs?: any) {
		this.state = Object.assign({}, this.state, newState);
		const newConfig = Object.assign(
			{ skipUpdate: false, animate: true }, // default configs
			configs
		);
		if (!newConfig.skipUpdate) {
			this.update(newConfig.animate);
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
	 */
	setOptions(newOptions) {
		const options = this.getOptions();
		Tools.updateLegendAdditionalItems(options, newOptions);

		this.set({
			options: Tools.merge(options, newOptions),
		});
	}

	/**
	 *
	 * Updates miscellanous information within the model
	 * such as the color scales, or the legend data labels
	 */
	update(animate = true) {
		if (!this.getDisplayData()) {
			return;
		}

		this.updateAllDataGroups();

		this.setCustomColorScale();
		this.setColorClassNames();
		this.services.events.dispatchEvent(Events.Model.UPDATE, { animate });
	}

	/*
	 * Data labels
	 */
	toggleDataLabel(changedLabel: string) {
		const { ACTIVE, DISABLED } = Configuration.legend.items.status;
		const dataGroups = this.getDataGroups();

		const hasDeactivatedItems = dataGroups.some(
			(group) => group.status === DISABLED
		);
		const activeItems = dataGroups.filter(
			(group) => group.status === ACTIVE
		);

		// If there are deactivated items, toggle "changedLabel"
		if (hasDeactivatedItems) {
			// If the only active item is being toggled
			// Activate all items
			if (
				activeItems.length === 1 &&
				activeItems[0].name === changedLabel
			) {
				// If every item is active, then enable "changedLabel" and disable all other items
				dataGroups.forEach((group, i) => {
					dataGroups[i].status = ACTIVE;
				});
			} else {
				const indexToChange = dataGroups.findIndex(
					(group) => group.name === changedLabel
				);
				dataGroups[indexToChange].status =
					dataGroups[indexToChange].status === DISABLED
						? ACTIVE
						: DISABLED;
			}
		} else {
			// If every item is active, then enable "changedLabel" and disable all other items
			dataGroups.forEach((group, i) => {
				dataGroups[i].status =
					group.name === changedLabel ? ACTIVE : DISABLED;
			});
		}

		// Updates selected groups
		const updatedActiveItems = dataGroups.filter(
			(group) => group.status === ACTIVE
		);
		const options = this.getOptions();

		const hasUpdatedDeactivatedItems = dataGroups.some(
			(group) => group.status === DISABLED
		);

		// If there are deactivated items, map the item name into selected groups
		if (hasUpdatedDeactivatedItems) {
			options.data.selectedGroups = updatedActiveItems.map(
				(activeItem) => activeItem.name
			);
		} else {
			// If every item is active, clear array
			options.data.selectedGroups = [];
		}

		// dispatch legend filtering event with the status of all the dataLabels
		this.services.events.dispatchEvent(Events.Legend.ITEMS_UPDATE, {
			dataGroups,
		});

		// Update model
		this.set({
			dataGroups,
		});
	}

	/**
	 * Should the data point be filled?
	 * @param group
	 * @param key
	 * @param value
	 * @param defaultFilled the default for this chart
	 */
	getIsFilled(group: any, key?: any, data?: any, defaultFilled?: boolean) {
		const options = this.getOptions();
		if (options.getIsFilled) {
			return options.getIsFilled(group, key, data, defaultFilled);
		} else {
			return defaultFilled;
		}
	}

	getFillColor(group: any, key?: any, data?: any) {
		const options = this.getOptions();
		const defaultFillColor = Tools.getProperty(this.colorScale, group);

		if (options.getFillColor) {
			return options.getFillColor(group, key, data, defaultFillColor);
		} else {
			return defaultFillColor;
		}
	}

	getStrokeColor(group: any, key?: any, data?: any) {
		const options = this.getOptions();
		const defaultStrokeColor = Tools.getProperty(this.colorScale, group);

		if (options.getStrokeColor) {
			return options.getStrokeColor(group, key, data, defaultStrokeColor);
		} else {
			return defaultStrokeColor;
		}
	}

	isUserProvidedColorScaleValid() {
		const userProvidedScale = Tools.getProperty(
			this.getOptions(),
			'color',
			'scale'
		);
		const dataGroups = this.getDataGroups();

		if (
			userProvidedScale == null ||
			Object.keys(userProvidedScale).length == 0
		) {
			return false;
		}

		return dataGroups.some((dataGroup) =>
			Object.keys(userProvidedScale).includes(dataGroup.name)
		);
	}

	getColorClassName(configs: {
		classNameTypes: ColorClassNameTypes[];
		dataGroupName?: string;
		originalClassName?: string;
	}) {
		const colorPairingTag = this.colorClassNames(configs.dataGroupName);
		let className = configs.originalClassName;
		configs.classNameTypes.forEach(
			(type) =>
				(className = configs.originalClassName
					? `${className} ${type}-${colorPairingTag}`
					: `${type}-${colorPairingTag}`)
		);

		return className;
	}

	/**
	 * For charts that might hold an associated status for their dataset
	 */
	getStatus() {
		return null;
	}

	getAllDataGroupsNames() {
		return this.allDataGroups;
	}

	/**
	 * Converts data provided in the older format to tabular
	 *
	 */
	protected transformToTabularData(data) {
		console.warn(
			"We've updated the charting data format to be tabular by default. The current format you're using is deprecated and will be removed in v1.0, read more here https://carbon-design-system.github.io/carbon-charts/?path=/story/docs-tutorials--tabular-data-format"
		);
		const tabularData = [];
		const { datasets, labels } = data;

		// Loop through all datasets
		datasets.forEach((dataset) => {
			// Update each data point to the new format
			dataset.data.forEach((datum, i) => {
				let group;

				const datasetLabel = Tools.getProperty(dataset, 'label');
				if (datasetLabel === null) {
					const correspondingLabel = Tools.getProperty(labels, i);
					if (correspondingLabel) {
						group = correspondingLabel;
					} else {
						group = 'Ungrouped';
					}
				} else {
					group = datasetLabel;
				}

				const updatedDatum = {
					group,
					key: labels[i],
				};

				if (isNaN(datum)) {
					updatedDatum['value'] = datum.value;
					updatedDatum['date'] = datum.date;
				} else {
					updatedDatum['value'] = datum;
				}

				tabularData.push(updatedDatum);
			});
		});

		return tabularData;
	}

	protected getTabularData(data) {
		// if data is not an array
		if (!Array.isArray(data)) {
			return this.transformToTabularData(data);
		}

		return data;
	}

	protected sanitize(data) {
		data = this.getTabularData(data);

		return data;
	}

	/*
	 * Data groups
	 */
	protected updateAllDataGroups() {
		// allDataGroups is used to generate a color scale that applies
		// to all the groups. Now when the data updates, you might remove a group,
		// and then bring it back in a newer data update, therefore
		// the order of the groups in allDataGroups matters so that you'd never
		// have an incorrect color assigned to a group.

		// Also, a new group should only be added to allDataGroups if
		// it doesn't currently exist

		if (!this.allDataGroups) {
			this.allDataGroups = this.getDataGroupNames();
		} else {
			// Loop through current data groups
			this.getDataGroupNames().forEach((dataGroupName) => {
				// If group name hasn't been stored yet, store it
				if (this.allDataGroups.indexOf(dataGroupName) === -1) {
					this.allDataGroups.push(dataGroupName);
				}
			});
		}
	}

	protected generateDataGroups(data) {
		const { groupMapsTo } = this.getOptions().data;
		const { ACTIVE, DISABLED } = Configuration.legend.items.status;
		const options = this.getOptions();

		const uniqueDataGroups = Tools.removeArrayDuplicates(
			data.map((datum) => datum[groupMapsTo])
		);

		// check if selectedGroups can be applied to chart with current data groups
		if (options.data.selectedGroups.length) {
			const hasAllSelectedGroups = options.data.selectedGroups.every(
				(groupName) => uniqueDataGroups.includes(groupName)
			);
			if (!hasAllSelectedGroups) {
				options.data.selectedGroups = [];
			}
		}

		// Get group status based on items in selected groups
		const getStatus = (groupName) =>
			!options.data.selectedGroups.length ||
			options.data.selectedGroups.includes(groupName)
				? ACTIVE
				: DISABLED;

		return uniqueDataGroups.map((groupName) => ({
			name: groupName,
			status: getStatus(groupName),
		}));
	}

	/*
	 * Fill scales
	 */
	protected setCustomColorScale() {
		if (!this.isUserProvidedColorScaleValid()) {
			return;
		}

		const options = this.getOptions();
		const userProvidedScale = Tools.getProperty(options, 'color', 'scale');

		Object.keys(userProvidedScale).forEach((dataGroup) => {
			if (!this.allDataGroups.includes(dataGroup)) {
				console.warn(`"${dataGroup}" does not exist in data groups.`);
			}
		});

		/**
		 * Go through allDataGroups. If a data group has a color value provided
		 * by the user, add that to the color range
		 */
		const providedDataGroups = this.allDataGroups.filter(
			(dataGroup) => userProvidedScale[dataGroup]
		);

		providedDataGroups.forEach(
			(dataGroup) =>
				(this.colorScale[dataGroup] = userProvidedScale[dataGroup])
		);
	}

	/*
	 * Color palette
	 */
	protected setColorClassNames() {
		const colorPairingOptions = Tools.getProperty(
			this.getOptions(),
			'color',
			'pairing'
		);

		// Check if user has defined numberOfVariants (differ from given data)
		let numberOfVariants = Tools.getProperty(
			colorPairingOptions,
			'numberOfVariants'
		);
		if (!numberOfVariants || numberOfVariants < this.allDataGroups.length) {
			numberOfVariants = this.allDataGroups.length;
		}

		let pairingOption = Tools.getProperty(colorPairingOptions, 'option');
		const colorPairingCounts = Configuration.color.pairingOptions;

		// If number of dataGroups is greater than 5, user 14-color palette
		const numberOfColors = numberOfVariants > 5 ? 14 : numberOfVariants;

		// Use default palette if user choice is not in range
		pairingOption =
			pairingOption <= colorPairingCounts[`${numberOfColors}-color`]
				? pairingOption
				: 1;

		// Create color classes for graph, tooltip and stroke use
		const colorPairing = this.allDataGroups.map(
			(dataGroup, index) =>
				`${numberOfColors}-${pairingOption}-${(index % 14) + 1}`
		);

		// Create default color classnames
		this.colorClassNames = scaleOrdinal()
			.range(colorPairing)
			.domain(this.allDataGroups);
	}
}
