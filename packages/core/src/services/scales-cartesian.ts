// Internal Imports
import * as Configuration from '../configuration';
import { Service } from './service';
import {
	AxisPositions,
	CartesianOrientations,
	ScaleTypes,
	ThresholdOptions,
} from '../interfaces';
import { Tools } from '../tools';

// D3 Imports
import { scaleBand, scaleLinear, scaleTime, scaleLog } from 'd3-scale';
import { extent, sum } from 'd3-array';

// Misc
import {
	differenceInYears,
	addYears,
	subYears,
	differenceInMonths,
	addMonths,
	subMonths,
	differenceInDays,
	addDays,
	subDays,
	differenceInHours,
	addHours,
	subHours,
	differenceInMinutes,
	addMinutes,
	subMinutes,
	differenceInSeconds,
	subSeconds,
	addSeconds,
} from 'date-fns';

export class CartesianScales extends Service {
	protected scaleTypes = {
		top: null,
		right: null,
		bottom: null,
		left: null,
	};

	protected scales = {
		top: null,
		right: null,
		bottom: null,
		left: null,
	};

	protected domainAxisPosition: AxisPositions;
	protected rangeAxisPosition: AxisPositions;
	protected secondaryDomainAxisPosition: AxisPositions;
	protected secondaryRangeAxisPosition: AxisPositions;

	protected dualAxes: Boolean;

	protected orientation: CartesianOrientations;

	getDomainAxisPosition({ datum = null } = {}) {
		if (this.dualAxes && datum) {
			const options = this.model.getOptions();
			const { groupMapsTo } = options.data;
			const axesOptions = Tools.getProperty(
				options,
				'axes',
				this.secondaryDomainAxisPosition
			);
			const dataset = datum[groupMapsTo];
			if (
				axesOptions?.correspondingDatasets &&
				axesOptions.correspondingDatasets.includes(dataset)
			) {
				return this.secondaryDomainAxisPosition;
			}
		}
		return this.domainAxisPosition;
	}

	getRangeAxisPosition({ datum = null, groups = null } = {}) {
		if (this.dualAxes) {
			const options = this.model.getOptions();
			const { groupMapsTo } = options.data;
			const axisOptions = Tools.getProperty(
				options,
				'axes',
				this.secondaryRangeAxisPosition
			);
			let dataset;
			if (datum !== null) {
				dataset = datum[groupMapsTo];
			} else if (groups && groups.length > 0) {
				dataset = groups[0];
			}
			if (
				axisOptions?.correspondingDatasets &&
				axisOptions.correspondingDatasets.includes(dataset)
			) {
				return this.secondaryRangeAxisPosition;
			}
		}
		return this.rangeAxisPosition;
	}

	getAxisOptions(position: AxisPositions) {
		return Tools.getProperty(this.model.getOptions(), 'axes', position);
	}

	getDomainAxisOptions() {
		const domainAxisPosition = this.getDomainAxisPosition();
		return this.getAxisOptions(domainAxisPosition);
	}

	getRangeAxisOptions() {
		const rangeAxisPosition = this.getRangeAxisPosition();
		return this.getAxisOptions(rangeAxisPosition);
	}

	getScaleLabel(position: AxisPositions) {
		const options = this.getAxisOptions(position);
		let title = options.title;
		if (!title) {
			if (
				position === AxisPositions.BOTTOM ||
				position === AxisPositions.TOP
			) {
				return 'x-value';
			}
			return 'y-value';
		}
		return title;
	}

	getDomainLabel() {
		return this.getScaleLabel(this.getDomainAxisPosition());
	}

	getRangeLabel() {
		return this.getScaleLabel(this.getRangeAxisPosition());
	}

	update(animate = true) {
		this.determineAxisDuality();
		this.findDomainAndRangeAxes();
		this.determineOrientation();
		const axisPositions = Object.keys(AxisPositions).map(
			(axisPositionKey) => AxisPositions[axisPositionKey]
		);
		axisPositions.forEach((axisPosition) => {
			this.scales[axisPosition] = this.createScale(axisPosition);
		});
	}

