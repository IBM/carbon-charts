// Internal Imports
import * as Configuration from "../configuration";
import { Service } from "./service";
import {
	AxisPositions,
	CartesianOrientations,
	ScaleTypes,
	AxesOptions,
	ThresholdOptions
} from "../interfaces";
import { Tools } from "../tools";

// D3 Imports
import { scaleBand, scaleLinear, scaleTime, scaleLog } from "d3-scale";
import { extent, sum } from "d3-array";
import { map, values } from "d3-collection";

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
	addSeconds
} from "date-fns";

export class CartesianScales extends Service {
	protected scaleTypes = {
		top: null,
		right: null,
		bottom: null,
		left: null
	};

	protected scales = {
		top: null,
		right: null,
		bottom: null,
		left: null
	};

	protected domainAxisPosition: AxisPositions;
	protected rangeAxisPosition: AxisPositions;

	protected orientation: CartesianOrientations;

	getDomainAxisPosition() {
		return this.domainAxisPosition;
	}

	getRangeAxisPosition() {
		return this.rangeAxisPosition;
	}

	update(animate = true) {
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
		const mainVerticalAxisPosition = this.findMainVerticalAxisPosition();
		const mainHorizontalAxisPosition = this.findMainHorizontalAxisPosition();

		// Now we have horizontal & vertical main axes to choose domain & range axes from
		const domainAndRangeAxesPositions = this.findDomainAndRangeAxesPositions(
			mainVerticalAxisPosition,
			mainHorizontalAxisPosition
		);

		this.domainAxisPosition =
			domainAndRangeAxesPositions.domainAxisPosition;
		this.rangeAxisPosition = domainAndRangeAxesPositions.rangeAxisPosition;
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

	getOrientation() {
		return this.orientation;
	}

	getScaleByPosition(axisPosition: AxisPositions) {
		return this.scales[axisPosition];
	}

	getScaleTypeByPosition(axisPosition: AxisPositions) {
		return this.scaleTypes[axisPosition];
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
			AxisPositions.TOP
		];

		return [this.domainAxisPosition, this.rangeAxisPosition].find(
			(position) => possibleXAxisPositions.indexOf(position) > -1
		);
	}

