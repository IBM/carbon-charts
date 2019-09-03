// Internal Imports
import { Component } from "../component";

// D3 Imports
import { select } from "d3-selection";

export class Scatter extends Component {
	type = "scatter";

	legendListenersApplied = false;

	render() {
		const svg = this.getContainerSVG();

		const dotGroups = svg.selectAll("g.dots")
			.data(this._model.getDisplayData().datasets, dataset => dataset.label);

		const dotGroupsEnter = dotGroups.enter()
			.append("g")
				.classed("dots", true);

		const dots = dotGroupsEnter.merge(dotGroups)
			.selectAll("circle.dot")
			.data((d, i) => this.addLabelsToDataPoints(d, i));

		const dotsEnter = dots.enter()
			.append("circle")
			.attr("opacity", 0);

		dotsEnter.merge(dots)
			.raise()
			.classed("dot", true)
			.classed("filled", this.options.filled)
			.attr("cx", (d, i) => this._services.axes.getXValue(d, i))
			.transition(this._services.transitions.getDefaultTransition("scatter-update-enter"))
			.attr("cy", (d, i) => this._services.axes.getYValue(d, i))
			.attr("r", 4)
			.attr("fill", d => {
				if (this.options.filled) {
					return "#f3f3f3";
				} else {
					return this._model.getFillScale()[d.datasetLabel](d.label) as any;
				}
			})
			.attr("fill-opacity", this.options.filled ? 1 : 0.2)
			.attr("stroke", d => this._model.getStrokeColor(d.datasetLabel, d.label, d.value))
			.attr("opacity", 1);

		dotGroups.exit()
			.attr("opacity", 0)
			.remove();

		// Add event listeners to elements drawn
		this.addEventListeners();
	}

	addLabelsToDataPoints(d, index) {
		const { labels } = this._model.getDisplayData();

		return d.data.map((datum, i) => ({
			label: datum.key || labels[i],
			datasetLabel: d.label,
			value: isNaN(datum) ? datum.value : datum
		}));
	}

	addEventListeners() {
		const self = this;
		this._parent.selectAll("circle")
			.on("mouseover", function() {
				const hoveredElement = select(this);
				hoveredElement.classed("hovered", true);

				if (self.options.filled) {
					hoveredElement.style("fill", (d: any) => self._model.getFillScale()[d.datasetLabel](d.label));
				}

				// Show tooltip
				self._services.events.dispatchEvent("show-tooltip", {
					hoveredElement
				});
			})
			.on("mouseout", function() {
				const hoveredElement = select(this);
				hoveredElement.classed("hovered", false);

				if (self.options.filled) {
					hoveredElement.style("fill", null);
				}

				// Hide tooltip
				self._services.events.dispatchEvent("hide-tooltip", {
					hoveredElement
				});
			});

		if (!this.legendListenersApplied) {
			// Highlight correct circle on legend item hovers
			this._services.events.getDocumentFragment().addEventListener("legend-item-onhover", e => {
				const { hoveredElement } = e.detail;

				self._parent.selectAll("circle.dot")
					.transition(this._services.transitions.getDefaultTransition("legend-hover-scatter"))
					.attr("opacity", d => {
						if (d.datasetLabel !== hoveredElement.datum()["key"]) {
							return 0.3;
						}

						return 1;
					});
			});

			// Un-highlight circles on legend item mouseouts
			this._services.events.getDocumentFragment().addEventListener("legend-item-onmouseout", e => {
				this._parent.selectAll("circle.dot")
					.transition(this._services.transitions.getDefaultTransition("legend-mouseout-scatter"))
					.attr("opacity", 1);
			});

			this.legendListenersApplied = true;
		}
	}
}
