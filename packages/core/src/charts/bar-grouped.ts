// Internal Imports
import { AxisChart } from "../axis-chart";
import * as Configuration from "../configuration";
import { BarChartOptions, ChartConfig } from "../interfaces/index";
import { Tools } from "../tools";
import { Skeletons } from "../interfaces/enums";

// Components
import {
	Grid,
	GroupedBar,
	TwoDimensionalAxes,
	ZeroLine,
	TooltipBar,
	// the imports below are needed because of typescript bug (error TS4029)
	Tooltip,
	Legend,
	LayoutComponent,
	Skeleton
} from "../components/index";

export class GroupedBarChart extends AxisChart {
	constructor(holder: Element, chartConfigs: ChartConfig<BarChartOptions>) {
		super(holder, chartConfigs);

		// Merge the default options for this chart
		// With the user provided options
		this.model.setOptions(
			Tools.mergeDefaultChartOptions(
				Configuration.options.groupedBarChart,
				chartConfigs.options
			)
		);

		// Initialize data, services, components etc.
		this.init(holder, chartConfigs);
	}

	getComponents() {
		// Specify what to render inside the graph-frame
		const graphFrameComponents = [
			new TwoDimensionalAxes(this.model, this.services),
			new Grid(this.model, this.services),
			new GroupedBar(this.model, this.services),
			new ZeroLine(this.model, this.services),
			new Skeleton(this.model, this.services, {
				skeleton: Skeletons.VERT_OR_HORIZ
			})
		];

		const components: any[] = this.getAxisChartComponents(
			graphFrameComponents
		);
		components.push(new TooltipBar(this.model, this.services));
		return components;
	}
}
