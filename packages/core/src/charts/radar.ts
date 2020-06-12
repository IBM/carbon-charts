// Internal Imports
import { Chart } from "../chart";
import * as Configuration from "../configuration";
import { ChartConfig, RadarChartOptions } from "../interfaces/index";
import { Tools } from "../tools";

// Components
import {
	// the imports below are needed because of typescript bug (error TS4029)
	Legend,
	LayoutComponent,
	TooltipRadar
} from "../components/index";
import { Radar } from "../components/graphs/radar";

export class RadarChart extends Chart {
	// TODO - Optimize the use of "extending"
	constructor(
		holder: Element,
		chartConfigs: ChartConfig<RadarChartOptions>,
		extending = false
	) {
		super(holder, chartConfigs);

		// TODO - Optimize the use of "extending"
		if (extending) {
			return;
		}

		// Merge the default options for this chart
		// With the user provided options
		this.model.setOptions(
			Tools.mergeDefaultChartOptions(
				Configuration.options.radarChart,
				chartConfigs.options
			)
		);

		// Initialize data, services, components etc.
		this.init(holder, chartConfigs);
	}

	getComponents() {
		// Specify what to render inside the graph-frame
		const graphFrameComponents = [new Radar(this.model, this.services)];

		// get the base chart components and export with tooltip
		const components: any[] = this.getChartComponents(graphFrameComponents);
		components.push(new TooltipRadar(this.model, this.services));
		return components;
	}
}
