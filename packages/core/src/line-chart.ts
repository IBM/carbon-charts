// D3 Imports
import { select, mouse } from "d3-selection";
import { line } from "d3-shape";

import { BaseAxisChart } from "./base-axis-chart";
import * as Configuration from "./configuration";

import { getD3Curve } from "./services/curves";
import { ScatterChart } from "./scatter-chart";

export class LineChart extends ScatterChart {
	lineGenerator: any;

	constructor(holder: Element, configs: any) {
		super(holder, configs);

		this.options.type = "line";
	}

	draw() {
		this.innerWrap.style("width", "100%")
			.style("height", "100%");

		const { line: margins } = Configuration.charts.margin;
		const { scales } = this.options;

		const chartSize = this.getChartSize();
		const width = chartSize.width - margins.left - margins.right;
		const height = chartSize.height - this.getBBox(".x.axis").height;

		this.innerWrap.style("width", "100%")
			.style("height", "100%");

		this.innerWrap.attr("transform", `translate(${margins.left}, ${margins.top})`);

		let curveName;
		let curveOptions;
		this.options.curve = this.options.curve || "curveLinear";
		if (typeof this.options.curve === "string") { // curve: 'string'
			curveName = this.options.curve;
			curveOptions = {};
		} else { // curve: { name: 'string' }
			curveName = this.options.curve.name || "curveLinear";
			curveOptions = this.options.curve;
			delete curveOptions["name"];
		}

		// D3 line generator function
		this.lineGenerator = line()
			.x((d, i) => this.x(this.displayData.labels[i]) + margins.left)
			.y((d: any) => this.y(d))
			.curve(getD3Curve(curveName, curveOptions));

		const gLines = this.innerWrap.selectAll("g.lines")
			.data(this.displayData.datasets)
			.enter()
				.append("g")
				.classed("lines", true);

		gLines.append("path")
			.attr("stroke", d => this.colorScale[d.label]())
			.datum(d => d.data)
			.attr("class", "line")
			.attr("d", this.lineGenerator);

		super.draw();
	}

	interpolateValues(newData: any) {
		const { line: margins } = Configuration.charts.margin;
		const chartSize = this.getChartSize();
		const width = chartSize.width - margins.left - margins.right;
		const height = chartSize.height - this.getBBox(".x.axis").height;

		// Apply new data to the lines
		const gLines = this.innerWrap.selectAll("g.lines")
			.data(newData.datasets);

		this.updateElements(true, gLines);

		// Add lines that need to be added now
		const addedLineGroups = gLines.enter()
			.append("g")
			.classed("lines", true);

		addedLineGroups.append("path")
			.attr("stroke", d => this.colorScale[d.label]())
			.datum(d => d.data)
			.style("opacity", 0)
			.transition(this.getDefaultTransition())
			.style("opacity", 1)
			.attr("class", "line")
			.attr("d", this.lineGenerator);

		// Remove lines that are no longer needed
		gLines.exit()
			.transition(this.getDefaultTransition())
			.style("opacity", 0)
			.remove();

		super.interpolateValues(newData);
	}

	updateElements(animate: boolean, gLines?: any) {
		const { scales } = this.options;

		const chartSize = this.getChartSize();
		const height = chartSize.height - this.getBBox(".x.axis").height;

		if (!gLines) {
			gLines = this.innerWrap.selectAll("g.lines");
		}

		const transitionToUse = animate ? this.getFillTransition() : this.getInstantTransition();
		const self = this;
		gLines.selectAll("path.line")
			.datum(function(d) {
				const parentDatum = select(this.parentNode).datum() as any;

				return parentDatum.data;
			})
			.transition(transitionToUse)
			.attr("stroke", function(d) {
				const parentDatum = select(this.parentNode).datum() as any;

				return self.colorScale[parentDatum.label]();
			})
			.attr("class", "line")
			.attr("d", this.lineGenerator);

		super.updateElements(animate, null);
	}

	resizeChart() {
		super.resizeChart();
	}
}
