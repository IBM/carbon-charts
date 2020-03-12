import { Chart } from "../chart";
import { Map } from "../components/index"
import { ChartModel } from "../model";
import { Tools } from "../tools";
import { options } from "../configuration";
import { TooltipBar } from "../components/index";

export class MapChart extends Chart {
  model = new ChartModel(this.services);

  constructor(holder: Element, chartConfigs: any) {
    super(holder, chartConfigs);

    this.model.setOptions(
      Tools.merge(
        Tools.clone(options.mapChart), 
        chartConfigs.options
      )
    )

    // Initialize data, services, components etc.
		this.init(holder, chartConfigs);
  }

  getComponents() {
    const graphFrameComponents = [
      new Map(this.model, this.services)
    ];

    const components: any[] = this.getChartComponents(graphFrameComponents);
    components.push(new TooltipBar(this.model, this.services));
    return components;
  }
}
