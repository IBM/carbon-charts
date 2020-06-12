// Internal Imports
import { PieChart } from "./pie";
import * as Configuration from "../configuration";
import { ChartConfig, PieChartOptions } from "../interfaces/index";
import { Tools } from "../tools";
import { Skeletons } from "../interfaces/enums";

// Components
import {
	Donut,
	// the imports below are needed because of typescript bug (error TS4029)
	Legend,
	LayoutComponent,
	Skeleton,
	TooltipPie
} from "../components/index";

export class DonutChart extends PieChart {
	constructor(holder: Element, chartConfigs: ChartConfig<PieChartOptions>) {
		super(holder, chartConfigs, true);

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

	getComponents() {
		// Specify what to render inside the graph-frame
		const graphFrameComponents = [
			new Donut(this.model, this.services),
			new Skeleton(this.model, this.services, {
				skeleton: Skeletons.DONUT
			})
		];

		const components: any[] = this.getChartComponents(graphFrameComponents);
		components.push(new TooltipPie(this.model, this.services));
		return components;
	}
}