	findDomainAndRangeAxes() {
		// find main axes between (left & right) && (bottom & top)
		const verticalAxesPositions = this.findVerticalAxesPositions();
		const horizontalAxesPositions = this.findHorizontalAxesPositions();

		// Now we have horizontal & vertical main axes to choose domain & range axes from
		const domainAndRangeAxesPositions = this.findDomainAndRangeAxesPositions(
			verticalAxesPositions,
			horizontalAxesPositions
		);

		this.domainAxisPosition =
			domainAndRangeAxesPositions.primaryDomainAxisPosition;
		this.rangeAxisPosition =
			domainAndRangeAxesPositions.primaryRangeAxisPosition;

		if (this.isDualAxes()) {
			this.secondaryDomainAxisPosition =
				domainAndRangeAxesPositions.secondaryDomainAxisPosition;
			this.secondaryRangeAxisPosition =
				domainAndRangeAxesPositions.secondaryRangeAxisPosition;
		}
	}

	determineOrientation() {
		if (
			(this.rangeAxisPosition === AxisPositions.LEFT ||
				this.rangeAxisPosition === AxisPositions.RIGHT) &&
			(this.domainAxisPosition === AxisPositions.BOTTOM ||
				this.domainAxisPosition === AxisPositions.TOP)
		) {
			this.orientation = CartesianOrientations.VERTICAL;
		} else {
			this.orientation = CartesianOrientations.HORIZONTAL;
		}
	}

	isDualAxes() {
		return this.dualAxes;
	}

	// if any of the axes objects have correspondingDatasets [] asserted we flag the chart as dual axes
	// it does not count as dual axes if it just has another axis turned on but is not actually using it to map a dataset
	determineAxisDuality() {
		const options = this.model.getOptions();
		const axesOptions = Tools.getProperty(options, 'axes');

		if (
			(axesOptions[AxisPositions.LEFT]?.correspondingDatasets &&
				axesOptions[AxisPositions.RIGHT]) ||
			(axesOptions[AxisPositions.RIGHT]?.correspondingDatasets &&
				axesOptions[AxisPositions.LEFT]) ||
			(axesOptions[AxisPositions.TOP]?.correspondingDatasets &&
				axesOptions[AxisPositions.BOTTOM]) ||
			(axesOptions[AxisPositions.BOTTOM]?.correspondingDatasets &&
				axesOptions[AxisPositions.TOP])
		) {
			this.dualAxes = true;
		}
	}

	getOrientation() {
		return this.orientation;
	}

	getScaleByPosition(axisPosition: AxisPositions) {
		return this.scales[axisPosition];
	}

	getScaleTypeByPosition(axisPosition: AxisPositions) {
		return this.scaleTypes[axisPosition];
	}

	getDomainAxisScaleType() {
		const domainAxisPosition = this.getDomainAxisPosition();
		return this.getScaleTypeByPosition(domainAxisPosition);
	}

	getRangeAxisScaleType() {
		const rangeAxisPosition = this.getRangeAxisPosition();
		return this.getScaleTypeByPosition(rangeAxisPosition);
	}

	getDomainScale() {
		return this.scales[this.domainAxisPosition];
	}

	getRangeScale() {
		return this.scales[this.rangeAxisPosition];
	}

	// Find the main x-axis out of the 2 x-axis on the chart (when 2D axis is used)
	getMainXAxisPosition() {
		const possibleXAxisPositions = [
			AxisPositions.BOTTOM,
			AxisPositions.TOP,
		];

		return [this.domainAxisPosition, this.rangeAxisPosition].find(
			(position) => possibleXAxisPositions.indexOf(position) > -1
		);
	}

	// Find the main y-axis out of the 2 y-axis on the chart (when 2D axis is used)
	getMainYAxisPosition() {
		const possibleYAxisPositions = [
			AxisPositions.LEFT,
			AxisPositions.RIGHT,
		];

		return [this.domainAxisPosition, this.rangeAxisPosition].find(
			(position) => possibleYAxisPositions.indexOf(position) > -1
		);
	}

	getMainXScale() {
		return this.scales[this.getMainXAxisPosition()];
	}

	getMainYScale() {
		return this.scales[this.getMainYAxisPosition()];
	}

