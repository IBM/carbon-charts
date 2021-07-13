import {
	GaugeTypes,
	Statuses,
	ArrowDirections,
	Alignments,
	AggregationTypes,
	ChartTypes,
} from './enums';
import {
	LegendOptions,
	TooltipOptions,
	GridOptions,
	AxesOptions,
	ZoomBarsOptions,
} from './index';
import { BarOptions, StackedBarOptions } from './components';
import { TimeScaleOptions } from './axis-scales';

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
		group: string,
		label?: string,
		data?: any,
		defaultFillColor?: string
	) => string;
	/**
	 * Optional function to generate the stroke color based on datasetLabel, label, and/or data
	 * (note) - not all chart types support the stroke color (e.g. wordcloud)
	 */
	getStrokeColor?: (
		group: string,
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
		 * used to simulate data loading in skeleton way
		 */
		loading?: boolean;
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
		 * e.g. { 'Dataset 1': 'blue' }
		 */
		scale?: object;
		/**
		 * use a carbon dataviz preset color palette
		 * put the index (selection of which variant)
		 */
		pairing?: {
			/**
			 * the number of color variants in the palette (defaults to using the number of data groups in the given data)
			 */
			numberOfVariants?: number;
			/**
			 * the option number of the color paring
			 */
			option?: number;
		};
		/*
		 * options related to gradient
		 * e.g. { enabled: true }
		 */
		gradient?: object;
	};
}

/**
 * Options common to any chart with an axis
 */
export interface AxisChartOptions extends BaseChartOptions {
	axes?: AxesOptions;
	grid?: GridOptions;
	timeScale?: TimeScaleOptions;
	/**
	 * zoombar configuration
	 */
	zoomBar?: ZoomBarsOptions;
}

/**
 * options specific to boxplot charts
 */
export interface BoxplotChartOptions extends AxisChartOptions {}

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
		enabled?: boolean;
	};
}

/**
 * options specific to lollipop charts
 */
export interface LollipopChartOptions extends ScatterChartOptions {}

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
		 * options for what the bubble radius value maps to
		 */
		radiusLabel?: string;
		/**
		 * A function that would determine the range of the bubble radius to use
		 * Returns an array with the 1st value being the min and the 2nd value being the max radius
		 */
		radiusRange?: Function;
		/**
		 * Opacity of the fills used within each circle
		 */
		fillOpacity?: number;
		/**
		 * enabled scatter dot or not
		 */
		enabled?: boolean;
	};
}

/**
 * options specific to bullet charts
 */
export interface BulletChartOptions extends AxisChartOptions {
	/**
	 * options for the individual bullets
	 */
	bullet?: {
		performanceAreaTitles?: string[];
	};
}

/**
 * options specific to histogram charts
 */
export interface HistogramChartOptions extends AxisChartOptions {
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
	/**
	 * options to bound the area of the chart
	 */
	bounds?: {
		upperBoundMapsTo?: string;
		lowerBoundMapsTo?: string;
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
 * options specific to world cloud charts
 */
export interface WordCloudChartTooltipOptions extends TooltipOptions {
	/** the label that shows up by the highlighted word in the tooltip */
	wordLabel?: string;
	/** the label that shows up by the value of the highlighted word in the tooltip */
	valueLabel?: string;
}

export interface WorldCloudChartOptions extends BaseChartOptions {
	wordCloud?: {
		/** what key in your charting data will the font sizes map to? */
		fontSizeMapsTo?: string;
		/** a function (chartSize, data) => {} that'll decide the range of font sizes, e.g. [10, 80] */
		fontSizeRange?: Function;
		/** what key in your charting data will the words map to? */
		wordMapsTo?: string;
	};
	/**
	 * tooltip configuration
	 */
	tooltip?: WordCloudChartTooltipOptions;
}

/**
 * options specific to pie charts
 */
export interface PieChartOptions extends BaseChartOptions {
	pie?: {
		labels?: {
			formatter?: Function;
			enabled?: Boolean;
		};
		alignment?: Alignments;
		sortFunction?: (a: any, b: any) => number;
	};
}

/**
 * options specific to gauge charts
 */
export interface GaugeChartOptions extends BaseChartOptions {
	gauge?: {
		arcWidth?: number;
		deltaArrow?: {
			direction?: ArrowDirections;
			size?: Function;
			enabled: Boolean;
		};
		showPercentageSymbol?: Boolean;
		status?: Statuses;
		deltaFontSize?: Function;
		numberSpacing?: number;
		numberFormatter?: Function;
		valueFontSize?: Function;
		type?: GaugeTypes;
		alignment?: Alignments;
	};
}

/**
 * options specific to donut charts
 */
export interface DonutChartOptions extends PieChartOptions {
	donut?: {
		center?: {
			label?: string;
			number?: number;
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
		peak?: number;
		status?: {
			ranges: Array<{
				range: [number, number];
				status: Statuses;
			}>;
		};
		height?: number;
		title?: {
			percentageIndicator?: {
				/**
				 * rendering of the percentage value relative to the dataset within title
				 */
				enabled?: boolean;
			};
		};
	};
}

/**
 * options specific to radar charts
 */
export interface RadarChartOptions extends BaseChartOptions {
	radar?: {
		axes: {
			angle: string;
			value: string;
		};
		alignment?: Alignments;
	};
}

/**
 * options specific to combo charts
 */
export interface ComboChartOptions extends AxisChartOptions {
	comboChartTypes: Array<{
		type: ChartTypes | any;
		options?: object;
		correspondingDatasets: Array<string>;
	}>;
}

/*
 * options specific to treemap charts
 */
export interface TreemapChartOptions extends BaseChartOptions {}

/*
 * options specific to circle pack charts
 */
export interface CirclePackChartOptions extends BaseChartOptions {
	circlePack?: {
		circles: {
			fillOpacity: number;
		};
		// depth of nodes to display
		hierachyLevel: number;
		padding?: {
			outer?: number;
			inner?: number;
		};
	};
}
