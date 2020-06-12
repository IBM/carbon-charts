import { Tools } from "./tools";
import {
	BaseChartOptions,
	AxisChartOptions,
	ScatterChartOptions,
	LineChartOptions,
	BarChartOptions,
	StackedBarChartOptions,
	AreaChartOptions,
	PieChartOptions,
	DonutChartOptions,
	BubbleChartOptions,
	RadarChartOptions,
	HistogramChartOptions,
	// Components
	GridOptions,
	AxesOptions,
	TimeScaleOptions,
	TooltipOptions,
	AxisTooltipOptions,
	BarTooltipOptions,
	LegendOptions,
	StackedBarOptions,
	// ENUMs
	AggregationTypes,
	LegendPositions
} from "./interfaces";
import enUSLocaleObject from "date-fns/locale/en-US/index";

/*
 *****************************
 * User configurable options *
 *****************************
 */

/**
 * Legend options
 */
export const legend: LegendOptions = {
	position: LegendPositions.BOTTOM,
	clickable: true,
	enabled: true,
	items: {
		status: {
			ACTIVE: 1,
			DISABLED: 0
		},
		horizontalSpace: 12,
		verticalSpace: 24,
		textYOffset: 8
	},
	checkbox: {
		radius: 6.5,
		spaceAfter: 4
	}
};

/**
 * Grid options
 */
export const grid: GridOptions = {
	x: {
		numberOfTicks: 5
	},
	y: {
		numberOfTicks: 5
	}
};

/**
 * Tooltip options
 */
export const baseTooltip: TooltipOptions = {
	datapoint: {
		horizontalOffset: 10,
		enabled: true
	},
	title: {
		verticalOffset: 0.75,
		width: 0.4
	}
};

export const axisChartTooltip: AxisTooltipOptions = Tools.merge(
	{},
	baseTooltip,
	{
		gridline: {
			enabled: true,
			threshold: 0.02
		}
	} as AxisTooltipOptions
);

export const barChartTooltip: BarTooltipOptions = Tools.merge(
	{},
	axisChartTooltip,
	{
		datapoint: {
			verticalOffset: 4
		},
		gridline: {
			enabled: false
		}
	} as BarTooltipOptions
);

// These options will be managed by Tools.mergeDefaultChartOptions
// by removing the ones the user is not providing,
// and by TwoDimensionalAxes.
const axes: AxesOptions = {
	top: {
		includeZero: true
	},
	bottom: {
		includeZero: true
	},
	left: {
		includeZero: true
	},
	right: {
		includeZero: true
	}
};

export const timeScale: TimeScaleOptions = {
	addSpaceOnEdges: 1,
	showDayName: false,
	localeObject: enUSLocaleObject,
	timeIntervalFormats: {
		"15seconds": { primary: "MMM d, pp", secondary: "pp" },
		minute: { primary: "MMM d, p", secondary: "p" },
		"30minutes": { primary: "MMM d, p", secondary: "p" },
		hourly: { primary: "MMM d, hh a", secondary: "hh a" },
		daily: { primary: "MMM d", secondary: "d" },
		weekly: { primary: "eee, MMM d", secondary: "eee" },
		monthly: { primary: "MMM yyyy", secondary: "MMM" },
		quarterly: { primary: "QQQ ''yy", secondary: "QQQ" },
		yearly: { primary: "yyyy", secondary: "yyyy" }
	}
};

/**
 * Base chart options common to any chart
 */
const chart: BaseChartOptions = {
	width: null,
	height: null,
	resizable: true,
	tooltip: baseTooltip,
	legend,
	style: {
		prefix: "cc"
	},
	data: {
		groupMapsTo: "group",
		loading: false
	},
	color: {
		scale: null
	}
};

/**
 * Options common to any chart with an axis
 */
const axisChart: AxisChartOptions = Tools.merge({}, chart, {
	axes,
	timeScale,
	grid,
	tooltip: axisChartTooltip
} as AxisChartOptions);

/**
 * options specific to simple bar charts
 */
const baseBarChart: BarChartOptions = Tools.merge({}, axisChart, {
	bars: {
		maxWidth: 16
	},
	timeScale: Tools.merge(timeScale, {
		addSpaceOnEdges: 1
	} as TimeScaleOptions),
	groupIdentifier: "group-id"
} as BarChartOptions);

/**
 * options specific to simple bar charts
 */
const simpleBarChart: BarChartOptions = Tools.merge(
	{},
	baseBarChart,
	{} as BarChartOptions
);

/**
 * options specific to simple bar charts
 */
const groupedBarChart: BarChartOptions = Tools.merge(
	{},
	baseBarChart,
	{} as BarChartOptions
);

/**
 * options specific to stacked bar charts
 */
const stackedBarChart: StackedBarChartOptions = Tools.merge({}, baseBarChart, {
	bars: Tools.merge({}, baseBarChart.bars, {
		dividerSize: 1.5
	} as StackedBarOptions)
} as BarChartOptions);