	getValueFromScale(
		scale: any,
		scaleType: ScaleTypes,
		axisPosition: AxisPositions,
		datum: any,
		index?: number
	) {
		const options = this.model.getOptions();
		const axesOptions = Tools.getProperty(options, 'axes');
		const axisOptions = axesOptions[axisPosition];
		const { mapsTo } = axisOptions;
		const value =
			Tools.getProperty(datum, mapsTo) !== null ? datum[mapsTo] : datum;
		let scaledValue;
		switch (scaleType) {
			case ScaleTypes.LABELS:
				scaledValue = scale(value) + scale.step() / 2;
				break;
			case ScaleTypes.TIME:
				scaledValue = scale(new Date(value));
				break;
			default:
				scaledValue = scale(value);
		}
		return scaledValue;
	}

	getBoundedScaledValues(datum: any, index?: number) {
		const { bounds } = this.model.getOptions();
		const scale = this.scales[this.rangeAxisPosition];

		const options = this.model.getOptions();
		const axesOptions = Tools.getProperty(options, 'axes');
		const axisOptions = axesOptions[this.rangeAxisPosition];
		const { mapsTo } = axisOptions;
		const value = datum[mapsTo] !== undefined ? datum[mapsTo] : datum;

		const boundedValues = [
			scale(
				Tools.getProperty(datum, bounds.upperBoundMapsTo) !== null
					? datum[bounds.upperBoundMapsTo]
					: value
			),
			scale(
				Tools.getProperty(datum, bounds.lowerBoundMapsTo) !== null
					? datum[bounds.lowerBoundMapsTo]
					: value
			),
		];

		return boundedValues;
	}

	getValueThroughAxisPosition(
		axisPosition: AxisPositions,
		datum: any,
		index?: number
	) {
		const scaleType = this.scaleTypes[axisPosition];
		const scale = this.scales[axisPosition];

		return this.getValueFromScale(
			scale,
			scaleType,
			axisPosition,
			datum,
			index
		);
	}

	getDomainValue(d, i) {
		const axisPosition = this.getDomainAxisPosition({ datum: d });
		return this.getValueThroughAxisPosition(axisPosition, d, i);
	}

	getRangeValue(d, i) {
		const axisPosition = this.getRangeAxisPosition({ datum: d });
		return this.getValueThroughAxisPosition(axisPosition, d, i);
	}

	getMainXScaleType() {
		return this.getScaleTypeByPosition(this.getMainXAxisPosition());
	}

	getMainYScaleType() {
		return this.getScaleTypeByPosition(this.getMainYAxisPosition());
	}

	getDomainIdentifier(datum?: any) {
		const options = this.model.getOptions();
		return Tools.getProperty(
			options,
			'axes',
			this.getDomainAxisPosition({ datum: datum }),
			'mapsTo'
		);
	}

	getRangeIdentifier(datum?: any) {
		const options = this.model.getOptions();
		return Tools.getProperty(
			options,
			'axes',
			this.getRangeAxisPosition({ datum: datum }),
			'mapsTo'
		);
	}

	extendsDomain(axisPosition: AxisPositions, domain: any) {
		const options = this.model.getOptions();
		const axisOptions = Tools.getProperty(options, 'axes', axisPosition);
		if (axisOptions.scaleType === ScaleTypes.TIME) {
			const spaceToAddToEdges = Tools.getProperty(
				options,
				'timeScale',
				'addSpaceOnEdges'
			);
			return addSpacingToTimeDomain(domain, spaceToAddToEdges);
		} else {
			return addSpacingToContinuousDomain(
				domain,
				Configuration.axis.paddingRatio,
				axisOptions.scaleType
			);
		}
	}

	protected findVerticalAxesPositions() {
		const options = this.model.getOptions();
		const axesOptions = Tools.getProperty(options, 'axes');
		const dualAxes = this.isDualAxes();

		// If right axis has been specified as `main`
		if (
			(Tools.getProperty(axesOptions, AxisPositions.LEFT) === null &&
				Tools.getProperty(axesOptions, AxisPositions.RIGHT) !== null) ||
			Tools.getProperty(axesOptions, AxisPositions.RIGHT, 'main') ===
				true ||
			(dualAxes &&
				Tools.getProperty(
					axesOptions,
					AxisPositions.LEFT,
					'correspondingDatasets'
				))
		) {
			return {
				primary: AxisPositions.RIGHT,
				secondary: AxisPositions.LEFT,
			};
		}

		return { primary: AxisPositions.LEFT, secondary: AxisPositions.RIGHT };
	}

