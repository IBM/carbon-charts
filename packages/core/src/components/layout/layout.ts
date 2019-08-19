// Internal Imports
import { Component } from "../component";
import { LayoutOptions, LayoutDirection, LayoutGrowth, LayoutComponentChild } from "../../interfaces/index";
import { Tools } from "../../tools";

// D3 Imports
import { select } from "d3-selection";
import { hierarchy, treemap, treemapSlice, treemapDice } from "d3-hierarchy";


// TODORF - Remove
const testColors = ["e41a1c", "377eb8", "4daf4a", "984ea3", "ff7f00", "ffff33", "a65628", "f781bf", "999999"];
window["testColors"] = Tools.clone(testColors);
window["ccount"] = 0;
export class LayoutComponent extends Component {
	// Give every layout component a distinct ID
	// so they don't interfere when querying elements
	static instanceCount = 0;

	children: Array<LayoutComponentChild>;
	options: LayoutOptions;

	private _instanceCount: number;

	private _renderCallbacks = [];
	private _renderCallback: Function;

	constructor(children: Array<LayoutComponentChild>, options?: LayoutOptions) {
		super();

		this.options = options;
		this.children = children;

		this._instanceCount = LayoutComponent.instanceCount++;
	}

	getPrefferedAndFixedSizeSum(): number {
		const svg = this._parent;
		let sum = 0;

		svg.selectAll(`svg.layout-child-${this._instanceCount}`)
			.filter((d: any) => {
				const growth = Tools.getProperty(d, "data", "growth", "x");
				return growth === LayoutGrowth.PREFERRED || growth === LayoutGrowth.FIXED;
			})
			.each(function(d: any) {
				sum += d.data.size;
			});

		return sum;
	}

	getNumOfStretchChildren(): number {
		const svg = this._parent;

		return svg.selectAll(`svg.layout-child-${this._instanceCount}`)
			.filter((d: any) => {
				const growth = Tools.getProperty(d, "data", "growth", "x");
				return growth === LayoutGrowth.STRETCH;
			})
			.size();
	}

