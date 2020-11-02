// Internal imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import { Tools } from "../../tools";

// D3 imports
import { color } from "d3-color";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import { scaleLinear } from "d3-scale";

const data = {
	nodes: [
		{ name: "Worm", category: "worm" },
		{ name: "Windows 7", category: "windows7" },
		{ name: "Virus", category: "virus" },
		{ name: "CVE-2017", category: "cve2017" },
		{ name: "Windows 8", category: "windows8" },
		{ name: "CVE-2011", category: "cve2011" }
	],
	links: [
		{
			source: "Worm",
			target: "Windows 7",
			value: 191
		},
		{
			source: "Virus",
			target: "Windows 7",
			value: 105
		},
		{
			source: "Worm",
			target: "CVE-2017",
			value: 105
		},
		{
			source: "Windows 7",
			target: "CVE-2017",
			value: 207
		},
		{
			source: "Virus",
			target: "CVE-2011",
			value: 207
		},
		{
			source: "Virus",
			target: "Windows 8",
			value: 207
		},
		{
			source: "Windows 8",
			target: "CVE-2011",
			value: 207
		},
		{
			source: "Windows 7",
			target: "CVE-2011",
			value: 207
		}
	],
	units: "TWh"
};

const totalValue = data.links.reduce((accum, currentValue) => accum + currentValue.value, 0);

const colorScale = scaleLinear()
	.domain(data.nodes.map((node, i) => i) as any)
	.range(["#9669d6", "#4c7bdc"] as any);

export class Alluvial extends Component {
	type = "alluvial";

	render(animate = true) {
		const self = this;

		const svg = DOMUtils.appendOrSelect(this.getContainerSVG(), "g.center");
		const options = this.model.getOptions();

		const { width, height } = DOMUtils.getSVGElementSize(this.parent, {
			useAttrs: true
		});

		const sankey = d3Sankey()
			.nodeId((d) => d.name)
			// .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
			.nodeWidth(15)
			.nodePadding(10)
			.extent([
				[1, 5],
				[width - 1, height - 5]
			]);
		const { nodes, links } = sankey({
			nodes: data.nodes.map((d) => Object.assign({}, d)),
			links: data.links.map((d) => Object.assign({}, d))
		});

		// const { nodes, links } = sankey(data);
		const edgeColor = "none";

		svg.html("");

		svg.append("g")
			.attr("stroke", "#000")
			.selectAll("rect")
			.data(nodes)
			.join("rect")
			.attr("x", (d) => d.x0)
			.attr("y", (d) => d.y0)
			.attr("height", (d) => d.y1 - d.y0)
			.attr("width", (d) => d.x1 - d.x0)
			.attr("fill", "black")
			.append("title")
			.text((d) => `${d.name}\n${d.value}`);

		const link = svg
			.append("g")
			.attr("fill", "none")
			// .attr("stroke-opacity", 0.5)
			.selectAll("g")
			.data(links)
			.join("g")
			.style("mix-blend-mode", "multiply");
		// if (edgeColor === "path") {
		// 	const gradient = link
		// 		.append("linearGradient")
		// 		.attr("id", (d) => (d.uid = DOM.uid("link")).id)
		// 		.attr("gradientUnits", "userSpaceOnUse")
		// 		.attr("x1", (d) => d.source.x1)
		// 		.attr("x2", (d) => d.target.x0);

		// 	gradient
		// 		.append("stop")
		// 		.attr("offset", "0%")
		// 		.attr("stop-color", (d) => color(d.source));

		// 	gradient
		// 		.append("stop")
		// 		.attr("offset", "100%")
		// 		.attr("stop-color", (d) => color(d.target));
		// }

		link.append("path")
			.attr("d", sankeyLinkHorizontal())
			.attr("stroke", (d) => {
				console.log("Stroke", color);
				return colorScale(d.source.index);
				// edgeColor === "none"
				// 	? "red"
				// 	: edgeColor === "path"
				// 	? d.uid
				// 	: edgeColor === "input"
				// 	? color(d.source)
				// 	: color(d.target);
			})
			.attr("stroke-width", (d) => Math.max(1, d.width));

		link.append("title").text(
			(d) => `${d.source.name} → ${d.target.name}\n${d.value}`
		);

		svg.append("g")
			.selectAll("rect")
			.data(nodes)
			.join("rect")
			.attr("x", (d) => {
				if (d.x0 < width / 2) {
					return (d.x0 < width / 2 ? d.x1 + 6 : d.x0) - 5;
				}

				return (d.x0 < width / 2 ? d.x1 + 6 : d.x0) - 142.5;
			})
			.attr("width", d => Math.max(Math.min(d.name.length, 6), 5) / 4 * 100)
			.attr("y", (d) => (d.y1 + d.y0) / 2 - 10)
			.attr("height", 20)
			.attr("stroke", "black")
			.attr("stroke-width", 2);

		svg.append("g")
			.attr("font-size", 12)
			.selectAll("text")
			.data(nodes)
			.join("text")
			.attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
			.attr("y", (d) => (d.y1 + d.y0) / 2)
			.attr("dy", "0.35em")
			.attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
			.text((d) => {
				return `${d.name} - (${d.value} / ${Math.floor(d.value / totalValue * 100)}%)`;
			})
			.attr("fill", "white");
	}
}