	protected findHorizontalAxesPositions() {
		const options = this.model.getOptions();
		const axesOptions = Tools.getProperty(options, 'axes');
		const dualAxes = this.isDualAxes();

		// If top axis has been specified as `main`
		if (
			(Tools.getProperty(axesOptions, AxisPositions.BOTTOM) === null &&
				Tools.getProperty(axesOptions, AxisPositions.TOP) !== null) ||
			Tools.getProperty(axesOptions, AxisPositions.TOP, 'main') ===
				true ||
			(dualAxes &&
				Tools.getProperty(
					axesOptions,
					AxisPositions.BOTTOM,
					'correspondingDatasets'
				))
		) {
			return {
				primary: AxisPositions.TOP,
				secondary: AxisPositions.BOTTOM,
			};
		}

		return { primary: AxisPositions.BOTTOM, secondary: AxisPositions.TOP };
	}

	protected findDomainAndRangeAxesPositions(
		verticalAxesPositions,
		horizontalAxesPositions
	) {
		const options = this.model.getOptions();

		const mainVerticalAxisOptions = Tools.getProperty(
			options,
			'axes',
			verticalAxesPositions.primary
		);
		const mainHorizontalAxisOptions = Tools.getProperty(
			options,
			'axes',
			horizontalAxesPositions.primary
		);

		const mainVerticalScaleType =
			mainVerticalAxisOptions.scaleType || ScaleTypes.LINEAR;
		const mainHorizontalScaleType =
			mainHorizontalAxisOptions.scaleType || ScaleTypes.LINEAR;

		const result = {
			primaryDomainAxisPosition: null,
			secondaryDomainAxisPosition: null,
			primaryRangeAxisPosition: null,
			secondaryRangeAxisPosition: null,
		};

		// assign to to be a vertical chart by default
		result.primaryDomainAxisPosition = horizontalAxesPositions.primary;
		result.primaryRangeAxisPosition = verticalAxesPositions.primary;
		// secondary axes
		result.secondaryDomainAxisPosition = horizontalAxesPositions.secondary;
		result.secondaryRangeAxisPosition = verticalAxesPositions.secondary;

		// if neither the horizontal axes are label or time
		// and atleast  one of the main vertical ones are labels or time then it should be horizontal
		if (
			(!(
				mainHorizontalScaleType === ScaleTypes.LABELS ||
				mainHorizontalScaleType === ScaleTypes.TIME
			) &&
				mainVerticalScaleType === ScaleTypes.LABELS) ||
			mainVerticalScaleType === ScaleTypes.TIME
		) {
			result.primaryDomainAxisPosition = verticalAxesPositions.primary;
			result.primaryRangeAxisPosition = horizontalAxesPositions.primary;
			// secondary axes
			result.secondaryDomainAxisPosition =
				verticalAxesPositions.secondary;
			result.secondaryRangeAxisPosition =
				horizontalAxesPositions.secondary;
		}

		return result;
	}

