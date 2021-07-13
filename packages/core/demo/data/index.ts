import * as areaDemos from './area';
import * as barDemos from './bar';
import * as boxplotDemos from './boxplot';
import * as bubbleDemos from './bubble';
import * as bulletDemos from './bullet';
import * as comboDemos from './combo';
import * as donutDemos from './donut';
import * as gaugeDemos from './gauge';
import * as lineDemos from './line';
import * as lollipopDemos from './lollipop';
import * as meterDemos from './meter';
import * as pieDemos from './pie';
import * as radarDemos from './radar';
import * as scatterDemos from './scatter';
import * as stepDemos from './step';
import * as timeSeriesAxisDemos from './time-series-axis';
import * as treemapDemos from './treemap';
import * as circlePackDemos from './circle-pack';
import * as toolbarDemos from './toolbar';
import * as wordCloudDemos from './wordcloud';
import * as zoomBarDemos from './zoom-bar';
import * as highScaleDemos from './high-scale';

export * from './area';
export * from './bar';
export * from './boxplot';
export * from './bubble';
export * from './bullet';
export * from './combo';
export * from './donut';
export * from './gauge';
export * from './line';
export * from './lollipop';
export * from './meter';
export * from './pie';
export * from './radar';
export * from './scatter';
export * from './step';
export * from './time-series-axis';
export * from './treemap';
export * from './circle-pack';
export * from './toolbar';
export * from './wordcloud';
export * from './zoom-bar';
export * from './high-scale';

import {
	createChartSandbox,
	createReactChartApp,
	createAngularChartApp,
	createVueChartApp,
	createVanillaChartApp,
	createSvelteChartApp,
} from '../create-codesandbox';

import chartTypes from './CHART_TYPES';
export * from './CHART_TYPES';

export enum DemoGroupTypes {
	UTILITY = 'utility',
	SIMPLE_CHART = 'simple-chart',
	COMPLEX_CHART = 'complex-chart',
}