	render() {
		const self = this;

		// Get parent SVG to render inside of
		const svg = this._parent;
		const { width, height } = this._services.domUtils.getSVGElementSize(svg, true);

		// Pass children data to the hierarchy layout
		// And calculate sum of sizes
		const directionIsReversed = (this.options.direction === LayoutDirection.ROW_REVERSE) ||
			(this.options.direction === LayoutDirection.COLUMN_REVERSE);
		const hierarchyChildren = directionIsReversed ? this.children.reverse() : this.children;
		let root = hierarchy({
			children: hierarchyChildren
		})
			.sum((d: any) => d.size);

		// Grab the correct treemap tile function based on direction
		const tileType = (this.options.direction === LayoutDirection.ROW || this.options.direction === LayoutDirection.ROW_REVERSE)
			? treemapDice : treemapSlice;

		// Compute the position of all elements within the layout
		treemap()
			.tile(tileType)
			.size([width, height])
			(root);

		// TODORF - Remove
		const horizontal = (this.options.direction === LayoutDirection.ROW || this.options.direction === LayoutDirection.ROW_REVERSE);

		// Add new SVGs to the DOM for each layout child
		const updatedSVGs = svg.selectAll(`svg.layout-child-${this._instanceCount}`)
			.data(root.leaves(), (d: any) => d.data.id);

		const enteringSVGs = updatedSVGs
			.enter()
			.append("svg")
				.attr("class", (d: any) => `layout-child layout-child-${this._instanceCount} ${+new Date()} ${d.data.id}`)
				.attr("x", (d: any) => d.x0)
				.attr("y", (d: any) => d.y0)
				.attr("width", (d: any) => d.x1 - d.x0)
				.attr("height", (d: any) => d.y1 - d.y0);

		enteringSVGs.merge(svg.selectAll(`svg.layout-child-${this._instanceCount}`))
			.each(function(d: any) {
				// Set parent component for each child
				d.data.components.forEach(itemComponent => {
					itemComponent.setParent(select(this));

					if (d.data.syncWith) {
						const layoutComponent = window[`lc-${d.data.syncWith}`];

						const elToMatch = select(self._services.domUtils.getMainSVG()).select(`svg.graph-frame`);

						if (layoutComponent && !self._renderCallback) {
							self._renderCallback = self.renderCallback.bind(self, elToMatch, this, itemComponent);
						} else {
							itemComponent.render();
						}
					}

					// Render preffered & fixed items
					const growth = Tools.getProperty(d, "data", "growth", "x");
					if (growth === LayoutGrowth.PREFERRED || growth === LayoutGrowth.FIXED) {
						itemComponent.render();
						// console.log("RENDER", ++window["ccount"]);
					}
				});
			});

		svg.selectAll(`svg.layout-child-${this._instanceCount}`)
		.each(function(d: any) {
			// Calculate preffered children sizes after internal rendering
			const growth = Tools.getProperty(d, "data", "growth", "x");

			if (growth === LayoutGrowth.PREFERRED) {
				const matchingSVGWidth = horizontal ?
					self._services.domUtils.getSVGElementSize(select(this)).width :
					self._services.domUtils.getSVGElementSize(select(this)).height;
				const svgWidth = horizontal ?
					(svg.node() as any).clientWidth || svg.attr("width") :
					(svg.node() as any).clientHeight || svg.attr("height");

				d.data.size = (matchingSVGWidth / svgWidth) * 100;
			}
		});

		updatedSVGs
			.exit()
			.each(function() { console.log("REMOVING#$3@$2", this); })
			.remove();

		// Run through stretch x-items
		this.children
			.filter(child => {
				const growth = Tools.getProperty(child, "growth", "x");
				return growth === LayoutGrowth.STRETCH;
			})
			.forEach((child, i) => {
				child.size = (100 - (+this.getPrefferedAndFixedSizeSum())) / (+this.getNumOfStretchChildren());
			});

		setTimeout(() => {
			// Pass children data to the hierarchy layout
			// And calculate sum of sizes
			root = hierarchy({
				children: hierarchyChildren
			})
			.sum((d: any) => d.size);

			// Compute the position of all elements within the layout
			treemap()
				.tile(tileType)
				.size([width, height])
				.padding(0)
				(root);

			// Add new SVGs to the DOM for each layout child
			svg
				.selectAll(`svg.layout-child-${this._instanceCount}`)
				.data(root.leaves(), (d: any) => d.data.id)
				.attr("x", (d: any) => d.x0)
				.attr("y", (d: any) => d.y0)
				.attr("width", (d: any) => d.x1 - d.x0)
				.attr("height", (d: any) => d.y1 - d.y0)
				.each(function(d: any, i) {
					d.data.components.forEach(itemComponent => {
						const growth = Tools.getProperty(d, "data", "growth", "x");
						if (growth === LayoutGrowth.STRETCH) {
							itemComponent.render();
							// console.log("RENDER", ++window["ccount"]);
						}
					});

					// const bgRect = self._services.domUtils.appendOrSelect(select(this), "rect.bg");
					// bgRect
					// 	.classed("bg", true)
					// 	.attr("width", "100%")
					// 	.attr("height", "100%")
					// 	.lower();

					// if (!bgRect.attr("fill")) {
					// 	bgRect.attr("fill-opacity", 0.2)
					// 	.attr("fill", d => {
					// 		if (window["testColors"].length === 0) {
					// 			window["testColors"] = Tools.clone(testColors);
					// 		}

					// 		const col = window["testColors"].shift();

					// 		return `#${col}`;
					// 	})
					// }
				});

			if (this._renderCallback) {
				this._renderCallback();
			}
		}, 0);
	}

	// Pass on model to children as well
	setModel(newObj) {
		super.setModel(newObj);

		this.children.forEach(child => {
			child.components.forEach(component => component.setModel(newObj));

			window[`lc-${child.id}`] = this;
		});
	}

	// Pass on essentials to children as well
	setServices(newObj) {
		super.setServices(newObj);

		this.children.forEach(child => {
			child.components.map(component => component.setServices(newObj));
		});
	}

	renderCallback(elToMatch: any, svg: any, itemComponent: any) {
		if (!elToMatch.empty()) {
			select(svg)
				.attr("x", elToMatch.attr("x"))
				.attr("width", elToMatch.attr("width"));

			itemComponent.render();
			// console.log("RENDER", ++window["ccount"]);
		}
	}

	addRenderCallback(cb: Function) {
		if (this._renderCallbacks.indexOf(cb) === -1) {
			this._renderCallbacks.push(cb);
		} else {
			console.log("CALLBACK NOT ADDED");
		}
	}
}
