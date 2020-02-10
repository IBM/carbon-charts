// Internal Imports
import { Chart } from "@carbon/charts";
import { Map } from "../components/map";

// console.log("Chart", Chart)
// class Chart {
// 	model: any;
// 	services: any;

// 	constructor(holder: any, chartConfigs: any) {

// 	}

// 	init(holder: any, chartConfigs: any) {

// 	}
// }
// import * as Configuration from "../configuration";
// import {
// 	ChartConfig,
// 	ScatterChartOptions
// } from "../interfaces/index";
// import { Tools } from "../tools";

// // Components
// import {
// 	Grid,
// 	Line,
// 	Scatter,
// 	TwoDimensionalAxes,
// 	// the imports below are needed because of typescript bug (error TS4029)
// 	Tooltip,
// 	Legend,
// 	LayoutComponent,
// 	TooltipScatter
// } from "../components/index";

export class TiledMap extends Chart {
	constructor(holder: any, chartConfigs: any) {
		super(holder, chartConfigs);

		// // Merge the default options for this chart
		// // With the user provided options
		// this.model.setOptions(
		// 	Tools.merge(
		// 		Tools.clone(Configuration.options.scatterChart),
		// 		chartConfigs.options
		// 	)
		// );

		// Initialize data, services, components etc.
		this.init(holder, chartConfigs);
	}

	getComponents() {
		return [
			new Map(this.model, this.services)
		];
	}
}