const utilityDemoGroups = [
	{
		title: 'Axes',
		demos: [
			{
				options: barDemos.simpleBarOptionsCustomTicks,
				data: barDemos.simpleBarDataCustomTicks,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.stackedBarTimeSeriesOptionsCustomTicks,
				data: barDemos.stackedBarTimeSeriesDataCustomTicks,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: barDemos.simpleBarFixedDomainOptions,
				data: barDemos.simpleBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: lineDemos.lineCustomDomainOptions,
				data: lineDemos.lineData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineTimeSeriesRotatedTicksOptions,
				data: lineDemos.lineTimeSeriesDataRotatedTicks,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineLogAxisOptions,
				data: lineDemos.lineLogAxisData,
				chartType: chartTypes.LineChart,
			},
		],
	},
	{
		title: 'Axes/Time series',
		demos: [
			{
				options: timeSeriesAxisDemos.lineTimeSeries15secondsOptions,
				data: timeSeriesAxisDemos.lineTimeSeriesData15seconds,
				chartType: chartTypes.LineChart,
			},
			{
				options: timeSeriesAxisDemos.lineTimeSeriesMinuteOptions,
				data: timeSeriesAxisDemos.lineTimeSeriesDataMinute,
				chartType: chartTypes.LineChart,
			},
			{
				options: timeSeriesAxisDemos.lineTimeSeries30minutesOptions,
				data: timeSeriesAxisDemos.lineTimeSeriesData30minutes,
				chartType: chartTypes.LineChart,
			},
			{
				options:
					timeSeriesAxisDemos.lineTimeSeriesHourlyDefaultLocaleOptions,
				data:
					timeSeriesAxisDemos.lineTimeSeriesDataHourlyDefaultTicksFormats,
				chartType: chartTypes.LineChart,
			},
			{
				options:
					timeSeriesAxisDemos.lineTimeSeriesHourlyCustomTicksFormatsOptions,
				data:
					timeSeriesAxisDemos.lineTimeSeriesDataHourlyCustomTicksFormats,
				chartType: chartTypes.LineChart,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataDaily,
				options: timeSeriesAxisDemos.lineTimeSeriesDailyOptions,
				chartType: chartTypes.LineChart,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataWeekly,
				options: timeSeriesAxisDemos.lineTimeSeriesWeeklyOptions,
				chartType: chartTypes.LineChart,
			},
			{
				data:
					timeSeriesAxisDemos.lineTimeSeriesDataMonthlyDefaultLocale,
				options:
					timeSeriesAxisDemos.lineTimeSeriesMonthlyDefaultLocaleOptions,
				chartType: chartTypes.LineChart,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataMonthlyCustomLocale,
				options:
					timeSeriesAxisDemos.lineTimeSeriesMonthlyCustomLocaleOptions,
				chartType: chartTypes.LineChart,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataQuarterly,
				options: timeSeriesAxisDemos.lineTimeSeriesQuarterlyOptions,
				chartType: chartTypes.LineChart,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataYearly,
				options: timeSeriesAxisDemos.lineTimeSeriesYearlyOptions,
				chartType: chartTypes.LineChart,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataSingleDatum,
				options: timeSeriesAxisDemos.lineTimeSeriesSingleDatumOptions,
				chartType: chartTypes.LineChart,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesNoExtendedDomainData,
				options:
					timeSeriesAxisDemos.lineTimeSeriesNoExtendedDomainOptions,
				chartType: chartTypes.LineChart,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataTwoIdenticalLabels,
				options:
					timeSeriesAxisDemos.lineTimeSeriesTwoIdenticalLabelsOptions,
				chartType: chartTypes.LineChart,
			},
			{
				data:
					timeSeriesAxisDemos.lineTimeSeriesDataAllLabelsInPrimaryFormat,
				options:
					timeSeriesAxisDemos.lineTimeSeriesAllLabelsInPrimaryFormatOptions,
				chartType: chartTypes.LineChart,
			},
		],
	},
	{
		title: 'Colors',
		demos: [
			{
				options: barDemos.simpleBarColorOverrideOptions,
				data: barDemos.simpleBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: lineDemos.lineCustomColorOptions,
				data: lineDemos.lineData,
				chartType: chartTypes.LineChart,
			},
			{
				options: circlePackDemos.circlePackTwoLevelCustomColorsOptions,
				data: circlePackDemos.circlePackTwoLevelData,
				chartType: chartTypes.CirclePackChart,
			},
		],
	},
	{
		title: 'Legend',
		demos: [
			{
				options: barDemos.simpleBarCenteredLegendOptions,
				data: barDemos.simpleBarCenteredLegendData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarCustomLegendOrderOptions,
				data: barDemos.simpleBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarAdditionalLegendItemsOptions,
				data: barDemos.simpleBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.groupedBarSelectedGroupsOptions,
				data: barDemos.groupedBarSelectedGroupsData,
				chartType: chartTypes.GroupedBarChart,
			},
			{
				options: lineDemos.lineSelectedGroupsOptions,
				data: lineDemos.lineSelectedGroupsData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineOptionsLegendOrientation,
				data: lineDemos.lineData,
				chartType: chartTypes.LineChart,
			},
		],
	},
	{
		title: 'Locale',
		demos: [
			{
				options: barDemos.simpleBarTurkishLocaleOptions,
				data: barDemos.simpleBarTurkishLocaleData,
				chartType: chartTypes.SimpleBarChart,
			},
		],
	},
	{
		title: 'Thresholds',
		demos: [
			{
				options: lineDemos.lineTimeSeriesWithThresholdsOptions,
				data: lineDemos.lineTimeSeriesData,
				chartType: chartTypes.LineChart,
			},
		],
	},
	{
		title: 'Toolbar',
		demos: [
			{
				options: toolbarDemos.toolbarStackedBarTimeSeriesOptions,
				data: toolbarDemos.toolbarStackedBarTimeSeriesData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: toolbarDemos.toolbarLineTimeSeriesOptions,
				data: toolbarDemos.toolbarLineTimeSeriesData,
				chartType: chartTypes.LineChart,
			},
		],
	},
	{
		title: 'Truncations',
		demos: [
			{
				options: barDemos.simpleHorizontalBarLongLabelOptions,
				data: barDemos.simpleHorizontalBarLongLabelData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: lineDemos.lineLongLabelOptions,
				data: lineDemos.lineLongLabelData,
				chartType: chartTypes.LineChart,
			},
		],
	},
	{
		title: 'Zoom bar',
		demos: [
			{
				options: zoomBarDemos.zoomBarStackedAreaTimeSeriesOptions,
				data: zoomBarDemos.zoomBarStackedAreaTimeSeriesData,
				chartType: chartTypes.StackedAreaChart,
			},
			{
				options: zoomBarDemos.zoomBarSimpleBarTimeSeriesOptions,
				data: zoomBarDemos.zoomBarSimpleBarTimeSeriesData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: zoomBarDemos.zoomBarStackedBarTimeSeriesOptions,
				data: zoomBarDemos.zoomBarStackedBarTimeSeriesData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: zoomBarDemos.definedZoomBarStackedBarTimeSeriesOptions,
				data: zoomBarDemos.definedZoomBarStackedBarTimeSeriesData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: zoomBarDemos.zoomBarBubbleTimeSeriesOptions,
				data: zoomBarDemos.zoomBarBubbleTimeSeriesData,
				chartType: chartTypes.BubbleChart,
			},
			{
				options: zoomBarDemos.zoomBarLineTimeSeriesOptions,
				data: zoomBarDemos.zoomBarLineTimeSeriesData,
				chartType: chartTypes.LineChart,
			},
			{
				options: zoomBarDemos.zoomBarScatterTimeSeriesOptions,
				data: zoomBarDemos.zoomBarScatterTimeSeriesData,
				chartType: chartTypes.ScatterChart,
			},
			{
				options: zoomBarDemos.zoomBarStepTimeSeriesOptions,
				data: zoomBarDemos.zoomBarStepTimeSeriesData,
				chartType: chartTypes.LineChart,
			},
			{
				options: zoomBarDemos.zoomBarLineTimeSeries15secondsOptions,
				data: zoomBarDemos.zoomBarLineTimeSeries15secondsData,
				chartType: chartTypes.LineChart,
			},
			{
				options: zoomBarDemos.zoomBarLineTimeSeriesInitDomainOptions,
				data: zoomBarDemos.zoomBarLineTimeSeriesInitDomainData,
				chartType: chartTypes.LineChart,
			},
			{
				options: zoomBarDemos.zoomBarStringDateOptions,
				data: zoomBarDemos.zoomBarStringDateData,
				chartType: chartTypes.LineChart,
			},
			{
				options: zoomBarDemos.zoomBarLockedOptions,
				data: zoomBarDemos.zoomBarLockedData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: zoomBarDemos.zoomBarSkeletonOptions,
				data: zoomBarDemos.zoomBarSkeletonData,
				chartType: chartTypes.StackedBarChart,
			},
		],
	},
].map((demoGroup: any) => {
	demoGroup.type = DemoGroupTypes.UTILITY;

	return demoGroup;
});