	protected getScaleDomain(axisPosition: AxisPositions) {
		const options = this.model.getOptions();
		const axisOptions = Tools.getProperty(options, 'axes', axisPosition);
		const bounds = Tools.getProperty(options, 'bounds');
		const { includeZero } = axisOptions;
		const scaleType =
			Tools.getProperty(axisOptions, 'scaleType') || ScaleTypes.LINEAR;

		if (this.model.isDataEmpty()) {
			return [];
		}

		const displayData = this.model.getDisplayData();
		const {
			extendLinearDomainBy,
			mapsTo,
			percentage,
			thresholds,
		} = axisOptions;
		const {
			reference: ratioReference,
			compareTo: ratioCompareTo,
		} = Configuration.axis.ratio;

		// If domain is specified return that domain
		if (axisOptions.domain) {
			if (scaleType === ScaleTypes.LABELS) {
				return axisOptions.domain;
			} else if (scaleType === ScaleTypes.TIME) {
				axisOptions.domain = axisOptions.domain.map((d) =>
					d.getTime === undefined ? new Date(d) : d
				);
			}
			return this.extendsDomain(axisPosition, axisOptions.domain);
		}

		// Return [0, 100] for percentage axis scale
		if (percentage) {
			return [0, 100];
		}

		// If scale is a LABELS scale, return some labels as the domain
		if (axisOptions && scaleType === ScaleTypes.LABELS) {
			// Get unique values
			return Tools.removeArrayDuplicates(
				displayData.map((d) => d[mapsTo])
			);
		}

		// Get the extent of the domain
		let domain;
		let allDataValues;
		const dataGroupNames = this.model.getDataGroupNames();

		if (scaleType === ScaleTypes.LABELS_RATIO) {
			return displayData.map(
				(datum) => `${datum[ratioReference]}/${datum[ratioCompareTo]}`
			);
		} else if (scaleType === ScaleTypes.TIME) {
			allDataValues = displayData.map(
				(datum) => +new Date(datum[mapsTo])
			);
		} else if (bounds && options.axes) {
			allDataValues = [];

			displayData.forEach((datum) => {
				allDataValues.push(datum[mapsTo]);

				if (datum[bounds.upperBoundMapsTo]) {
					allDataValues.push(datum[bounds.upperBoundMapsTo]);
				}
				if (datum[bounds.lowerBoundMapsTo]) {
					allDataValues.push(datum[bounds.lowerBoundMapsTo]);
				}
			});
		} else if (
			axisOptions.stacked === true &&
			dataGroupNames &&
			axisPosition === this.getRangeAxisPosition()
		) {
			const { groupMapsTo } = options.data;
			const dataValuesGroupedByKeys = this.model.getDataValuesGroupedByKeys(
				dataGroupNames
			);
			const nonStackedGroupsData = displayData.filter(
				(datum) => !dataGroupNames.includes(datum[groupMapsTo])
			);
			const stackedValues = dataValuesGroupedByKeys.map((dataValues) => {
				const { sharedStackKey, ...numericalValues } = dataValues;
				return sum(
					Object.keys(numericalValues).map(
						(numericalValueKey) =>
							numericalValues[numericalValueKey]
					) as number[]
				);
			});

			allDataValues = [
				...stackedValues,
				...nonStackedGroupsData.map((datum) => datum[mapsTo]),
			];
		} else {
			allDataValues = [];

			displayData.forEach((datum) => {
				const value = datum[mapsTo];
				if (Array.isArray(value) && value.length === 2) {
					allDataValues.push(value[0]);
					allDataValues.push(value[1]);
				} else {
					if (extendLinearDomainBy) {
						allDataValues.push(
							Math.max(datum[mapsTo], datum[extendLinearDomainBy])
						);
					}
					allDataValues.push(value);
				}
			});
		}

		// Time can never be 0 and log of base 0 is -Infinity
		if (
			scaleType !== ScaleTypes.TIME &&
			scaleType !== ScaleTypes.LOG &&
			includeZero
		) {
			allDataValues.push(0);
		}

		// Add threshold values into the scale
		if (thresholds && thresholds.length > 0) {
			thresholds.forEach((threshold) => {
				const thresholdValue = Tools.getProperty(threshold, 'value');
				if (thresholdValue !== null) allDataValues.push(thresholdValue);
			});
		}

		domain = extent(allDataValues);
		domain = this.extendsDomain(axisPosition, domain);

		return domain;
	}

	protected createScale(axisPosition: AxisPositions) {
		const options = this.model.getOptions();
		const axisOptions = Tools.getProperty(options, 'axes', axisPosition);

		if (!axisOptions) {
			return null;
		}

		const scaleType =
			Tools.getProperty(axisOptions, 'scaleType') || ScaleTypes.LINEAR;
		this.scaleTypes[axisPosition] = scaleType;

		let scale;
		if (scaleType === ScaleTypes.TIME) {
			scale = scaleTime();
		} else if (scaleType === ScaleTypes.LOG) {
			scale = scaleLog().base(axisOptions.base || 10);
		} else if (
			scaleType === ScaleTypes.LABELS ||
			scaleType === ScaleTypes.LABELS_RATIO
		) {
			scale = scaleBand();
		} else {
			scale = scaleLinear();
		}

		scale.domain(this.getScaleDomain(axisPosition));

		return scale;
	}

