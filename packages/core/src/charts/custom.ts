// Internal Imports
import { Chart } from "../chart";
import * as Configuration from "../configuration";
import { ChartConfig } from "../interfaces/index";
import { Tools } from "../tools";

export class CustomChart extends Chart {
	constructor(holder: Element, chartConfigs: ChartConfig<any>) {
		super(holder, chartConfigs);

		// Merge all possible default options together
		let optionsToMerge = {};
		Object.keys(Configuration.options).forEach((optionName) => {
			const options = Configuration.options[optionName];

			optionsToMerge = Tools.merge({}, optionsToMerge, options);
		});

		// Merge the default options with the user provided options
		this.model.setOptions(
			Tools.mergeDefaultChartOptions(optionsToMerge, chartConfigs.options)
		);

		// Initialize data, services, components etc.
		this.init(holder, chartConfigs);
	}

	getComponents() {
		const userProvidedComponents = Tools.getProperty(
			this.model.getOptions(),
			"components"
		);

		return userProvidedComponents.map(
			(userProvidedComponent) =>
				new userProvidedComponent.component(
					this.model,
					this.services,
					userProvidedComponent.configs
				)
		);
	}
}