/**
 * options specific to stacked bar charts
 */
const histogramChart: HistogramChartOptions = Tools.merge({}, baseBarChart, {
	timeScale: Tools.merge(timeScale, {
		addSpaceOnEdges: 1
	} as TimeScaleOptions),
	tooltip: barChartTooltip
} as BarChartOptions);

/**
 * options specific to line charts
 */
const lineChart: LineChartOptions = Tools.merge({}, axisChart, {
	points: {
		// default point radius to 3
		radius: 3,
		filled: false
	}
} as LineChartOptions);

/**
 * options specific to area charts
 */
const areaChart: AreaChartOptions = Tools.merge({}, lineChart, {
	timeScale: Tools.merge(timeScale, {
		addSpaceOnEdges: 0
	} as TimeScaleOptions)
} as LineChartOptions);

/**
 * options specific to stacked area charts
 */
const stackedAreaChart = areaChart;

/**
 * options specific to scatter charts
 */
const scatterChart: ScatterChartOptions = Tools.merge({}, axisChart, {
	points: {
		// default point radius to 4
		radius: 4,
		fillOpacity: 0.3,
		filled: true
	}
} as ScatterChartOptions);

/**
 * options specific to bubble charts
 */
const bubbleChart: BubbleChartOptions = Tools.merge({}, axisChart, {
	bubble: {
		radiusMapsTo: "radius",
		radiusRange: (chartSize, data) => {
			const smallerChartDimension = Math.min(
				chartSize.width,
				chartSize.height
			);
			return [
				(smallerChartDimension * 3) / 400,
				(smallerChartDimension * 25) / 400
			];
		},
		fillOpacity: 0.2
	}
} as BubbleChartOptions);

/**
 * options specific to pie charts
 */
const pieChart: PieChartOptions = Tools.merge({}, chart, {
	pie: {
		radiusOffset: -15,
		innerRadius: 2,
		padAngle: 0.007,
		hoverArc: {
			outerRadiusOffset: 3
		},
		xOffset: 30,
		yOffset: 20,
		yOffsetCallout: 10,
		callout: {
			minSliceDegree: 5,
			offsetX: 15,
			offsetY: 12,
			horizontalLineLength: 8,
			textMargin: 2
		},
		labels: {
			formatter: null
		}
	}
} as PieChartOptions);

/**
 * options specific to donut charts
 */
const donutChart: DonutChartOptions = Tools.merge({}, pieChart, {
	donut: {
		center: {
			numberFontSize: (radius) =>
				Math.min((radius / 100) * 24, 24) + "px",
			titleFontSize: (radius) => Math.min((radius / 100) * 15, 15) + "px",
			titleYPosition: (radius) => Math.min((radius / 80) * 20, 20),
			numberFormatter: (number) => Math.floor(number).toLocaleString()
		}
	}
} as DonutChartOptions);

/**
 * options specific to radar charts
 */
const radarChart: RadarChartOptions = Tools.merge({}, chart, {
	radar: {
		axes: {
			angle: "key",
			value: "value"
		},
		opacity: {
			unselected: 0.1,
			selected: 0.3
		},
		xLabelPadding: 10,
		yLabelPadding: 8,
		yTicksNumber: 4,
		minRange: 10,
		xAxisRectHeight: 50,
		dotsRadius: 5
	},
	tooltip: {
		gridline: {
			enabled: true
		},
		valueFormatter: (value) =>
			value !== null && value !== undefined ? value : "N/A"
	}
} as RadarChartOptions);

export const options = {
	chart,
	axisChart,
	simpleBarChart,
	groupedBarChart,
	stackedBarChart,
	bubbleChart,
	lineChart,
	areaChart,
	stackedAreaChart,
	scatterChart,
	pieChart,
	donutChart,
	histogramChart,
	radarChart
};

/**
 * Options for line behaviour
 */
export const lines = {
	opacity: {
		unselected: 0.3,
		selected: 1
	}
};

/**
 * Options for area behaviour
 */
export const area = {
	opacity: {
		unselected: 0,
		selected: 0.4
	}
};

/**
 * Options for area behaviour
 */
export const areas = {
	opacity: {
		unselected: 0.3,
		selected: 1
	}
};

/**
 * Base transition configuration
 */
export const transitions = {
	default: {
		duration: 300
	},
	pie_slice_mouseover: {
		duration: 100
	},
	pie_chart_titles: {
		duration: 375
	},
	graph_element_mouseover_fill_update: {
		duration: 100
	},
	graph_element_mouseout_fill_update: {
		duration: 100
	}
};

export const axis = {
	ticks: {
		number: 7,
		rotateIfSmallerThan: 30
	},
	paddingRatio: 0.1
};

export const spacers = {
	default: {
		size: 24
	}
};

export const tickSpaceRatioVertical = 2.5;
export const tickSpaceRatioHorizontal = 3.5;

export const defaultBins = 10;