	protected getHighestDomainThreshold(): null | {
		threshold: ThresholdOptions;
		scaleValue: number;
	} {
		const axesOptions = Tools.getProperty(this.model.getOptions(), 'axes');
		const domainAxisPosition = this.getDomainAxisPosition();

		const { thresholds } = axesOptions[domainAxisPosition];

		if (!thresholds) {
			return null;
		}

		const domainScale = this.getDomainScale();
		// Find the highest threshold for the domain
		const highestThreshold = thresholds.sort(
			(a, b) => b.value - a.value
		)[0];

		const scaleType = this.getScaleTypeByPosition(domainAxisPosition);
		if (
			scaleType === ScaleTypes.TIME &&
			(typeof highestThreshold.value === 'string' ||
				highestThreshold.value.getTime === undefined)
		) {
			highestThreshold.value = new Date(highestThreshold.value);
		}

		return {
			threshold: highestThreshold,
			scaleValue: domainScale(highestThreshold.value),
		};
	}

	protected getHighestRangeThreshold(): null | {
		threshold: ThresholdOptions;
		scaleValue: number;
	} {
		const axesOptions = Tools.getProperty(this.model.getOptions(), 'axes');
		const rangeAxisPosition = this.getRangeAxisPosition();

		const { thresholds } = axesOptions[rangeAxisPosition];

		if (!thresholds) {
			return null;
		}

		const rangeScale = this.getRangeScale();
		// Find the highest threshold for the range
		const highestThreshold = thresholds.sort(
			(a, b) => b.value - a.value
		)[0];

		return {
			threshold: highestThreshold,
			scaleValue: rangeScale(highestThreshold.value),
		};
	}
}

function addSpacingToTimeDomain(domain: any, spaceToAddToEdges: number) {
	const startDate = new Date(domain[0]);
	const endDate = new Date(domain[1]);

	if (differenceInYears(endDate, startDate) > 1) {
		return [
			subYears(startDate, spaceToAddToEdges),
			addYears(endDate, spaceToAddToEdges),
		];
	}

	if (differenceInMonths(endDate, startDate) > 1) {
		return [
			subMonths(startDate, spaceToAddToEdges),
			addMonths(endDate, spaceToAddToEdges),
		];
	}

	if (differenceInDays(endDate, startDate) > 1) {
		return [
			subDays(startDate, spaceToAddToEdges),
			addDays(endDate, spaceToAddToEdges),
		];
	}

	if (differenceInHours(endDate, startDate) > 1) {
		return [
			subHours(startDate, spaceToAddToEdges),
			addHours(endDate, spaceToAddToEdges),
		];
	}

	if (differenceInMinutes(endDate, startDate) > 30) {
		return [
			subMinutes(startDate, spaceToAddToEdges * 30),
			addMinutes(endDate, spaceToAddToEdges * 30),
		];
	}

	if (differenceInMinutes(endDate, startDate) > 1) {
		return [
			subMinutes(startDate, spaceToAddToEdges),
			addMinutes(endDate, spaceToAddToEdges),
		];
	}

	if (differenceInSeconds(endDate, startDate) > 15) {
		return [
			subSeconds(startDate, spaceToAddToEdges * 15),
			addSeconds(endDate, spaceToAddToEdges * 15),
		];
	}

	if (differenceInSeconds(endDate, startDate) > 1) {
		return [
			subSeconds(startDate, spaceToAddToEdges),
			addSeconds(endDate, spaceToAddToEdges),
		];
	}

	return [startDate, endDate];
}

function addSpacingToContinuousDomain(
	[lower, upper]: number[],
	paddingRatio: number,
	scaleType?: ScaleTypes
) {
	const domainLength = upper - lower;
	const padding = domainLength * paddingRatio;

	// If padding crosses 0, keep 0 as new upper bound
	const newUpper = upper <= 0 && upper + padding > 0 ? 0 : upper + padding;
	// If padding crosses 0, keep 0 as new lower bound
	let newLower = lower >= 0 && lower - padding < 0 ? 0 : lower - padding;

	// Log of base 0 or a negative number is -Infinity
	if (scaleType === ScaleTypes.LOG && newLower <= 0) {
		if (lower <= 0) {
			throw Error(
				'Data must have values greater than 0 if log scale type is used.'
			);
		}
		newLower = lower;
	}

	return [newLower, newUpper];
}
