import { Tools } from './tools';
import {
	BaseChartOptions,
	AxisChartOptions,
	ScatterChartOptions,
	LollipopChartOptions,
	LineChartOptions,
	BarChartOptions,
	StackedBarChartOptions,
	BoxplotChartOptions,
	AreaChartOptions,
	PieChartOptions,
	GaugeChartOptions,
	DonutChartOptions,
	BubbleChartOptions,
	BulletChartOptions,
	HistogramChartOptions,
	RadarChartOptions,
	ComboChartOptions,
	TreemapChartOptions,
	CirclePackChartOptions,
	WorldCloudChartOptions,
	// Components
	GridOptions,
	RulerOptions,
	AxesOptions,
	TimeScaleOptions,
	TooltipOptions,
	WordCloudChartTooltipOptions,
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
	ZoomBarTypes,
	LegendItemTypes,
} from './interfaces';
import enUSLocaleObject from 'date-fns/locale/en-US/index';
import { circlePack } from './configuration-non-customizable';

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
	numCharacter: 14,
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
	order: null,
	additionalItems: [],
};

/**
 * Grid options
 */
export const grid: GridOptions = {
	x: {
		// set enable to false will not draw grid and stroke of grid backdrop
		enabled: true,
		numberOfTicks: 15,
		alignWithAxisTicks: false,
	},
	y: {
		// set enable to false will not draw grid and stroke of grid backdrop
		enabled: true,
		numberOfTicks: 5,
		alignWithAxisTicks: false,
	},
};

/**
 * Ruler options
 */
export const ruler: RulerOptions = {
	// enable or disable ruler
	enabled: true,
};

/**
 * Tooltip options
 */
export const baseTooltip: TooltipOptions = {
	enabled: true,
	showTotal: true,
	truncation: standardTruncationOptions,
	groupLabel: 'Group',
};

// These options will be managed by Tools.mergeDefaultChartOptions
// by removing the ones the user is not providing,
// and by TwoDimensionalAxes.
const axes: AxesOptions = {
	top: {
		visible: true,
		includeZero: true,
		truncation: standardTruncationOptions,
	},
	bottom: {
		visible: true,
		includeZero: true,
		truncation: standardTruncationOptions,
	},
	left: {
		visible: true,
		includeZero: true,
		truncation: standardTruncationOptions,
	},
	right: {
		visible: true,
		includeZero: true,
		truncation: standardTruncationOptions,
	},
};

export const timeScale: TimeScaleOptions = {
	addSpaceOnEdges: 1,
	showDayName: false,
	localeObject: enUSLocaleObject,
	timeIntervalFormats: {
		'15seconds': { primary: 'MMM d, pp', secondary: 'pp' },
		minute: { primary: 'MMM d, p', secondary: 'p' },
		'30minutes': { primary: 'MMM d, p', secondary: 'p' },
		hourly: { primary: 'MMM d, hh a', secondary: 'hh a' },
		daily: { primary: 'MMM d', secondary: 'd' },
		weekly: { primary: 'eee, MMM d', secondary: 'eee' },
		monthly: { primary: 'MMM yyyy', secondary: 'MMM' },
		quarterly: { primary: "QQQ ''yy", secondary: 'QQQ' },
		yearly: { primary: 'yyyy', secondary: 'yyyy' },
	},
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
		prefix: 'cc',
	},
	data: {
		groupMapsTo: 'group',
		loading: false,
		selectedGroups: [],
	},
	color: {
		scale: null,
		pairing: {
			numberOfVariants: null,
			option: 1,
		},
		gradient: {
			enabled: false,
		},
	},
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
			type: ZoomBarTypes.GRAPH_VIEW,
		},
	} as ZoomBarsOptions,
	toolbar: {
		enabled: false,
		numberOfIcons: 3,
		controls: [],
	} as ToolbarOptions,
} as AxisChartOptions);

/**
 * options specific to simple bar charts
 */
const baseBarChart: BarChartOptions = Tools.merge({}, axisChart, {
	bars: {
		maxWidth: 16,
	},
	timeScale: Tools.merge(timeScale, {
		addSpaceOnEdges: 1,
	} as TimeScaleOptions),
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
		dividerSize: 1.5,
	} as StackedBarOptions),
} as BarChartOptions);

/**
 * options specific to boxplot charts
 */
const boxplotChart: BoxplotChartOptions = Tools.merge(
	{},
	baseBarChart,
	{} as BarChartOptions
);

/**
 * options specific to scatter charts
 */
const scatterChart: ScatterChartOptions = Tools.merge({}, axisChart, {
	points: {
		// default point radius to 4
		radius: 4,
		fillOpacity: 0.3,
		filled: true,
		enabled: true,
	},
} as ScatterChartOptions);

/**
 * options specific to lollipop charts
 */
const lollipopChart: LollipopChartOptions = scatterChart as LollipopChartOptions;

/**
 * options specific to line charts
 */
const lineChart: LineChartOptions = Tools.merge({}, scatterChart, {
	points: {
		// default point radius to 3
		radius: 3,
		filled: false,
		enabled: true,
	},
} as LineChartOptions);

/**
 * options specific to area charts
 */
const areaChart: AreaChartOptions = Tools.merge({}, lineChart, {
	timeScale: Tools.merge(timeScale, {
		addSpaceOnEdges: 0,
	} as TimeScaleOptions),
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
		radiusMapsTo: 'radius',
		radiusLabel: 'Radius',
		radiusRange: (chartSize, data) => {
			const smallerChartDimension = Math.min(
				chartSize.width,
				chartSize.height
			);
			return [
				(smallerChartDimension * 3) / 400,
				(smallerChartDimension * 25) / 400,
			];
		},
		fillOpacity: 0.2,
		enabled: true,
	},
	points: {
		filled: true,
	},
	legend: {
		additionalItems: [
			{
				type: LegendItemTypes.RADIUS,
				name: 'Radius',
			},
		],
	},
} as BubbleChartOptions);