const simpleChartDemos = [
	{
		title: 'Area (simple)',
		description:
			'Area charts are similar to line charts, but the areas below the lines are filled with colors or patterns. Stacked charts are useful for comparing proportional contributions within a category. They plot the relative value that each data series contributes to the total.',
		demos: [
			{
				options: areaDemos.areaTimeSeriesCurvedOptions,
				data: areaDemos.areaTimeSeriesCurvedData,
				chartType: chartTypes.AreaChart,
				mainDemo: true,
			},
			{
				options: areaDemos.areaTimeSeriesOptions,
				data: areaDemos.areaTimeSeriesData,
				chartType: chartTypes.AreaChart,
			},
			{
				options: areaDemos.areaDiscreteDomainOptions,
				data: areaDemos.areaDiscreteDomain,
				chartType: chartTypes.AreaChart,
			},
			{
				options: areaDemos.boundedAreaTimeSeriesOptions,
				data: areaDemos.boundedAreaTimeSeriesData,
				chartType: chartTypes.AreaChart,
			},
			{
				options: areaDemos.areaSkeletonOptions,
				data: areaDemos.areaSkeletonData,
				chartType: chartTypes.AreaChart,
			},
			{
				options: areaDemos.areaEmptyOptions,
				data: areaDemos.areaEmptyData,
				chartType: chartTypes.AreaChart,
			},
		],
	},
	{
		title: 'Area (stacked)',
		demos: [
			{
				options: areaDemos.stackedAreaTimeSeriesOptions,
				data: areaDemos.stackedAreaTimeSeriesData,
				chartType: chartTypes.StackedAreaChart,
				mainDemo: true,
			},
			{
				options: areaDemos.stackedAreaTimeSeriesUnevenDataOptions,
				data: areaDemos.stackedAreaTimeSeriesUnevenData,
				chartType: chartTypes.StackedAreaChart,
			},
			{
				options: areaDemos.stackedAreaPercentageTimeSeriesOptions,
				data: areaDemos.stackedAreaTimeSeriesData,
				chartType: chartTypes.StackedAreaChart,
			},
		],
	},
	{
		title: 'Bar (simple)',
		description:
			'Bar charts use vertical or horizontal data markers to compare individual values. You can use them to compare discrete data or show trends over time.',
		demos: [
			{
				options: barDemos.simpleBarOptions,
				data: barDemos.simpleBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarTimeSeriesOptions,
				data: barDemos.simpleBarTimeSeriesData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarTimeSeriesDenseOptions,
				data: barDemos.simpleBarTimeSeriesDenseData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarEmptyStateOptions,
				data: barDemos.simpleBarEmptyStateData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarSkeletonOptions,
				data: barDemos.simpleBarSkeletonData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleHorizontalBarOptions,
				data: barDemos.simpleHorizontalBarData,
				chartType: chartTypes.SimpleBarChart,
				mainDemo: true,
			},
			{
				options: barDemos.simpleHorizontalBarTimeSeriesOptions,
				data: barDemos.simpleHorizontalBarTimeSeriesData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleHorizontalBarEmptyStateOptions,
				data: barDemos.simpleHorizontalBarEmptyStateData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleHorizontalBarSkeletonOptions,
				data: barDemos.simpleHorizontalBarSkeletonData,
				chartType: chartTypes.SimpleBarChart,
			},
		],
	},
	{
		title: 'Bar (floating)',
		demos: [
			{
				options: barDemos.floatingHorizontalBarTimeSeriesOptions,
				data: barDemos.floatingHorizontalBarTimeSeriesData,
				chartType: chartTypes.SimpleBarChart,
				mainDemo: true,
			},
			{
				options: barDemos.floatingBarOptions,
				data: barDemos.floatingBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.floatingHorizontalBarOptions,
				data: barDemos.floatingHorizontalBarData,
				chartType: chartTypes.SimpleBarChart,
			},
		],
	},
	{
		title: 'Bar (grouped)',
		description:
			'A grouped bar chart, also known as a clustered bar graph, multi-set bar chart, or grouped column chart, is a type of bar graph that is used to compare values across multiple categories.',
		demos: [
			{
				options: barDemos.groupedBarOptions,
				data: barDemos.groupedBarData,
				chartType: chartTypes.GroupedBarChart,
				mainDemo: true,
			},
			{
				options: barDemos.groupedBarEmptyStateOptions,
				data: barDemos.groupedBarEmptyStateData,
				chartType: chartTypes.GroupedBarChart,
			},
			{
				options: barDemos.groupedBarSkeletonOptions,
				data: barDemos.groupedBarSkeletonData,
				chartType: chartTypes.GroupedBarChart,
			},

			{
				options: barDemos.groupedHorizontalBarOptions,
				data: barDemos.groupedHorizontalBarData,
				chartType: chartTypes.GroupedBarChart,
			},
			{
				options: barDemos.groupedHorizontalBarEmptyStateOptions,
				data: barDemos.groupedHorizontalBarEmptyStateData,
				chartType: chartTypes.GroupedBarChart,
			},
			{
				options: barDemos.groupedHorizontalBarSkeletonOptions,
				data: barDemos.groupedHorizontalBarSkeletonData,
				chartType: chartTypes.GroupedBarChart,
			},
		],
	},
	{
		title: 'Bar (stacked)',
		description:
			'Stacked bar charts are useful for comparing proportional contributions within a category. They plot the relative value that each data series contributes to the total.',
		demos: [
			{
				options: barDemos.stackedBarOptions,
				data: barDemos.stackedBarData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: barDemos.stackedBarTimeSeriesOptions,
				data: barDemos.stackedBarTimeSeriesData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: barDemos.stackedBarEmptyStateOptions,
				data: barDemos.stackedBarEmptyStateData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: barDemos.stackedBarSkeletonOptions,
				data: barDemos.stackedBarSkeletonData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: barDemos.stackedHorizontalBarOptions,
				data: barDemos.stackedHorizontalBarData,
				chartType: chartTypes.StackedBarChart,
				mainDemo: true,
			},
			{
				options: barDemos.stackedHorizontalBarTimeSeriesOptions,
				data: barDemos.stackedHorizontalBarTimeSeriesData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: barDemos.stackedHorizontalBarEmptyStateOptions,
				data: barDemos.stackedHorizontalBarEmptyStateData,
				chartType: chartTypes.StackedBarChart,
			},
			{
				options: barDemos.stackedHorizontalBarSkeletonOptions,
				data: barDemos.stackedHorizontalBarSkeletonData,
				chartType: chartTypes.StackedBarChart,
			},
		],
	},
	{
		title: 'Boxplot',
		demos: [
			{
				options: boxplotDemos.simpleBoxplotOptions,
				data: boxplotDemos.simpleBoxplotData,
				chartType: chartTypes.BoxplotChart,
				mainDemo: true,
			},
			{
				options: boxplotDemos.simpleVerticalBoxplotOptions,
				data: boxplotDemos.simpleVerticalBoxplotData,
				chartType: chartTypes.BoxplotChart,
			},
		],
	},
	{
		title: 'Bubble',
		description:
			'Bubble charts use data points and bubbles to plot measures anywhere along a scale. One measure is plotted along each axis. The size of the bubble represents the third measure. You can use bubble charts to represent financial data or any data where measured values are related.',
		demos: [
			{
				options: bubbleDemos.bubbleDoubleLinearOptions,
				data: bubbleDemos.bubbleDoubleLinearData,
				chartType: chartTypes.BubbleChart,
				mainDemo: true,
			},
			{
				options: bubbleDemos.bubbleTimeSeriesOptions,
				data: bubbleDemos.bubbleTimeSeriesData,
				chartType: chartTypes.BubbleChart,
			},
			{
				options: bubbleDemos.bubbleDiscreteOptions,
				data: bubbleDemos.bubbleDiscreteData,
				chartType: chartTypes.BubbleChart,
			},
			{
				options: bubbleDemos.bubbleDualDiscreteOptions,
				data: bubbleDemos.bubbleDualDiscreteData,
				chartType: chartTypes.BubbleChart,
			},
			{
				options: bubbleDemos.bubbleEmptyStateOptions,
				data: bubbleDemos.bubbleEmptyStateData,
				chartType: chartTypes.BubbleChart,
			},
			{
				options: bubbleDemos.bubbleSkeletonOptions,
				data: bubbleDemos.bubbleSkeletonData,
				chartType: chartTypes.BubbleChart,
			},
		],
	},
	{
		title: 'Bullet',
		demos: [
			{
				options: bulletDemos.basicBulletOptions,
				data: bulletDemos.basicBulletData,
				chartType: chartTypes.BulletChart,
			},
		],
	},
	{
		title: 'Combo',
		demos: [
			{
				options: comboDemos.comboSimpleOptions,
				data: comboDemos.comboSimpleData,
				chartType: chartTypes.ComboChart,
			},
			{
				options: comboDemos.comboStackedOptions,
				data: comboDemos.comboStackedData,
				chartType: chartTypes.ComboChart,
			},
			{
				options: comboDemos.comboGroupedOptions,
				data: comboDemos.comboGroupedData,
				chartType: chartTypes.ComboChart,
			},
			{
				options: comboDemos.comboGroupedHorizontalOptions,
				data: comboDemos.comboGroupedHorizontalData,
				chartType: chartTypes.ComboChart,
			},
			{
				options: comboDemos.comboHorizontalOptions,
				data: comboDemos.comboHorizontalData,
				chartType: chartTypes.ComboChart,
			},
			{
				options: comboDemos.comboAreaLineOptions,
				data: comboDemos.comboAreaLineData,
				chartType: chartTypes.ComboChart,
			},
			{
				options: comboDemos.comboStackedAreaLineOptions,
				data: comboDemos.comboStackedAreaLine,
				chartType: chartTypes.ComboChart,
			},
			{
				options: comboDemos.comboLineScatterOptions,
				data: comboDemos.comboLineScatterData,
				chartType: chartTypes.ComboChart,
			},
			{
				options: comboDemos.comboAreaLineTimeSeriesOptions,
				data: comboDemos.comboAreaLineTimeSeriesData,
				chartType: chartTypes.ComboChart,
				mainDemo: true,
			},
			{
				options: comboDemos.comboEmptyOptions,
				data: comboDemos.comboEmptyData,
				chartType: chartTypes.ComboChart,
			},
			{
				options: comboDemos.comboLoadingOptions,
				data: comboDemos.comboLoadingData,
				chartType: chartTypes.ComboChart,
			},
		],
	},
	{
		title: 'Donut',
		demos: [
			{
				options: donutDemos.donutOptions,
				data: donutDemos.donutData,
				chartType: chartTypes.DonutChart,
				mainDemo: true,
			},
			{
				options: donutDemos.donutCenteredOptions,
				data: donutDemos.donutCenteredData,
				chartType: chartTypes.DonutChart,
			},
			{
				options: donutDemos.donutEmptyStateOptions,
				data: donutDemos.donutEmptyStateData,
				chartType: chartTypes.DonutChart,
			},
			{
				options: donutDemos.donutSkeletonOptions,
				data: donutDemos.donutSkeletonData,
				chartType: chartTypes.DonutChart,
			},
		],
	},
	{
		title: 'Gauge',
		demos: [
			{
				options: gaugeDemos.gaugeOptionsSemi,
				data: gaugeDemos.gaugeData,
				chartType: chartTypes.GaugeChart,
				mainDemo: true,
			},
			{
				options: gaugeDemos.gaugeOptionsCircular,
				data: gaugeDemos.gaugeData,
				chartType: chartTypes.GaugeChart,
			},
			{
				options: gaugeDemos.gaugeOptionsCircularNoDelta,
				data: gaugeDemos.gaugeDataNoDelta,
				chartType: chartTypes.GaugeChart,
			},
		],
	},
	{
		title: 'Line',
		description:
			'Line charts plot data at regular intervals connected by lines. You can use line visualizations to show trends over time and compare several data sets.',
		demos: [
			{
				options: lineDemos.lineOptions,
				data: lineDemos.lineData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineTimeSeriesOptions,
				data: lineDemos.lineTimeSeriesData,
				chartType: chartTypes.LineChart,
				mainDemo: true,
			},
			{
				options: lineDemos.lineTimeSeriesDenseOptions,
				data: lineDemos.lineTimeSeriesDenseData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.dualLine,
				data: lineDemos.lineTimeSeriesDualAxesData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineEmptyStateOptions,
				data: lineDemos.lineEmptyStateData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineSkeletonOptions,
				data: lineDemos.lineSkeletonData,
				chartType: chartTypes.LineChart,
			},
		],
	},
	{
		title: 'Lollipop',
		demos: [
			{
				options: lollipopDemos.lollipopDiscreteOptions,
				data: lollipopDemos.lollipopDiscreteData,
				chartType: chartTypes.LollipopChart,
			},
			{
				options: lollipopDemos.lollipopDiscretePresentationOptions,
				data: lollipopDemos.lollipopDiscretePresentationData,
				chartType: chartTypes.LollipopChart,
				mainDemo: true,
			},
		],
	},
	{
		title: 'Pie',
		demos: [
			{
				options: pieDemos.pieOptions,
				data: pieDemos.pieData,
				chartType: chartTypes.PieChart,
				mainDemo: true,
			},
			{
				options: pieDemos.pieCenteredOptions,
				data: pieDemos.pieCenteredData,
				chartType: chartTypes.PieChart,
			},
			{
				options: pieDemos.pieEmptyStateOptions,
				data: pieDemos.pieEmptyStateData,
				chartType: chartTypes.PieChart,
			},
			{
				options: pieDemos.pieSkeletonOptions,
				data: pieDemos.pieSkeletonData,
				chartType: chartTypes.PieChart,
			},
		],
	},
	{
		title: 'Meter',
		demos: [
			{
				options: meterDemos.meterOptionsWithStatus,
				data: meterDemos.meterData,
				chartType: chartTypes.MeterChart,
				mainDemo: true,
			},
			{
				options: meterDemos.meterOptionsCustomColor,
				data: meterDemos.meterData,
				chartType: chartTypes.MeterChart,
			},
			{
				options: meterDemos.meterOptionsNoStatus,
				data: meterDemos.meterData,
				chartType: chartTypes.MeterChart,
			},
		],
	},
	{
		title: 'Meter (proportional)',
		demos: [
			{
				options: meterDemos.propMeterOptions,
				data: meterDemos.propMeterData,
				chartType: chartTypes.MeterChart,
			},
			{
				options: meterDemos.propMeterTruncationOptions,
				data: meterDemos.propMeterData,
				chartType: chartTypes.MeterChart,
			},
		],
	},
	{
		title: 'Radar',
		demos: [
			{
				data: radarDemos.radarData,
				options: radarDemos.radarOptions,
				chartType: chartTypes.RadarChart,
				mainDemo: true,
			},
			{
				data: radarDemos.radarCenteredData,
				options: radarDemos.radarCenteredOptions,
				chartType: chartTypes.RadarChart,
			},
			{
				data: radarDemos.radarWithMissingDataData,
				options: radarDemos.radarWithMissingDataOptions,
				chartType: chartTypes.RadarChart,
			},
			{
				data: radarDemos.radarDenseData,
				options: radarDemos.radarDenseOptions,
				chartType: chartTypes.RadarChart,
			},
		],
	},
	{
		title: 'Scatter',
		description:
			'Scatter plot visualizations use data points to plot two measures anywhere along a scale, not only at regular tick marks. You can use scatter plots to explore correlations between different measures.',
		demos: [
			{
				options: scatterDemos.doubleLinearScatterOptions,
				data: scatterDemos.doubleLinearScatterData,
				chartType: chartTypes.ScatterChart,
			},
			{
				options: scatterDemos.scatterTimeSeriesOptions,
				data: scatterDemos.scatterTimeSeriesData,
				chartType: chartTypes.ScatterChart,
				mainDemo: true,
			},
			{
				options: scatterDemos.scatterDiscreteOptions,
				data: scatterDemos.scatterDiscreteData,
				chartType: chartTypes.ScatterChart,
			},
			{
				options: scatterDemos.scatterDualAxesOptions,
				data: scatterDemos.scatterDualAxesData,
				chartType: chartTypes.ScatterChart,
			},
			{
				options: scatterDemos.scatterEmptyStateOptions,
				data: scatterDemos.scatterEmptyStateData,
				chartType: chartTypes.ScatterChart,
			},
			{
				options: scatterDemos.scatterSkeletonOptions,
				data: scatterDemos.scatterSkeletonData,
				chartType: chartTypes.ScatterChart,
			},
		],
	},
	{
		title: 'Sparkline',
		demos: [
			{
				options: areaDemos.sparklineOptions,
				data: areaDemos.sparklineTimeSeriesData,
				chartType: chartTypes.AreaChart,
				mainDemo: true,
			},
			{
				options: lineDemos.sparklineLoadingOptions,
				data: lineDemos.lineSkeletonData,
				chartType: chartTypes.LineChart,
			},
		],
	},
	{
		title: 'Step',
		description:
			'Stepped line charts plot data at regular intervals, forming a series of steps between data points. You can use line visualizations to show trends over time and compare several data sets.',
		demos: [
			{
				options: stepDemos.stepOptions,
				data: stepDemos.stepData,
				chartType: chartTypes.LineChart,
			},
			{
				options: stepDemos.stepTimeSeriesOptions,
				data: stepDemos.stepTimeSeriesData,
				chartType: chartTypes.LineChart,
				mainDemo: true,
			},
			{
				options: stepDemos.stepEmptyStateOptions,
				data: stepDemos.stepEmptyStateData,
				chartType: chartTypes.LineChart,
			},
			{
				options: stepDemos.stepSkeletonOptions,
				data: stepDemos.stepSkeletonData,
				chartType: chartTypes.LineChart,
			},
		],
	},
	{
		title: 'Word Cloud',
		demos: [
			{
				options: wordCloudDemos.wordCloudOptions,
				data: wordCloudDemos.wordCloudData,
				chartType: chartTypes.WordCloudChart,
				mainDemo: true,
			},
		],
	},
].map((demoGroup: any) => {
	demoGroup.type = DemoGroupTypes.SIMPLE_CHART;

	return demoGroup;
});

