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
	GaugeChartOptions,
	DonutChartOptions,
	BubbleChartOptions,
	RadarChartOptions,
	TreemapChartOptions,
	// Components
	GridOptions,
	RulerOptions,
	AxesOptions,
	TimeScaleOptions,
	TooltipOptions,
	LegendOptions,
	StackedBarOptions,
	MeterChartOptions,
	ToolbarOptions,
	ToolbarControl,
	ZoomBarsOptions,
	// ENUMS
	Alignments,
	GaugeTypes,
	LegendPositions,
	TruncationTypes,
	ToolbarControlTypes,
	ZoomBarTypes
} from "./interfaces";
import enUSLocaleObject from "date-fns/locale/en-US/index";
import { mouse } from "d3";

/*
 *****************************
 * User configurable options *
 *****************************
 */

/**
 * Default truncation configuration
 */
const standardTruncationOptions = {
	type: TruncationTypes.END_LINE,
	threshold: 16,
	numCharacter: 14
};

/**
 * Legend options
 */
const legend: LegendOptions = {
	enabled: true,
	position: LegendPositions.BOTTOM,
	clickable: true,
	truncation: standardTruncationOptions,
	alignment: Alignments.LEFT,
	order: null
};

/**
 * Grid options
 */
export const grid: GridOptions = {
	x: {
		// set enable to false will not draw grid and stroke of grid backdrop
		enabled: true,
		numberOfTicks: 15
	},
	y: {
		// set enable to false will not draw grid and stroke of grid backdrop
		enabled: true,
		numberOfTicks: 5
	}
};

/**
 * Ruler options
 */
export const ruler: RulerOptions = {
	// enable or disable ruler
	enabled: true
};

/**
 * Tooltip options
 */
export const baseTooltip: TooltipOptions = {
	enabled: true,
	showTotal: true,
	valueFormatter: (d) => d.toLocaleString(),
	truncation: standardTruncationOptions
};

// These options will be managed by Tools.mergeDefaultChartOptions
// by removing the ones the user is not providing,
// and by TwoDimensionalAxes.
const axes: AxesOptions = {
	top: {
		visible: true,
		includeZero: true,
		truncation: standardTruncationOptions
	},
	bottom: {
		visible: true,
		includeZero: true,
		truncation: standardTruncationOptions
	},
	left: {
		visible: true,
		includeZero: true,
		truncation: standardTruncationOptions
	},
	right: {
		visible: true,
		includeZero: true,
		truncation: standardTruncationOptions
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
		loading: false,
		selectedGroups: []
	},
	color: {
		scale: null,
		pairing: {
			numberOfVariants: null,
			option: 1
		},
		gradient: {
			enabled: false
		}
	}
};

/**
 * Options common to any chart with an axis
 */
const axisChart: AxisChartOptions = Tools.merge({}, chart, {
	axes,
	timeScale,
	grid,
	ruler,
	zoomBar: {
		zoomRatio: 0.4,
		minZoomRatio: 0.01,
		top: {
			enabled: false,
			type: ZoomBarTypes.GRAPH_VIEW
		},
		updateRangeAxis: false
	} as ZoomBarsOptions,
	toolbar: {
		enabled: true,
		numberOfIcons: 3,
		controls: [
			{
				type: ToolbarControlTypes.SHOW_AS_DATATABLE
			},
			{
				type: ToolbarControlTypes.MAKE_FULLSCREEN
			}
		]
	} as ToolbarOptions
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
	} as TimeScaleOptions)
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
 * options specific to scatter charts
 */
const scatterChart: ScatterChartOptions = Tools.merge({}, axisChart, {
	points: {
		// default point radius to 4
		radius: 4,
		fillOpacity: 0.3,
		filled: true,
		enabled: true
	}
} as ScatterChartOptions);

/**
 * options specific to line charts
 */
const lineChart: LineChartOptions = Tools.merge({}, scatterChart, {
	points: {
		// default point radius to 3
		radius: 3,
		filled: false,
		enabled: true
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
		fillOpacity: 0.2,
		enabled: true
	}
} as BubbleChartOptions);

/**
 * options specific to pie charts
 */
const pieChart: PieChartOptions = Tools.merge({}, chart, {
	pie: {
		labels: {
			formatter: null
		},
		alignment: Alignments.LEFT
	}
} as PieChartOptions);

/**
 * options specific to gauge charts
 */
const gaugeChart: GaugeChartOptions = Tools.merge({}, chart, {
	legend: {
		enabled: false
	},
	gauge: {
		type: GaugeTypes.SEMI,
		arcWidth: 16,
		deltaArrow: {
			size: (radius) => radius / 8,
			enabled: true
		},
		status: null,
		numberSpacing: 10,
		deltaFontSize: (radius) => radius / 8,
		valueFontSize: (radius) => radius / 2.5,
		numberFormatter: (number) =>
			number.toFixed(2) % 1 !== 0
				? number.toFixed(2).toLocaleString()
				: number.toFixed().toLocaleString(),
		alignment: Alignments.LEFT
	}
} as GaugeChartOptions);

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
		},
		alignment: Alignments.LEFT
	}
} as DonutChartOptions);

const meterChart: MeterChartOptions = Tools.merge({}, chart, {
	legend: {
		enabled: false
	},
	meter: {
		height: 8,
		statusBar: {
			percentageIndicator: {
				enabled: true
			}
		}
	}
} as MeterChartOptions);

/**
 * options specific to radar charts
 */
const radarChart: RadarChartOptions = Tools.merge({}, chart, {
	radar: {
		axes: {
			angle: "key",
			value: "value"
		},
		alignment: Alignments.LEFT
	},
	tooltip: {
		gridline: {
			enabled: true
		},
		valueFormatter: (value) =>
			value !== null && value !== undefined ? value : "N/A"
	}
} as RadarChartOptions);

/**
 * options specific to treemap charts
 */
const treemapChart: TreemapChartOptions = Tools.merge({}, chart, {
	data: Tools.merge(chart.data, {
		groupMapsTo: "name"
	})
} as TreemapChartOptions);

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
	meterChart,
	radarChart,
	gaugeChart,
	treemapChart
};

export * from "./configuration-non-customizable";