/**
 * options specific to bullet charts
 */
const bulletChart: BulletChartOptions = Tools.merge({}, axisChart, {
	bullet: {
		performanceAreaTitles: ['Poor', 'Satisfactory', 'Great'],
	},
	grid: {
		x: {
			enabled: false,
		},
		y: {
			enabled: false,
		},
	},
	legend: {
		additionalItems: [
			{
				type: LegendItemTypes.AREA,
				name: 'Poor area',
			},
			{
				type: LegendItemTypes.AREA,
				name: 'Satisfactory area',
			},
			{
				type: LegendItemTypes.AREA,
				name: 'Great area',
			},
			{
				type: LegendItemTypes.QUARTILE,
				name: 'Quartiles',
			},
		],
	}
} as BulletChartOptions);

/**
 * options specific to stacked bar charts
 */
const histogramChart: HistogramChartOptions = Tools.merge({}, baseBarChart, {
	timeScale: Tools.merge(timeScale, {
		addSpaceOnEdges: 0,
	} as TimeScaleOptions),
} as BarChartOptions);

/*
 * options specific to word cloud charts
 */
const wordCloudChart: WorldCloudChartOptions = Tools.merge({}, chart, {
	tooltip: Tools.merge({}, baseTooltip, {
		wordLabel: 'Word',
		valueLabel: 'Value',
	}) as WordCloudChartTooltipOptions,
	wordCloud: {
		fontSizeMapsTo: 'value',
		fontSizeRange: (chartSize, data) => {
			const smallerChartDimension = Math.min(
				chartSize.width,
				chartSize.height
			);
			return [
				(smallerChartDimension * 20) / 400,
				(smallerChartDimension * 75) / 400,
			];
		},
		wordMapsTo: 'word',
	},
} as WorldCloudChartOptions);

/**
 * options specific to pie charts
 */
const pieChart: PieChartOptions = Tools.merge({}, chart, {
	pie: {
		labels: {
			formatter: null,
			enabled: true,
		},
		alignment: Alignments.LEFT,
		sortFunction: null,
	},
} as PieChartOptions);

/**
 * options specific to gauge charts
 */
const gaugeChart: GaugeChartOptions = Tools.merge({}, chart, {
	legend: {
		enabled: false,
	},
	gauge: {
		type: GaugeTypes.SEMI,
		arcWidth: 16,
		deltaArrow: {
			size: (radius) => radius / 8,
			enabled: true,
		},
		showPercentageSymbol: true,
		status: null,
		numberSpacing: 10,
		deltaFontSize: (radius) => radius / 8,
		valueFontSize: (radius) => radius / 2.5,
		numberFormatter: (number) =>
			number.toFixed(2) % 1 !== 0
				? number.toFixed(2).toLocaleString()
				: number.toFixed().toLocaleString(),
		alignment: Alignments.LEFT,
	},
} as GaugeChartOptions);

/**
 * options specific to donut charts
 */
const donutChart: DonutChartOptions = Tools.merge({}, pieChart, {
	donut: {
		center: {
			numberFontSize: (radius) =>
				Math.min((radius / 100) * 24, 24) + 'px',
			titleFontSize: (radius) => Math.min((radius / 100) * 15, 15) + 'px',
			titleYPosition: (radius) => Math.min((radius / 80) * 20, 20),
			numberFormatter: (number) => Math.floor(number).toLocaleString(),
		},
		alignment: Alignments.LEFT,
	},
} as DonutChartOptions);

const meterChart: MeterChartOptions = Tools.merge({}, chart, {
	legend: {
		enabled: false,
	},
	meter: {
		height: 8,
		statusBar: {
			percentageIndicator: {
				enabled: true,
			},
		},
	},
} as MeterChartOptions);

/**
 * options specific to radar charts
 */
const radarChart: RadarChartOptions = Tools.merge({}, chart, {
	radar: {
		axes: {
			angle: 'key',
			value: 'value',
		},
		alignment: Alignments.LEFT,
	},
	tooltip: {
		gridline: {
			enabled: true,
		},
		valueFormatter: (value) =>
			value !== null && value !== undefined ? value : 'N/A',
	},
} as RadarChartOptions);

/**
 * options specific to combo charts
 */
const comboChart: ComboChartOptions = Tools.merge({}, baseBarChart, {
	comboChartTypes: [],
} as ComboChartOptions);

/*
 * options specific to treemap charts
 */
const treemapChart: TreemapChartOptions = Tools.merge({}, chart, {
	data: Tools.merge(chart.data, {
		groupMapsTo: 'name',
	}),
} as TreemapChartOptions);

/*
 * options specific to circle pack charts
 */
const circlePackChart: CirclePackChartOptions = Tools.merge(
	{},
	chart,
	circlePack,
	{
		data: Tools.merge(chart.data, {
			groupMapsTo: 'name',
		}),
	} as CirclePackChartOptions
);

export const options = {
	chart,
	axisChart,
	simpleBarChart,
	groupedBarChart,
	stackedBarChart,
	boxplotChart,
	bubbleChart,
	bulletChart,
	histogramChart,
	lineChart,
	areaChart,
	stackedAreaChart,
	scatterChart,
	lollipopChart,
	pieChart,
	donutChart,
	meterChart,
	radarChart,
	gaugeChart,
	comboChart,
	treemapChart,
	circlePackChart,
	wordCloudChart,
};

export const defaultBins = 10;

export * from './configuration-non-customizable';