	// Find the main y-axis out of the 2 y-axis on the chart (when 2D axis is used)
	getMainYAxisPosition() {
		const possibleYAxisPositions = [
			AxisPositions.LEFT,
			AxisPositions.RIGHT
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

	getValueFromScale(axisPosition: AxisPositions, datum: any, index?: number) {
		const options = this.model.getOptions();
		const axisOptions = Tools.getProperty(options, "axes", axisPosition);

		const scaleType = this.scaleTypes[axisPosition];
		const scale = this.scales[axisPosition];

		const { mapsTo } = axisOptions;
		const value = datum[mapsTo] !== undefined ? datum[mapsTo] : datum;

		if (scaleType === ScaleTypes.LABELS) {
			return scale(value) + scale.step() / 2;
		}

		if (scaleType === ScaleTypes.TIME) {
			return scale(new Date(value));
		}

		return scale(value);
	}

	getDomainValue(d, i) {
		return this.getValueFromScale(this.domainAxisPosition, d, i);
	}

	getRangeValue(d, i) {
		return this.getValueFromScale(this.rangeAxisPosition, d, i);
	}

	getDomainIdentifier() {
		const options = this.model.getOptions();
		const axisOptions = Tools.getProperty(
			options,
			"axes",
			this.domainAxisPosition
		);

		return axisOptions.mapsTo;
	}

	getRangeIdentifier() {
		const options = this.model.getOptions();
		const axisOptions = Tools.getProperty(
			options,
			"axes",
			this.rangeAxisPosition
		);

		return axisOptions.mapsTo;
	}

	/** Uses the primary Y Axis to get data items associated with that value. */
	getDataFromDomain(domainValue) {
		const displayData = this.model.getDisplayData();
		const domainIdentifier = this.getDomainIdentifier();
		const scaleType = this.scaleTypes[this.domainAxisPosition];
		if (scaleType === ScaleTypes.TIME) {
			return displayData.filter((datum) => {
				let date = datum[domainIdentifier];
				if (typeof date === "string" || date.getTime === undefined) {
					date = new Date(date);
				}

				return date.getTime() === domainValue.getTime();
			});
		}

		return displayData.filter((datum) => {
			return datum[domainIdentifier] === domainValue;
		});
	}

	extendsDomain(axisPosition: AxisPositions, domain: any) {
		const options = this.model.getOptions();
		const axisOptions = Tools.getProperty(options, "axes", axisPosition);
		if (axisOptions.scaleType === ScaleTypes.TIME) {
			const spaceToAddToEdges = Tools.getProperty(
				options,
				"timeScale",
				"addSpaceOnEdges"
			);
			return addSpacingToTimeDomain(domain, spaceToAddToEdges);
		} else {
			return addSpacingToContinuousDomain(
				domain,
				Configuration.axis.paddingRatio
			);
		}
	}

	protected findMainVerticalAxisPosition() {
		const options = this.model.getOptions();
		const axesOptions = Tools.getProperty(options, "axes");

		// If right axis has been specified as `main`
		if (
			(Tools.getProperty(axesOptions, AxisPositions.LEFT) === null &&
				Tools.getProperty(axesOptions, AxisPositions.RIGHT) !== null) ||
			Tools.getProperty(axesOptions, AxisPositions.RIGHT, "main") === true
		) {
			return AxisPositions.RIGHT;
		}

		return AxisPositions.LEFT;
	}

	protected findMainHorizontalAxisPosition() {
		const options = this.model.getOptions();
		const axesOptions = Tools.getProperty(options, "axes");

		// If top axis has been specified as `main`
		if (
			(Tools.getProperty(axesOptions, AxisPositions.BOTTOM) === null &&
				Tools.getProperty(axesOptions, AxisPositions.TOP) !== null) ||
			Tools.getProperty(axesOptions, AxisPositions.TOP, "main") === true
		) {
			return AxisPositions.TOP;
		}

		return AxisPositions.BOTTOM;
	}

	protected findDomainAndRangeAxesPositions(
		mainVerticalAxisPosition: AxisPositions,
		mainHorizontalAxisPosition: AxisPositions
	) {
		const options = this.model.getOptions();

		const mainVerticalAxisOptions = Tools.getProperty(
			options,
			"axes",
			mainVerticalAxisPosition
		);
		const mainHorizontalAxisOptions = Tools.getProperty(
			options,
			"axes",
			mainHorizontalAxisPosition
		);

		const mainVerticalScaleType =
			mainVerticalAxisOptions.scaleType || ScaleTypes.LINEAR;
		const mainHorizontalScaleType =
			mainHorizontalAxisOptions.scaleType || ScaleTypes.LINEAR;

		const result = {
			domainAxisPosition: null,
			rangeAxisPosition: null
		};
		if (
			mainHorizontalScaleType === ScaleTypes.LABELS ||
			mainHorizontalScaleType === ScaleTypes.TIME
		) {
			result.domainAxisPosition = mainHorizontalAxisPosition;
			result.rangeAxisPosition = mainVerticalAxisPosition;
		} else if (
			mainVerticalScaleType === ScaleTypes.LABELS ||
			mainVerticalScaleType === ScaleTypes.TIME
		) {
			result.domainAxisPosition = mainVerticalAxisPosition;
			result.rangeAxisPosition = mainHorizontalAxisPosition;
		} else {
			result.domainAxisPosition = mainHorizontalAxisPosition;
			result.rangeAxisPosition = mainVerticalAxisPosition;
		}

		return result;
	}

	protected getScaleDomain(axisPosition: AxisPositions) {
		const options = this.model.getOptions();
		const axisOptions = Tools.getProperty(options, "axes", axisPosition);
		const { includeZero } = axisOptions;
		const scaleType =
			Tools.getProperty(axisOptions, "scaleType") || ScaleTypes.LINEAR;

		if (this.model.isDataEmpty()) {
			return [];
		}

		const displayData = this.model.getDisplayData();
		const { mapsTo } = axisOptions;

		// If domain is specified return that domain
		if (axisOptions.domain) {
			return axisOptions.domain;
		}

		// If scale is a LABELS scale, return some labels as the domain
		if (axisOptions && scaleType === ScaleTypes.LABELS) {
			// Get unique values
			return map(displayData, (d) => d[mapsTo]).keys();
		}

		// Get the extent of the domain
		let domain;
		let allDataValues;
		// If the scale is stacked
		if (axisOptions.stacked) {
			const dataValuesGroupedByKeys = this.model.getDataValuesGroupedByKeys();
			allDataValues = dataValuesGroupedByKeys.map((dataValues) => {
				const { sharedStackKey, ...numericalValues } = dataValues;
				return sum(values(numericalValues) as number[]);
			});
		} else {
			allDataValues = displayData.map((datum) => datum[mapsTo]);
		}

		if (scaleType !== ScaleTypes.TIME && includeZero) {
			allDataValues.push(0);
		}

		domain = extent(allDataValues);
		domain = this.extendsDomain(axisPosition, domain);

		return domain;
	}

	protected createScale(axisPosition: AxisPositions) {
		const options = this.model.getOptions();
		const axisOptions = Tools.getProperty(options, "axes", axisPosition);

		if (!axisOptions) {
			return null;
		}

		const scaleType =
			Tools.getProperty(axisOptions, "scaleType") || ScaleTypes.LINEAR;
		this.scaleTypes[axisPosition] = scaleType;

		let scale;
		if (scaleType === ScaleTypes.TIME) {
			scale = scaleTime();
		} else if (scaleType === ScaleTypes.LOG) {
			scale = scaleLog().base(axisOptions.base || 10);
		} else if (scaleType === ScaleTypes.LABELS) {
			scale = scaleBand();
		} else {
			scale = scaleLinear();
		}

		scale.domain(this.getScaleDomain(axisPosition));

		return scale;
	}

	getHighestDomainThreshold(): null | {
		threshold: ThresholdOptions;
		scaleValue: number;
	} {
		const axesOptions = Tools.getProperty(this.model.getOptions(), "axes");
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
			(typeof highestThreshold.value === "string" ||
				highestThreshold.value.getTime === undefined)
		) {
			highestThreshold.value = new Date(highestThreshold.value);
		}

		return {
			threshold: highestThreshold,
			scaleValue: domainScale(highestThreshold.value)
		};
	}

	getHighestRangeThreshold(): null | {
		threshold: ThresholdOptions;
		scaleValue: number;
	} {
		const axesOptions = Tools.getProperty(this.model.getOptions(), "axes");
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
			scaleValue: rangeScale(highestThreshold.value)
		};
	}
}