const complexChartDemos = [
	{
		title: 'Treemap',
		demos: [
			{
				data: treemapDemos.treemapData,
				options: treemapDemos.treemapOptions,
				chartType: chartTypes.TreemapChart,
			},
		],
	},
	{
		title: 'Circle Pack',
		demos: [
			{
				data: circlePackDemos.circlePackSingleLevelData,
				options: circlePackDemos.circlePackSingleOptions,
				chartType: chartTypes.CirclePackChart,
			},
			{
				data: circlePackDemos.circlePackTwoLevelData,
				options: circlePackDemos.circlePackTwoLevelOptions,
				chartType: chartTypes.CirclePackChart,
			},
			{
				data: circlePackDemos.circlePackThreeLevelData,
				options: circlePackDemos.circlePackThreeLevelOptions,
				chartType: chartTypes.CirclePackChart,
				mainDemo: true,
			},
			{
				data: circlePackDemos.circlePackThreeLevelsMonochromeData,
				options: circlePackDemos.circlePackThreeLevelsMonochromeOptions,
				chartType: chartTypes.CirclePackChart,
			},
			{
				data: circlePackDemos.circlePackThreeLevelData,
				options: circlePackDemos.circlePackThreeLevelNoZoomOptions,
				chartType: chartTypes.CirclePackChart,
			},
		],
	},
].map((demoGroup: any) => {
	demoGroup.type = DemoGroupTypes.COMPLEX_CHART;

	return demoGroup;
});

