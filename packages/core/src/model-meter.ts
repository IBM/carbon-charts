// Internal Imports
import * as Configuration from './configuration';
import { ChartModel } from './model';
import { Tools } from './tools';

/** The meter chart model layer which extends some of the data setting options.
 * Meter only uses 1 dataset
 *  */

export class MeterChartModel extends ChartModel {
	constructor(services: any) {
		super(services);
	}

	getMaximumDomain(data) {
		const max = data.reduce(
			(accumulator, datum) => accumulator + datum.value,
			0
		);
		return max;
	}

	/**
	 * Use a provided color for the bar or default to carbon color if no status provided.
	 * Defaults to carbon color otherwise.
	 * @param group dataset group label
	 */
	getFillColor(group: string) {
		const options = this.getOptions();
		const userProvidedScale = Tools.getProperty(options, 'color', 'scale');
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
		const dataValue = this.getDisplayData()[0].value;

		// use max value if the percentage is bigger than 100%
		const boundedValue = dataValue > 100 ? 100 : dataValue;

		// user needs to supply ranges
		const allRanges = Tools.getProperty(
			options,
			'meter',
			'status',
			'ranges'
		);

		if (allRanges) {
			const result = allRanges.filter(
				(step) =>
					step.range[0] <= boundedValue &&
					boundedValue <= step.range[1]
			);
			if (result.length > 0) {
				return result[0].status;
			}
		}

		return null;
	}
}
