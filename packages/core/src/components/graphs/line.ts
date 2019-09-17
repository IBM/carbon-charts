// Internal Imports
import { Component } from "../component";

// D3 Imports
import { select } from "d3-selection";
import { line } from "d3-shape";

export class Line extends Component {
	type = "line";

	lineGenerator: any;

	init() {
		// Highlight correct scatter on legend item hovers
		this.services.events.getDocumentFragment().addEventListener("legend-item-onhover", e => {
			const { hoveredElement } = e.detail;

			this.parent.selectAll("g.lines")
				.transition(this.services.transitions.getTransition("legend-hover-line"))
				.attr("opacity", d => {
					if (d.label !== hoveredElement.datum()["key"]) {
						return 0.3;
					}

					return 1;
				});
		});

		// Un-highlight lines on legend item mouseouts
		this.services.events.getDocumentFragment().addEventListener("legend-item-onmouseout", e => {
			this.parent.selectAll("g.lines")
				.transition(this.services.transitions.getTransition("legend-mouseout-line"))
				.attr("opacity", 1);
		});
	}

	render(animate = true) {
		const svg = this.getContainerSVG();

		// D3 line generator function
		this.lineGenerator = line()
			.x((d, i) => this.services.axes.getXValue(d, i))
			.y((d, i) => this.services.axes.getYValue(d, i))
			.curve(this.services.curves.getD3Curve());

		const lineGroups = svg.selectAll("g.lines")
			.data(this.model.getDisplayData().datasets, dataset => dataset.label);

		const enteringLineGroups = lineGroups.enter()
			.append("g")
			.classed("lines", true);

		const self = this;

		const enteringPaths = enteringLineGroups.append("path")
			.attr("opacity", 0);

		enteringPaths.merge(svg.selectAll("g.lines path"))
			.attr("stroke", function (d) {
				const parentDatum = select(this.parentNode).datum() as any;

				return self.model.getStrokeColor(parentDatum.label);
			})
			.datum(function (d) {
				const parentDatum = select(this.parentNode).datum() as any;
				this._datasetLabel = parentDatum.label;

				return parentDatum.data;
			})
			.transition(this.services.transitions.getTransition("line-update-enter", animate))
			.attr("opacity", 1)
			.attr("class", "line")
			.attr("d", this.lineGenerator);

		lineGroups.exit()
			.attr("opacity", 0)
			.remove();
	}
}
