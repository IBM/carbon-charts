import * as areaDemos from './area';
import * as barDemos from './bar';
import * as boxplotDemos from './boxplot';
import * as bubbleDemos from './bubble';
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
import * as toolbarDemos from './toolbar';
import * as wordCloudDemos from './wordcloud';
import * as zoomBarDemos from './zoom-bar';
import * as highScaleDemos from './high-scale';

export * from './area';
export * from './bar';
export * from './boxplot';
export * from './bubble';
export * from './combo';
export * from './donut';
export * from './gauge';
export * from './line';
export * from './meter';
export * from './pie';
export * from './radar';
export * from './scatter';
export * from './step';
export * from './treemap';
export * from './wordcloud';

import {
	createChartSandbox,
	createReactChartApp,
	createAngularChartApp,
	createVueChartApp,
	createVanillaChartApp,
	createSvelteChartApp,
} from '../create-codesandbox';

import { Tools } from '@carbon/charts/tools';

export const chartTypes = {
	AreaChart: {
		vanilla: 'AreaChart',
		angular: 'ibm-area-chart',
		vue: 'ccv-area-chart',
	},
	BoxplotChart: {
		vanilla: 'BoxplotChart',
		angular: 'ibm-boxplot-chart',
		vue: 'ccv-boxplot-chart',
	},
	BubbleChart: {
		vanilla: 'BubbleChart',
		angular: 'ibm-bubble-chart',
		vue: 'ccv-bubble-chart',
	},
	ComboChart: {
		vanilla: 'ComboChart',
		angular: 'ibm-combo-chart',
		vue: 'ccv-combo-chart',
	},
	DonutChart: {
		vanilla: 'DonutChart',
		angular: 'ibm-donut-chart',
		vue: 'ccv-donut-chart',
	},
	GaugeChart: {
		vanilla: 'GaugeChart',
		angular: 'ibm-gauge-chart',
		vue: 'ccv-gauge-chart',
	},
	GroupedBarChart: {
		vanilla: 'GroupedBarChart',
		angular: 'ibm-grouped-bar-chart',
		vue: 'ccv-grouped-bar-chart',
	},
	LineChart: {
		vanilla: 'LineChart',
		angular: 'ibm-line-chart',
		vue: 'ccv-line-chart',
	},
	LollipopChart: {
		vanilla: 'LollipopChart',
		angular: 'ibm-lollipop-chart',
		vue: 'ccv-lollipop-chart',
	},
	MeterChart: {
		vanilla: 'MeterChart',
		angular: 'ibm-meter-chart',
		vue: 'ccv-meter-chart',
	},
	PieChart: {
		vanilla: 'PieChart',
		angular: 'ibm-pie-chart',
		vue: 'ccv-pie-chart',
	},
	RadarChart: {
		vanilla: 'RadarChart',
		angular: 'ibm-radar-chart',
		vue: 'ccv-radar-chart',
	},
	ScatterChart: {
		vanilla: 'ScatterChart',
		angular: 'ibm-scatter-chart',
		vue: 'ccv-scatter-chart',
	},
	SimpleBarChart: {
		vanilla: 'SimpleBarChart',
		angular: 'ibm-simple-bar-chart',
		vue: 'ccv-simple-bar-chart',
	},
	StackedAreaChart: {
		vanilla: 'StackedAreaChart',
		angular: 'ibm-stacked-area-chart',
		vue: 'ccv-stacked-area-chart',
	},
	StackedBarChart: {
		vanilla: 'StackedBarChart',
		angular: 'ibm-stacked-bar-chart',
		vue: 'ccv-stacked-bar-chart',
	},
	TreemapChart: {
		vanilla: 'TreemapChart',
		angular: 'ibm-treemap-chart',
		vue: 'ccv-treemap-chart',
	},
	WordCloudChart: {
		vanilla: 'WordCloudChart',
		angular: 'ibm-wordcloud-chart',
		vue: 'ccv-wordcloud-chart',
	},
};

