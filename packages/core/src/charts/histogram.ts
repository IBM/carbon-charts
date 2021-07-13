// Internal Imports
import { HistogramChartModel } from '../model-histogram';
import { AxisChart } from '../axis-chart';
import * as Configuration from '../configuration';
import {
	ChartConfig,
	ScatterChartOptions,
	AggregationTypes,
} from '../interfaces/index';
import { Tools } from '../tools';

// Components
import {
	Grid,
	Histogram,
	TwoDimensionalAxes,
	// the imports below are needed because of typescript bug (error TS4029)
	Tooltip,
	Legend,
	LayoutComponent,
	TooltipHistogram,
} from '../components/index';
import { histogram } from 'd3';
import { defaultBins } from '../configuration';

export class HistogramChart extends AxisChart {
	model = new HistogramChartModel(this.services);

	constructor(
		holder: Element,
		chartConfigs: ChartConfig<ScatterChartOptions>
	) {
		super(holder, chartConfigs);

		// Merge the default options for this chart
		// With the user provided options
		this.model.setOptions(
			Tools.mergeDefaultChartOptions(
				Configuration.options.histogramChart,
				chartConfigs.options
			)
		);

		// Initialize data, services, components etc.
		this.init(holder, chartConfigs);

		this.setHistogramData();

		this.update();
	}

	aggregateDataByGroup(bin, dataIdentifier, aggregation) {
		const groups = Tools.groupBy(bin, 'group');

		if (aggregation === AggregationTypes.COUNT) {
			Object.keys(groups).map((group) => {
				groups[group] = groups[group].length;
			});
		}
		if (aggregation === AggregationTypes.SUM) {
			Object.keys(groups).map((group) => {
				groups[group] = groups[group].reduce(
					(sum, datum) => sum + datum[dataIdentifier],
					0
				);
			});
		}
		if (aggregation === AggregationTypes.AVG) {
			Object.keys(groups).map((group) => {
				groups[group] =
					groups[group].reduce(
						(sum, datum) => sum + datum[dataIdentifier],
						0
					) / groups[group].length;
			});
		}

		return groups;
	}

	setHistogramData() {
		// Manipulate data and options for Histogram
		const data = this.model.getData();
		const options = this.model.getOptions();
		const mainYPos = this.services.cartesianScales.getMainYAxisPosition();
		const mainXPos = this.services.cartesianScales.getMainXAxisPosition();
		const domainIdentifier = this.services.cartesianScales.getDomainIdentifier();
		const rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();
		const axisOptions = options.axes[mainXPos];
		const { groupMapsTo } = options.data;
		const { aggregation = AggregationTypes.COUNT } = axisOptions;
		const { bins: axisBins = defaultBins } = axisOptions;
		const areBinsDefined = Array.isArray(axisBins);

		// Get Histogram bins
		const bins = histogram()
			.value((d) => d[domainIdentifier])
			.thresholds(axisBins)(data);

		if (!areBinsDefined) {
			// If bins are not defined by user
			const binsWidth = bins[0].x1 - bins[0].x0;
			// Set last bin width as the others
			bins[bins.length - 1].x1 = +bins[bins.length - 1].x0 + binsWidth;
		} else {
			// Set last bin end as the last user defined one
			bins[bins.length - 1].x1 = axisBins[axisBins.length - 1];
		}

		const binsDomain = areBinsDefined
			? [axisBins[0], axisBins[axisBins.length - 1]]
			: [bins[0].x0, bins[bins.length - 1].x1];

		// Get all groups
		const groupsKeys = Array.from(new Set(data.map((d) => d[groupMapsTo])));
		const histogramData = [];
		// Group data by bin
		bins.forEach((bin) => {
			const key = `${bin.x0}-${bin.x1}`;
			const aggregateDataByGroup = this.aggregateDataByGroup(
				bin,
				rangeIdentifier,
				aggregation
			);

			groupsKeys.forEach((group: string) => {
				// For each dataset put a bin with value 0 if not exist
				// (Scale X won't change when changing showed datasets)
				histogramData.push({
					group,
					key,
					value: aggregateDataByGroup[group] || 0,
					bin: bin.x0,
				});
			});
		});

		// Change chart axes options
		this.model.setOptions({
			...options,
			axes: {
				...options.axes,
				[mainYPos]: {
					...options.axes[mainYPos],
					// Change the range identifier as the aggregator property
					mapsTo: 'value',
				},
				[mainXPos]: {
					...options.axes[mainXPos],
					mapsTo: 'bin',
					// Change the domain as [first bin value, last bin value]
					domain: binsDomain,
				},
			},
		});

		// Set Histogram data
		this.model.setHistogramBins(bins);
		this.model.setData(histogramData);
	}

	getComponents() {
		// Specify what to render inside the graph-frame
		const graphFrameComponents = [
			new TwoDimensionalAxes(this.model, this.services),
			new Grid(this.model, this.services),
			new Histogram(this.model, this.services),
		];

		const components: any[] = this.getAxisChartComponents(
			graphFrameComponents
		);
		components.push(new TooltipHistogram(this.model, this.services));
		return components;
	}
}
