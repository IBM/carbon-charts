// Internal Imports
import * as Configuration from "./configuration";
import { ChartModel } from "./model";
import * as colorPalettes from "./services/colorPalettes";
import { Tools } from "./tools";

/** The meter chart model layer which extends some of the data setting options.
 * Meter only uses 1 dataset
 *  */

export class MeterChartModel extends ChartModel {
	constructor(services: any) {
		super(services);
	}

	generateDataLabels(newData) {
		const dataLabels = {};
		dataLabels[newData.label] = Configuration.legend.items.status.ACTIVE;

		return dataLabels;
	}

	getDisplayData() {
		if (!this.get("data")) {
			return null;
		}
		// meter only uses displays one data group and value
		return this.get("data")[0];
	}

	/**
	 * Use a provided color for the bar or default to carbon color if no status provided.
	 * Defaults to carbon color otherwise.
	 * @param group dataset group label
	 */
	getFillColor(group: string) {
		const options = this.getOptions();
		const userProvidedScale = Tools.getProperty(options, "color", "scale");
		const status = this.getStatus();
		// user provided a fill color or there isn't a status we can use the colorScale
		if (userProvidedScale || !status) {
			return super.getFillColor(group);
		} else {
			return null;
		}
	}

	/**
	 * Get the associated status for the data by checking the ranges
	 */
	getStatus() {
		const options = this.getOptions();
		const dataValue = this.getDisplayData().value;

		// user needs to supply ranges
		const allRanges = Tools.getProperty(
			options,
			"meter",
			"status",
			"ranges"
		);
		if (allRanges) {
			const result = allRanges.filter(
				(step) =>
					step.range[0] <= dataValue && dataValue <= step.range[1]
			);
			if (result.length > 0) {
				return result[0].status;
			}
		}

		return null;
	}
}