let allDemoGroups = [
	{
		title: 'Area',
		description:
			'Area charts are similar to line charts, but the areas below the lines are filled with colors or patterns. Stacked charts are useful for comparing proportional contributions within a category. They plot the relative value that each data series contributes to the total.',
		demos: [
			{
				options: areaDemos.areaTimeSeriesCurvedOptions,
				data: areaDemos.areaTimeSeriesCurvedData,
				chartType: chartTypes.AreaChart,
			},
			{
				options: areaDemos.areaTimeSeriesOptions,
				data: areaDemos.areaTimeSeriesData,
				chartType: chartTypes.AreaChart,
				isDemoExample: false,
			},
			{
				options: areaDemos.areaDiscreteDomainOptions,
				data: areaDemos.areaDiscreteDomain,
				chartType: chartTypes.AreaChart,
			},
			{
				options: areaDemos.stackedAreaTimeSeriesOptions,
				data: areaDemos.stackedAreaTimeSeriesData,
				chartType: chartTypes.StackedAreaChart,
				isDemoExample: true,
			},
			{
				options: areaDemos.stackedAreaTimeSeriesUnevenDataOptions,
				data: areaDemos.stackedAreaTimeSeriesUnevenData,
				chartType: chartTypes.StackedAreaChart,
				isDemoExample: true,
			},
			{
				options: areaDemos.stackedAreaPercentageTimeSeriesOptions,
				data: areaDemos.stackedAreaTimeSeriesData,
				chartType: chartTypes.StackedAreaChart,
				isDemoExample: true,
			},
			{
				options: areaDemos.sparklineOptions,
				data: areaDemos.sparklineTimeSeriesData,
				chartType: chartTypes.AreaChart,
				isDemoExample: true,
			},
			{
				options: areaDemos.boundedAreaTimeSeriesOptions,
				data: areaDemos.boundedAreaTimeSeriesData,
				chartType: chartTypes.AreaChart,
				isDemoExample: true,
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
			{
				options: areaDemos.stackedAreaTimeSeriesOptions,
				data: areaDemos.stackedAreaTimeSeriesData,
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
		title: 'Bar (vertical)',
		description:
			'Bar charts use vertical or horizontal data markers to compare individual values. You can use them to compare discrete data or show trends over time.',
		demos: [
			{
				options: barDemos.simpleBarOptions,
				data: barDemos.simpleBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarColorOverrideOptions,
				data: barDemos.simpleBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarOptionsCustomTicks,
				data: barDemos.simpleBarDataCustomTicks,
				chartType: chartTypes.SimpleBarChart,
				isDemoExample: false,
			},
			{
				options: barDemos.simpleBarCustomLegendOrderOptions,
				data: barDemos.simpleBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarCenteredLegendOptions,
				data: barDemos.simpleBarCenteredLegendData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarLongLabelOptions,
				data: barDemos.simpleBarLongLabelData,
				chartType: chartTypes.SimpleBarChart,
				isDemoExample: true,
			},
			{
				options: barDemos.simpleBarFixedDomainOptions,
				data: barDemos.simpleBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarTimeSeriesDenseOptions,
				data: barDemos.simpleBarTimeSeriesDenseData,
				chartType: chartTypes.SimpleBarChart,
				isDemoExample: true,
			},
			{
				options: barDemos.simpleBarTimeSeriesOptions,
				data: barDemos.simpleBarTimeSeriesData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleBarEmptyStateOptions,
				data: barDemos.simpleBarEmptyStateData,
				chartType: chartTypes.SimpleBarChart,
				isDemoExample: false,
			},
			{
				options: barDemos.simpleBarSkeletonOptions,
				data: barDemos.simpleBarSkeletonData,
				chartType: chartTypes.SimpleBarChart,
				isDemoExample: false,
			},
			{
				description:
					'A grouped bar chart, also known as a clustered bar graph, multi-set bar chart, or grouped column chart, is a type of bar graph that is used to compare values across multiple categories.',
				options: barDemos.groupedBarOptions,
				data: barDemos.groupedBarData,
				chartType: chartTypes.GroupedBarChart,
			},
			{
				options: barDemos.groupedBarSelectedGroupsOptions,
				data: barDemos.groupedBarSelectedGroupsData,
				chartType: chartTypes.GroupedBarChart,
			},
			{
				options: barDemos.groupedBarEmptyStateOptions,
				data: barDemos.groupedBarEmptyStateData,
				chartType: chartTypes.GroupedBarChart,
				isDemoExample: false,
			},
			{
				options: barDemos.groupedBarSkeletonOptions,
				data: barDemos.groupedBarSkeletonData,
				chartType: chartTypes.GroupedBarChart,
				isDemoExample: false,
			},
			{
				description:
					'Stacked bar charts are useful for comparing proportional contributions within a category. They plot the relative value that each data series contributes to the total.',
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
				options: barDemos.stackedBarTimeSeriesOptionsCustomTicks,
				data: barDemos.stackedBarTimeSeriesDataCustomTicks,
				chartType: chartTypes.StackedBarChart,
				isDemoExample: false,
			},
			{
				options: barDemos.stackedBarEmptyStateOptions,
				data: barDemos.stackedBarEmptyStateData,
				chartType: chartTypes.StackedBarChart,
				isDemoExample: false,
			},
			{
				options: barDemos.stackedBarSkeletonOptions,
				data: barDemos.stackedBarSkeletonData,
				chartType: chartTypes.StackedBarChart,
				isDemoExample: false,
			},
		],
	},
	{
		title: 'Bar (horizontal)',
		demos: [
			{
				options: barDemos.simpleHorizontalBarOptions,
				data: barDemos.simpleHorizontalBarData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleHorizontalBarCenteredLegendOptions,
				data: barDemos.simpleHorizontalBarCenteredLegendData,
				chartType: chartTypes.SimpleBarChart,
			},
			{
				options: barDemos.simpleHorizontalBarLongLabelOptions,
				data: barDemos.simpleHorizontalBarLongLabelData,
				chartType: chartTypes.SimpleBarChart,
				isDemoExample: true,
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
				isDemoExample: false,
			},
			{
				options: barDemos.simpleHorizontalBarSkeletonOptions,
				data: barDemos.simpleHorizontalBarSkeletonData,
				chartType: chartTypes.SimpleBarChart,
				isDemoExample: false,
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
				isDemoExample: false,
			},
			{
				options: barDemos.groupedHorizontalBarSkeletonOptions,
				data: barDemos.groupedHorizontalBarSkeletonData,
				chartType: chartTypes.GroupedBarChart,
				isDemoExample: false,
			},
			{
				options: barDemos.stackedHorizontalBarOptions,
				data: barDemos.stackedHorizontalBarData,
				chartType: chartTypes.StackedBarChart,
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
				isDemoExample: false,
			},
			{
				options: barDemos.stackedHorizontalBarSkeletonOptions,
				data: barDemos.stackedHorizontalBarSkeletonData,
				chartType: chartTypes.StackedBarChart,
				isDemoExample: false,
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
				options: bubbleDemos.bubbleEmptyStateOptions,
				data: bubbleDemos.bubbleEmptyStateData,
				chartType: chartTypes.BubbleChart,
				isDemoExample: false,
			},
			{
				options: bubbleDemos.bubbleSkeletonOptions,
				data: bubbleDemos.bubbleSkeletonData,
				chartType: chartTypes.BubbleChart,
				isDemoExample: false,
			},
			{
				options: bubbleDemos.bubbleDualDiscreteOptions,
				data: bubbleDemos.bubbleDualDiscreteData,
				chartType: chartTypes.BubbleChart,
				isDemoExample: false,
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
				isDemoExample: true,
			},
			{
				options: comboDemos.comboStackedOptions,
				data: comboDemos.comboStackedData,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
			},
			{
				options: comboDemos.comboGroupedOptions,
				data: comboDemos.comboGroupedData,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
			},
			{
				options: comboDemos.comboGroupedHorizontalOptions,
				data: comboDemos.comboGroupedHorizontalData,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
			},
			{
				options: comboDemos.comboHorizontalOptions,
				data: comboDemos.comboHorizontalData,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
			},
			{
				options: comboDemos.comboAreaLineOptions,
				data: comboDemos.comboAreaLineData,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
			},
			{
				options: comboDemos.comboStackedAreaLineOptions,
				data: comboDemos.comboStackedAreaLine,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
			},
			{
				options: comboDemos.comboLineScatterOptions,
				data: comboDemos.comboLineScatterData,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
			},
			{
				options: comboDemos.comboAreaLineTimeSeriesOptions,
				data: comboDemos.comboAreaLineTimeSeriesData,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
			},
			{
				options: comboDemos.comboEmptyOptions,
				data: comboDemos.comboEmptyData,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
			},
			{
				options: comboDemos.comboLoadingOptions,
				data: comboDemos.comboLoadingData,
				chartType: chartTypes.ComboChart,
				isDemoExample: true,
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
				isDemoExample: false,
			},
			{
				options: donutDemos.donutSkeletonOptions,
				data: donutDemos.donutSkeletonData,
				chartType: chartTypes.DonutChart,
				isDemoExample: false,
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
				isDemoExample: true,
			},
			{
				options: gaugeDemos.gaugeOptionsCircular,
				data: gaugeDemos.gaugeData,
				chartType: chartTypes.GaugeChart,
				isDemoExample: true,
			},
			{
				options: gaugeDemos.gaugeOptionsCircularNoDelta,
				data: gaugeDemos.gaugeDataNoDelta,
				chartType: chartTypes.GaugeChart,
				isDemoExample: true,
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
				options: lineDemos.lineCustomColorOptions,
				data: lineDemos.lineData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineCenteredLegendOptions,
				data: lineDemos.lineCenteredLegendData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineLongLabelOptions,
				data: lineDemos.lineLongLabelData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineCustomDomainOptions,
				data: lineDemos.lineData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineSelectedGroupsOptions,
				data: lineDemos.lineSelectedGroupsData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineTimeSeriesOptions,
				data: lineDemos.lineTimeSeriesData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineTimeSeriesCustomDomainOptions,
				data: lineDemos.lineTimeSeriesData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineTimeSeriesDenseOptions,
				data: lineDemos.lineTimeSeriesDenseData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineTimeSeriesRotatedTicksOptions,
				data: lineDemos.lineTimeSeriesDataRotatedTicks,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: lineDemos.lineHorizontalOptions,
				data: lineDemos.lineData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: lineDemos.lineTimeSeriesHorizontalOptions,
				data: lineDemos.lineTimeSeriesData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: lineDemos.lineTimeSeriesWithThresholdsOptions,
				data: lineDemos.lineTimeSeriesData,
				chartType: chartTypes.LineChart,
			},
			{
				options: lineDemos.lineEmptyStateOptions,
				data: lineDemos.lineEmptyStateData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: lineDemos.lineSkeletonOptions,
				data: lineDemos.lineSkeletonData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: lineDemos.dualLine,
				data: lineDemos.lineTimeSeriesDualAxesData,
				chartType: chartTypes.LineChart,
				isDemoExample: true,
			},
			{
				options: lineDemos.sparklineLoadingOptions,
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
				isDemoExample: false,
			},
			{
				options: pieDemos.pieSkeletonOptions,
				data: pieDemos.pieSkeletonData,
				chartType: chartTypes.PieChart,
				isDemoExample: false,
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
				isDemoExample: true,
			},
			{
				options: meterDemos.meterOptionsCustomColor,
				data: meterDemos.meterData,
				chartType: chartTypes.MeterChart,
				isDemoExample: true,
			},
			{
				options: meterDemos.meterOptionsNoStatus,
				data: meterDemos.meterData,
				chartType: chartTypes.MeterChart,
				isDemoExample: true,
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
			},
			{
				options: scatterDemos.scatterDiscreteOptions,
				data: scatterDemos.scatterDiscreteData,
				chartType: chartTypes.ScatterChart,
			},
			{
				options: scatterDemos.scatterLongLabelDiscreteOptions,
				data: scatterDemos.scatterLongLabelDiscreteData,
				chartType: chartTypes.ScatterChart,
			},
			{
				options: scatterDemos.scatterEmptyStateOptions,
				data: scatterDemos.scatterEmptyStateData,
				chartType: chartTypes.ScatterChart,
				isDemoExample: false,
			},
			{
				options: scatterDemos.scatterSkeletonOptions,
				data: scatterDemos.scatterSkeletonData,
				chartType: chartTypes.ScatterChart,
				isDemoExample: false,
			},
			{
				options: scatterDemos.scatterDualAxesOptions,
				data: scatterDemos.scatterDualAxesData,
				chartType: chartTypes.ScatterChart,
				isDemoExample: false,
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
			},
			{
				options: stepDemos.stepEmptyStateOptions,
				data: stepDemos.stepEmptyStateData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: stepDemos.stepSkeletonOptions,
				data: stepDemos.stepSkeletonData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
		],
	},
	{
		title: 'Time series axis',
		demos: [
			{
				options: timeSeriesAxisDemos.lineTimeSeries15secondsOptions,
				data: timeSeriesAxisDemos.lineTimeSeriesData15seconds,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: timeSeriesAxisDemos.lineTimeSeriesMinuteOptions,
				data: timeSeriesAxisDemos.lineTimeSeriesDataMinute,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: timeSeriesAxisDemos.lineTimeSeries30minutesOptions,
				data: timeSeriesAxisDemos.lineTimeSeriesData30minutes,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options:
					timeSeriesAxisDemos.lineTimeSeriesHourlyDefaultLocaleOptions,
				data:
					timeSeriesAxisDemos.lineTimeSeriesDataHourlyDefaultTicksFormats,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options:
					timeSeriesAxisDemos.lineTimeSeriesHourlyCustomTicksFormatsOptions,
				data:
					timeSeriesAxisDemos.lineTimeSeriesDataHourlyCustomTicksFormats,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataDaily,
				options: timeSeriesAxisDemos.lineTimeSeriesDailyOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataWeekly,
				options: timeSeriesAxisDemos.lineTimeSeriesWeeklyOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data:
					timeSeriesAxisDemos.lineTimeSeriesDataMonthlyDefaultLocale,
				options:
					timeSeriesAxisDemos.lineTimeSeriesMonthlyDefaultLocaleOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataMonthlyCustomLocale,
				options:
					timeSeriesAxisDemos.lineTimeSeriesMonthlyCustomLocaleOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataQuarterly,
				options: timeSeriesAxisDemos.lineTimeSeriesQuarterlyOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataYearly,
				options: timeSeriesAxisDemos.lineTimeSeriesYearlyOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataSingleDatum,
				options: timeSeriesAxisDemos.lineTimeSeriesSingleDatumOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesNoExtendedDomainData,
				options:
					timeSeriesAxisDemos.lineTimeSeriesNoExtendedDomainOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data: timeSeriesAxisDemos.lineTimeSeriesDataTwoIdenticalLabels,
				options:
					timeSeriesAxisDemos.lineTimeSeriesTwoIdenticalLabelsOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				data:
					timeSeriesAxisDemos.lineTimeSeriesDataAllLabelsInPrimaryFormat,
				options:
					timeSeriesAxisDemos.lineTimeSeriesAllLabelsInPrimaryFormatOptions,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
		],
	},
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
		title: 'Toolbar (alpha)',
		demos: [
			{
				options: toolbarDemos.toolbarStackedBarTimeSeriesOptions,
				data: toolbarDemos.toolbarStackedBarTimeSeriesData,
				chartType: chartTypes.StackedBarChart,
				isDemoExample: false,
			},
			{
				options: toolbarDemos.toolbarLineTimeSeriesOptions,
				data: toolbarDemos.toolbarLineTimeSeriesData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
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
			},
		],
	},
	{
		title: 'Zoom bar (alpha)',
		demos: [
			{
				options: zoomBarDemos.zoomBarStackedAreaTimeSeriesOptions,
				data: zoomBarDemos.zoomBarStackedAreaTimeSeriesData,
				chartType: chartTypes.StackedAreaChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarSimpleBarTimeSeriesOptions,
				data: zoomBarDemos.zoomBarSimpleBarTimeSeriesData,
				chartType: chartTypes.SimpleBarChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarStackedBarTimeSeriesOptions,
				data: zoomBarDemos.zoomBarStackedBarTimeSeriesData,
				chartType: chartTypes.StackedBarChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.definedZoomBarStackedBarTimeSeriesOptions,
				data: zoomBarDemos.definedZoomBarStackedBarTimeSeriesData,
				chartType: chartTypes.StackedBarChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarBubbleTimeSeriesOptions,
				data: zoomBarDemos.zoomBarBubbleTimeSeriesData,
				chartType: chartTypes.BubbleChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarLineTimeSeriesOptions,
				data: zoomBarDemos.zoomBarLineTimeSeriesData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarScatterTimeSeriesOptions,
				data: zoomBarDemos.zoomBarScatterTimeSeriesData,
				chartType: chartTypes.ScatterChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarStepTimeSeriesOptions,
				data: zoomBarDemos.zoomBarStepTimeSeriesData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarLineTimeSeries15secondsOptions,
				data: zoomBarDemos.zoomBarLineTimeSeries15secondsData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarLineTimeSeriesInitDomainOptions,
				data: zoomBarDemos.zoomBarLineTimeSeriesInitDomainData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarStringDateOptions,
				data: zoomBarDemos.zoomBarStringDateData,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarAreaCanvasOptions,
				data: zoomBarDemos.zoomBarAreaCanvasData,
				chartType: chartTypes.AreaChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarLockedOptions,
				data: zoomBarDemos.zoomBarLockedData,
				chartType: chartTypes.StackedBarChart,
				isDemoExample: false,
			},
			{
				options: zoomBarDemos.zoomBarSkeletonOptions,
				data: zoomBarDemos.zoomBarSkeletonData,
				chartType: chartTypes.StackedBarChart,
				isDemoExample: false,
			},
		],
	},
] as any;

const devOnlyDemoGroups = [
	{
		title: 'High scale tests (DEV)',
		demos: [
			{
				options: highScaleDemos.zoomBarHighScaleLineTimeSeriesOptions,
				data: [],
				isHighScale: true,
				chartType: chartTypes.LineChart,
				isDemoExample: false,
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
	demoGroups.map((demoGroup) => {
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
			demo.codesandbox.vue = createChartSandbox(createVueChartApp(demo));
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

// in the demo page we want to show only demos with isDemoExample = true
export const demoGroups = Tools.clone(allDemoGroups)
	// remove demoGroup if its children don't have any demo examples
	.filter(
		(demoGroup) =>
			demoGroup.demos.filter((demo) => demo.isDemoExample !== false)
				.length > 0
	)
	.map((demoGroup) => {
		demoGroup.demos = demoGroup.demos.filter(
			(demo) => demo.isDemoExample !== false
		);
		return demoGroup;
	});
