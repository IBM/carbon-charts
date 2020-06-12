import { ScaleTypes, AggregationTypes } from "./enums";
import { AxisDomain } from "d3";
import { Locale } from "date-fns";
import { ThresholdOptions } from "./components";

/**
 * options to configure a scale. not all options are used by all scales
 */
export interface AxisOptions {
	/**
	 * type of the scale used on axis
	 */
	scaleType?: ScaleTypes;
	/**
	 * Whether the Axis should use the specified domain
	 * instead of it being dynamically generated based on data extents.
	 * The type of values should depend on the scale type.
	 * Example for continuous axis scale: [-100, 100]
	 * Example for discrete axis scale: ['Qty', 'More', 'Sold']
	 */
	domain?: AxisDomain[];
	/**
	 * Whether the Axis should be forced to include 0 as a starting point
	 * (or ending point, in case of all negative axis).
	 * Default: true
	 */
	includeZero?: boolean;
	/**
	 * identifies what key within the data the axis values would map to
	 */
	mapsTo?: string;
	/**
	 * optional title for the scales
	 */
	title?: string;
	/**
	 * thresholds
	 * Example:
	 * [
	 *		{value: 10000},
	 *		{value: 40020, valueFormatter: (x) => x},
	 *		{value: 55000, label: "Custom label", fillColor: "#03a9f4"},
	 * ]
	 */
	thresholds?: ThresholdOptions[];
	/**
	 * tick configuration
	 */
	ticks?: {
		/**
		 * number of ticks to show
		 */
		number?: number;
		/**
		 * minimum tick value
		 */
		min?: number;
		/**
		 * maximum tick value
		 */
		max?: number;
		/**
		 * minimum width of a tick
		 * before getting rotated (in pixels)
		 */
		rotateIfSmallerThan?: number;
		/**
		 * function to format the ticks
		 */
		formatter?: Function;
	};
	/**
	 * Bins to display (Histogram)
	 * bins: 20
	 * bins: [0, 20, 40, 60]
	 * bins: [new Date(...), new Date(...), ...]
	 */
	bins?: number | any[];
	/**
	 * Aggregation types on bins
	 * aggregation: "count" (default) | "sum" | "avg"
	 */
	aggregation?: AggregationTypes;
}

/**
 * customize time series scales
 */
export interface TimeScaleOptions {
	addSpaceOnEdges?: number;
	/**
	 * if it's true, days are shown as mon-sun,
	 * otherwise days are shown as number 1-31
	 */
	showDayName?: boolean;
	/**
	 * formats for each time interval
	 */
	timeIntervalFormats?: TimeIntervalFormats;
	/**
	 * locale object, for more information see https://date-fns.org/v2.11.0/docs/Locale.
	 * example: `import enUSLocaleObject from "date-fns/locale/en-US/index"`.
	 * available locale objects are: https://github.com/date-fns/date-fns/tree/master/src/locale
	 */
	localeObject?: Locale;
}

/**
 * time scales: customize ticks format for different time intervals
 */
export interface TickFormats {
	primary?: string;
	secondary?: string;
}

export interface TimeIntervalFormats {
	"15seconds"?: TickFormats;
	minute?: TickFormats;
	"30minutes"?: TickFormats;
	hourly?: TickFormats;
	daily?: TickFormats;
	weekly?: TickFormats;
	monthly?: TickFormats;
	quarterly?: TickFormats;
	yearly?: TickFormats;
}

/**
 * customize the axes components
 */
export interface AxesOptions {
	left?: AxisOptions;
	bottom?: AxisOptions;
	right?: AxisOptions;
	top?: AxisOptions;
}
