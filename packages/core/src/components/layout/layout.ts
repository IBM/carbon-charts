// Internal Imports
import { Component } from "../component";
import {
	LayoutDirection,
	LayoutGrowth,
	LayoutComponentChild,
	LayoutConfigs
} from "../../interfaces/index";
import { Tools } from "../../tools";
import { DOMUtils } from "../../services";
import { ChartModel } from "../../model";

// D3 Imports
import { select } from "d3-selection";
import { hierarchy, treemap, treemapSlice, treemapDice } from "d3-hierarchy";

// TODO - What if there is no "growth" object?
export class LayoutComponent extends Component {
	// Give every layout component a distinct ID
	// so they don't interfere when querying elements
	static instanceID = Math.floor(Math.random() * 99999999999);

	type = "layout";

	children: LayoutComponentChild[];

	private _instanceID: number;

	constructor(
		model: ChartModel,
		services: any,
		children: LayoutComponentChild[],
		configs?: LayoutConfigs
	) {
		super(model, services, configs);

		this.configs = configs;
		this.children = children;

		this._instanceID = LayoutComponent.instanceID++;

		// Pass children data to the hierarchy layout
		// And calculate sum of sizes
		const directionIsReversed =
			this.configs.direction === LayoutDirection.ROW_REVERSE ||
			this.configs.direction === LayoutDirection.COLUMN_REVERSE;
		if (directionIsReversed) {
			this.children = this.children.reverse();
		}
		this.init();
	}

	init() {
		this.children.forEach((child) => {
			child.components.forEach((component) => {
				component.init();
			});
		});
	}

	getPreferedAndFixedSizeSum(): number {
		const svg = this.parent;
		let sum = 0;

		svg.selectAll(`svg.layout-child-${this._instanceID}`)
			.filter((d: any) => {
				const growth = Tools.getProperty(d, "data", "growth", "x");
				return (
					growth === LayoutGrowth.PREFERRED ||
					growth === LayoutGrowth.FIXED
				);
			})
			.each(function (d: any) {
				sum += d.data.size;
			});

		return sum;
	}

	getNumOfStretchChildren(): number {
		const svg = this.parent;

		return svg
			.selectAll(`svg.layout-child-${this._instanceID}`)
			.filter((d: any) => {
				const growth = Tools.getProperty(d, "data", "growth", "x");
				return growth === LayoutGrowth.STRETCH;
			})
			.size();
	}

	render(animate = true) {
		// Get parent SVG to render inside of
		const svg = this.parent;
		const { width, height } = DOMUtils.getSVGElementSize(svg, {
			useAttrs: true
		});

		let root = hierarchy({
			children: this.children
		}).sum((d: any) => d.size);

		// Grab the correct treemap tile function based on direction
		const tileType =
			this.configs.direction === LayoutDirection.ROW ||
			this.configs.direction === LayoutDirection.ROW_REVERSE
				? treemapDice
				: treemapSlice;

		// Compute the position of all elements within the layout
		treemap().tile(tileType).size([width, height])(root);

		// TODORF - Remove
		const horizontal =
			this.configs.direction === LayoutDirection.ROW ||
			this.configs.direction === LayoutDirection.ROW_REVERSE;

		// Add new SVGs to the DOM for each layout child
		const updatedSVGs = svg
			.selectAll(`svg.layout-child-${this._instanceID}`)
			.data(root.leaves(), (d: any) => d.data.id);

		updatedSVGs
			.attr("width", (d: any) => d.x1 - d.x0)
			.attr("height", (d: any) => d.y1 - d.y0);

		const enteringSVGs = updatedSVGs
			.enter()
			.append("svg")
			.attr(
				"class",
				(d: any) =>
					`layout-child layout-child-${this._instanceID} ${d.data.id}`
			)
			.attr("x", (d: any) => d.x0)
			.attr("y", (d: any) => d.y0);

		enteringSVGs
			.merge(svg.selectAll(`svg.layout-child-${this._instanceID}`))
			.each(function (d: any) {
				// Set parent component for each child
				d.data.components.forEach((itemComponent) => {
					itemComponent.setParent(select(this));

					// Render preffered & fixed items
					const growth = Tools.getProperty(d, "data", "growth", "x");
					if (
						growth === LayoutGrowth.PREFERRED ||
						growth === LayoutGrowth.FIXED
					) {
						itemComponent.render(animate);
					}
				});
			});

		svg.selectAll(`svg.layout-child-${this._instanceID}`).each(function (
			d: any
		) {
			// Calculate preffered children sizes after internal rendering
			const growth = Tools.getProperty(d, "data", "growth", "x");
			const matchingSVGDimensions = DOMUtils.getSVGElementSize(
				select(this),
				{ useBBox: true }
			);
			if (growth === LayoutGrowth.PREFERRED) {
				const matchingSVGWidth = horizontal
					? matchingSVGDimensions.width
					: matchingSVGDimensions.height;
				const svgWidth = horizontal ? width : height;

				d.data.size = (matchingSVGWidth / svgWidth) * 100;
			}
		});

		updatedSVGs.exit().remove();

		// Run through stretch x-items
		this.children
			.filter((child) => {
				const growth = Tools.getProperty(child, "growth", "x");
				return growth === LayoutGrowth.STRETCH;
			})
			.forEach((child, i) => {
				child.size =
					(100 - +this.getPreferedAndFixedSizeSum()) /
					+this.getNumOfStretchChildren();
			});

		// Pass children data to the hierarchy layout
		// And calculate sum of sizes
		root = hierarchy({
			children: this.children
		}).sum((d: any) => d.size);

		// Compute the position of all elements within the layout
		treemap().tile(tileType).size([width, height]).padding(0)(root);

		// Add new SVGs to the DOM for each layout child
		svg.selectAll(`svg.layout-child-${this._instanceID}`)
			.data(root.leaves(), (d: any) => d.data.id)
			.attr("x", (d: any) => d.x0)
			.attr("y", (d: any) => d.y0)
			.attr("width", (d: any) => d.x1 - d.x0)
			.attr("height", (d: any) => d.y1 - d.y0)
			.each(function (d: any, i) {
				d.data.components.forEach((itemComponent) => {
					const growth = Tools.getProperty(d, "data", "growth", "x");
					if (growth === LayoutGrowth.STRETCH) {
						itemComponent.render(animate);
					}
				});
			});
	}

	// Pass on model to children as well
	setModel(newObj) {
		super.setModel(newObj);

		this.children.forEach((child) => {
			child.components.forEach((component) => component.setModel(newObj));
		});
	}

	// Pass on essentials to children as well
	setServices(newObj) {
		super.setServices(newObj);

		this.children.forEach((child) => {
			child.components.forEach((component) =>
				component.setServices(newObj)
			);
		});
	}

	destroy() {
		this.children.forEach((child) => {
			child.components.forEach((component) => component.destroy());
		});
	}
}
