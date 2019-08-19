import { Chart } from "../chart";

import * as Charts from "../index";
import { createChartHolder } from "./tools";

export const data = {
	labels: ["Qty", "More", "Sold", "Restocking", "Misc"],
	datasets: [
		{
			label: "Dataset 1",
			backgroundColors: [Charts.defaultColors[0]],
			data: [
				2000,
				4200,
				7000,
				4000,
				19000
			]
		},
		{
			label: "Dataset 2",
			backgroundColors: [Charts.defaultColors[1]],
			data: [
				0,
				10000,
				20000,
				30000,
				40000
			]
		},
		{
			label: "Dataset 3",
			backgroundColors: [Charts.defaultColors[2]],
			data: [
				0,
				20000,
				40000,
				60000,
				80000
			]
		}
	]
};

export const options = {
	// animations: false,
	accessibility: false,
	axes: {
		bottom: {
			title: "2018 Annual Sales Figures",
			type: "labels",
			primary: true
		},
		left: {
			secondary: true
		},
		y: {
			title: "Dollars (CAD)"
		}
	},
	legendClickable: true,
	containerResizable: true,
	height: 500
};

export class TestEnvironment {
	chartOptions = options;
	chartData: any;
	chart: Chart;

	render() {
		const holder = createChartHolder("scatter");

		this.chart = new Charts.ScatterChart(
			holder,
			{
				data: data,
				options: this.chartOptions
			}
		);
	}

	setChartOptions(func: Function) {
		this.chartOptions = func(this.chartOptions);
	}

	getChartReference() {
		return this.chart;
	}
}
