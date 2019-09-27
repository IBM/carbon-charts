import {
	Component,
	AfterViewInit
} from "@angular/core";

import { BaseChart } from "./base-chart.component";

import { LineChart } from "@carbon/charts";

/**
 * Wrapper around `LineChart` in carbon charts library
 *
 * Most functions just call their equivalent from the chart library.
 */
@Component({
	selector: "n-line-chart",
	template: `
		<div #nChart class="n-chart-container">
		</div>
	`
})
export class LineChartComponent extends BaseChart implements AfterViewInit {
	/**
	 * Runs after view init to create a chart, attach it to `chartRef` and draw it.
	 */
	ngAfterViewInit() {
		this.chart = new LineChart(
			this.chartRef.nativeElement,
			{
				data: this.data,
				options: this.options
			}
		);

		Object.assign(this, this.chart);
	}
}