let allDemoGroups = utilityDemoGroups
	.concat(simpleChartDemos)
	.concat(complexChartDemos);

const devOnlyDemoGroups = [
	{
		title: 'High scale tests (DEV)',
		demos: [
			{
				options: highScaleDemos.zoomBarHighScaleLineTimeSeriesOptions,
				data: [],
				isHighScale: true,
				chartType: chartTypes.LineChart,
			},
		],
	},
] as any;

const formatTitleString = (str) =>
	str
		.replace(/[^\w\s]/gi, '')
		.replace(/\s\s+/g, ' ')
		.toLowerCase()
		.replace(/\s+/g, '-');

const mapDemoGroups = (demoGroups) =>
	demoGroups
		.sort((a, b) => b.title - a.title)
		.map((demoGroup) => {
			if (demoGroup.type === DemoGroupTypes.SIMPLE_CHART) {
				demoGroup.storyGroupTitle = 'Simple charts';
			} else if (demoGroup.type === DemoGroupTypes.COMPLEX_CHART) {
				demoGroup.storyGroupTitle = 'Complex charts';
			} else {
				demoGroup.storyGroupTitle = 'Utility';
			}

			demoGroup.demos = demoGroup.demos.map((demo) => {
				demo.title = demo.options.title;
				demo.id = `${formatTitleString(
					demoGroup.title
				)}--${formatTitleString(demo.options.title)}`;

				// if there isnt a height set in the chart options, use 400
				demo.options.height = demo.options.height ?? '400px';

				if (!demo.codesandbox) {
					demo.codesandbox = {};
				}
				demo.codesandbox.react = createChartSandbox(
					createReactChartApp(demo)
				);
				demo.codesandbox.vue = createChartSandbox(
					createVueChartApp(demo)
				);
				demo.codesandbox.vanilla = createChartSandbox(
					createVanillaChartApp(demo)
				);
				demo.codesandbox.svelte = createChartSandbox(
					createSvelteChartApp(demo)
				);

				if (!demo.code) {
					demo.code = {};
				}
				demo.code.angular = createAngularChartApp(demo);

				return demo;
			});

			return demoGroup;
		});
// add codesandbox and code to demos
allDemoGroups = mapDemoGroups(allDemoGroups);

// Only add the high-scale testcases in dev
if (process.env.NODE_ENV !== 'production') {
	allDemoGroups = allDemoGroups.concat(mapDemoGroups(devOnlyDemoGroups));
}

// in the storybook we want to show all the demos
export const storybookDemoGroups = allDemoGroups;
