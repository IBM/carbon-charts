import React from "react";

import { HistogramChart as HC } from "@carbon/charts";
import BaseChart from "./base-chart";

export default class HistogramChart extends BaseChart {
	componentDidMount() {
		this.chart = new HC(
			this.chartRef,
			{
				data: this.props.data,
				options: this.props.options
			}
		);
	}

	render() {
		return (
			<div
				ref={chartRef => this.chartRef = chartRef}
				className="chart-holder">
			</div>
		);
	}
}
