import { GaugeTypes, Statuses, ArrowDirections, Alignments } from "./enums";
import {
	LegendOptions,
	TooltipOptions,
	GridOptions,
	AxesOptions
} from "./index";
import { BarOptions, StackedBarOptions } from "./components";
import { TimeScaleOptions } from "./axis-scales";

/**
 * Base chart options common to any chart
 */
export interface BaseChartOptions {
	/**
	 * Optionally specify a title for the chart
	 */
	title?: string;
	/**
	 * boolean to disable animations (enabled by default)
	 */
	animations?: boolean;
	/**
	 * boolean to prevent the container from resizing
	 */
	resizable?: boolean;
	/**
	 * Optionally specify a width for the chart
	 */
	width?: string;
	/**
	 * Optionally specify a height for the chart
	 */
	height?: string;
	/**
	 * tooltip configuration
	 */
	tooltip?: TooltipOptions;
	/**
	 * legend configuration
	 */
	legend?: LegendOptions;
	/**
	 * Optional function to determine whether is filled based on datasetLabel, label, and/or data
	 */
	getIsFilled?: (
		datasetLabel: any,
		label?: any,
		data?: any,
		defaultFilled?: boolean
	) => boolean;
	/**
	 * Optional function to generate the fill color based on datasetLabel, label, and/or data
	 */
	getFillColor?: (
		datasetLabel: any,
		label?: any,
		data?: any,
		defaultFillColor?: string
	) => string;
	/**
	 * Optional function to generate the stroke color based on datasetLabel, label, and/or data
	 */
	getStrokeColor?: (
		datasetLabel: any,
		label?: any,
		data?: any,
		defaultStrokeColor?: string
	) => string;
	/**
	 * stylesheet options
	 */
	style?: {
		/**
		 * optional prefixing string for css classes (defaults to 'cc')
		 */
		prefix?: string;
	};
	/**
	 * options related to charting data
	 */
	data?: {
		/**
		 * identifier for data groups
		 */
		groupMapsTo?: string;
		/**
		 * used to simulate data loading
		 */
		loading?: Boolean;
		/**
		 * options related to pre-selected data groups
		 * Remains empty if every legend item is active or dataset doesn't have the data groups.
		 */
		selectedGroups?: string[];
	};
	/**
	 * options related to color scales
	 */
	color?: {
		/**
		 * e.g. { "Dataset 1": "blue" }
		 */
		scale?: object;
	};
}

/**
 * Options common to any chart with an axis
 */
export interface AxisChartOptions extends BaseChartOptions {
	axes?: AxesOptions;
	grid?: GridOptions;
	timeScale?: TimeScaleOptions;
}

/**
 * options specific to bar charts
 */
export interface BarChartOptions extends AxisChartOptions {
	bars?: BarOptions;
}

/**
 * options specific to stacked bar charts
 */
export interface StackedBarChartOptions extends BarChartOptions {
	bars?: StackedBarOptions;
}

/**
 * options specific to scatter charts
 */
export interface ScatterChartOptions extends AxisChartOptions {
	/**
	 * options for the points
	 */
	points?: {
		/**
		 * sets the radius of the point
		 */
		radius: number;
		fillOpacity?: number;
		filled?: boolean;
	};
}

/**
 * options specific to bubble charts
 */
export interface BubbleChartOptions extends AxisChartOptions {
	/**
	 * options for the individual bubbles
	 */
	bubble?: {
		/**
		 * the key to lookup in charting data for the bubble radius value
		 */
		radiusMapsTo?: string;
		/**
		 * A function that would determine the range of the bubble radius to use
		 * Returns an array with the 1st value being the min and the 2nd value being the max radius
		 */
		radiusRange?: Function;
		/**
		 * Opacity of the fills used within each circle
		 */
		fillOpacity?: number;
	};
}

/**
 * options specific to line charts
 */
export interface LineChartOptions extends ScatterChartOptions {
	/**
	 * options for the curve of the line
	 */
	curve?:
		| string
		| {
				name: string;
		  };
}

/**
 * options specific to area charts
 */
export interface AreaChartOptions extends AxisChartOptions {
	/**
	 * options for the curve of the line
	 */
	curve?:
		| string
		| {
				name: string;
		  };
}

/**
 * options specific to area charts
 */
export interface StackedAreaChartOptions extends ScatterChartOptions {
	/**
	 * options for the curve of the line
	 */
	curve?:
		| string
		| {
				name: string;
		  };
}

/**
 * options specific to pie charts
 */
export interface PieChartOptions extends BaseChartOptions {
	pie?: {
		radiusOffset?: number;
		innerRadius?: number;
		padAngle?: number;
		hoverArc?: {
			outerRadiusOffset?: number;
		};
		xOffset?: number;
		yOffset?: number;
		yOffsetCallout?: number;
		callout?: {
			minSliceDegree?: number;
			offsetX?: number;
			offsetY?: number;
			horizontalLineLength?: number;
			textMargin?: number;
		};
		labels?: {
			formatter?: Function;
		};
		alignment?: Alignments;
	};
}

/**
 * options specific to gauge charts
 */
export interface GaugeChartOptions extends PieChartOptions {
	gauge?: {
		arcWidth?: number;
		deltaArrow?: {
			direction?: ArrowDirections;
			size?: Function;
			enabled: Boolean;
		};
		status?: Statuses;
		deltaFontSize?: Function;
		numberSpacing?: number;
		numberFormatter?: Function;
		valueFontSize?: Function;
		type?: GaugeTypes;
	};
}

/**
 * options specific to donut charts
 */
export interface DonutChartOptions extends PieChartOptions {
	donut?: {
		center?: {
			label?: string;
			numberFontSize?: Function;
			titleFontSize?: Function;
			titleYPosition?: Function;
			numberFormatter?: Function;
		};
		alignment?: Alignments;
	};
}

export interface MeterChartOptions extends BaseChartOptions {
	meter?: {
		height?: number;
		title?: {
			/**
			 * offsets the percentage value from the title
			 */
			paddingRight?: number;
			percentageIndicator?: {
				/**
				 * rendering of the percentage value relative to the dataset within title
				 */
				enabled?: boolean;
			};
		};
		status?: {
			indicatorSize?: number;
			paddingLeft?: number;
		};
	};
}

/**
 * options specific to radar charts
 */
export interface RadarChartOptions extends BaseChartOptions {
	radar?: {
		opacity: {
			unselected: number;
			selected: number;
		};
		axes: {
			angle: string;
			value: string;
		};
		xLabelPadding: number;
		yLabelPadding: number;
		yTicksNumber: number;
		minRange: number;
		xAxisRectHeight: number;
		dotsRadius: number;
		alignment?: Alignments;
	};
}