function addSpacingToTimeDomain(domain: any, spaceToAddToEdges: number) {
	const startDate = new Date(domain[0]);
	const endDate = new Date(domain[1]);

	if (differenceInYears(endDate, startDate) > 1) {
		return [
			subYears(startDate, spaceToAddToEdges),
			addYears(endDate, spaceToAddToEdges)
		];
	}

	if (differenceInMonths(endDate, startDate) > 1) {
		return [
			subMonths(startDate, spaceToAddToEdges),
			addMonths(endDate, spaceToAddToEdges)
		];
	}

	if (differenceInDays(endDate, startDate) > 1) {
		return [
			subDays(startDate, spaceToAddToEdges),
			addDays(endDate, spaceToAddToEdges)
		];
	}

	if (differenceInHours(endDate, startDate) > 1) {
		return [
			subHours(startDate, spaceToAddToEdges),
			addHours(endDate, spaceToAddToEdges)
		];
	}

	if (differenceInMinutes(endDate, startDate) > 30) {
		return [
			subMinutes(startDate, spaceToAddToEdges * 30),
			addMinutes(endDate, spaceToAddToEdges * 30)
		];
	}

	if (differenceInMinutes(endDate, startDate) > 1) {
		return [
			subMinutes(startDate, spaceToAddToEdges),
			addMinutes(endDate, spaceToAddToEdges)
		];
	}

	if (differenceInSeconds(endDate, startDate) > 15) {
		return [
			subSeconds(startDate, spaceToAddToEdges * 15),
			addSeconds(endDate, spaceToAddToEdges * 15)
		];
	}

	if (differenceInSeconds(endDate, startDate) > 1) {
		return [
			subSeconds(startDate, spaceToAddToEdges),
			addSeconds(endDate, spaceToAddToEdges)
		];
	}

	return [startDate, endDate];
}

function addSpacingToContinuousDomain(
	[lower, upper]: number[],
	paddingRatio: number
) {
	const domainLength = upper - lower;
	const padding = domainLength * paddingRatio;

	// If padding crosses 0, keep 0 as new upper bound
	const newUpper = upper <= 0 && upper + padding > 0 ? 0 : upper + padding;
	// If padding crosses 0, keep 0 as new lower bound
	const newLower = lower >= 0 && lower - padding < 0 ? 0 : lower - padding;

	return [newLower, newUpper];
}
