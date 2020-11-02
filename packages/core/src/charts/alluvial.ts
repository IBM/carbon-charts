// Internal Imports
import { Chart } from "../chart";
import * as Configuration from "../configuration";
import { ChartConfig, PieChartOptions } from "../interfaces/index";
import { Tools } from "../tools";

// Components
import {
	Alluvial,
	// the imports below are needed because of typescript bug (error TS4029)
	Legend,
	LayoutComponent,
	Skeleton
} from "../components/index";

export class AlluvialChart extends Chart {
	constructor(holder: Element, chartConfigs: ChartConfig<PieChartOptions>) {
		super(holder, chartConfigs);

		// Merge the default options for this chart
		// With the user provided options
		this.model.setOptions(
			Tools.mergeDefaultChartOptions(
				Configuration.options.donutChart,
				chartConfigs.options
			)
		);

		// Initialize data, services, components etc.
		this.init(holder, chartConfigs);
	}

	getChartComponents(graphFrameComponents: any[]) {
		return graphFrameComponents;
	}

	getComponents() {
		// Specify what to render inside the graph-frame
		const graphFrameComponents = [
			new Alluvial(this.model, this.services)
		];

		const components: any[] = this.getChartComponents(graphFrameComponents);
		return components;
	}
}
