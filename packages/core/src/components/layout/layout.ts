// Internal Imports
import { Component } from '../component';
import {
	LayoutDirection,
	LayoutGrowth,
	LayoutComponentChild,
	LayoutConfigs,
	RenderTypes,
} from '../../interfaces/index';
import { Tools } from '../../tools';
import { DOMUtils } from '../../services';
import { ChartModel } from '../../model';

// D3 Imports
import { select } from 'd3-selection';
import { hierarchy, treemap, treemapSlice, treemapDice } from 'd3-hierarchy';

// TODO - What if there is no "growth" object?
export class LayoutComponent extends Component {
	// Give every layout component a distinct ID
	// so they don't interfere when querying elements
	static instanceID = Math.floor(Math.random() * 99999999999);

	type = 'layout';

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

		svg.selectAll(`div.layout-child-${this._instanceID}`)
			.filter((d: any) => {
				const growth = Tools.getProperty(d, 'growth', 'x');

				return (
					growth === LayoutGrowth.PREFERRED ||
					growth === LayoutGrowth.FIXED
				);
			})
			.each(function (d: any) {
				sum += d.size;
			});

		return sum;
	}

	getNumOfStretchChildren(): number {
		const svg = this.parent;

		return svg
			.selectAll(`div.layout-child-${this._instanceID}`)
			.filter(
				(d: any) =>
					Tools.getProperty(d, 'growth', 'x') === LayoutGrowth.STRETCH
			)
			.size();
	}

	render(animate = true) {
		// Get parent element to render inside of
		const parent = this.parent;

		const { width, height } = DOMUtils.getHTMLElementSize(
			this.services.domUtils.getHolder()
		);

		const horizontal =
			this.configs.direction === LayoutDirection.ROW ||
			this.configs.direction === LayoutDirection.ROW_REVERSE;

		// Add new boxes to the DOM for each layout child
		const updatedBoxes = parent
			.classed('row', this.configs.direction === LayoutDirection.ROW)
			.classed(
				'row-reverse',
				this.configs.direction === LayoutDirection.ROW_REVERSE
			)
			.classed(
				'column',
				this.configs.direction === LayoutDirection.COLUMN
			)
			.classed(
				'column-reverse',
				this.configs.direction === LayoutDirection.COLUMN_REVERSE
			)
			.selectAll(`div.layout-child-${this._instanceID}`)
			.data(this.children, (d: any) => d.id);

		const enteringBoxes = updatedBoxes.enter().append('div');

		enteringBoxes
			.merge(parent.selectAll(`div.layout-child-${this._instanceID}`))
			.attr(
				'class',
				(d: any) =>
					`layout-child layout-child-${this._instanceID} ${d.id}`
			)
			.each(function (d: any) {
				// Set parent component for each child
				d.components.forEach((itemComponent) => {
					const selection = select(this);

					const renderType = Tools.getProperty(d, 'renderType');
					const isRenderingSVG = renderType === RenderTypes.SVG;
					itemComponent.setParent(
						isRenderingSVG
							? DOMUtils.appendOrSelect(
									selection,
									'svg.layout-svg-wrapper'
							  )
									.attr('width', '100%')
									.attr('height', '100%')
							: selection
					);

					// Render preffered & fixed items
					const growth = Tools.getProperty(d, 'growth', 'x');
					if (
						growth === LayoutGrowth.PREFERRED ||
						growth === LayoutGrowth.FIXED
					) {
						itemComponent.render(animate);
					}
				});
			});

		parent
			.selectAll(`div.layout-child-${this._instanceID}`)
			.style('height', null)
			.style('width', null)
			.each(function (d: any) {
				// Calculate preffered children sizes after internal rendering
				const growth = Tools.getProperty(d, 'growth', 'x');

				const renderType = Tools.getProperty(d, 'renderType');
				const matchingElementDimensions =
					renderType === RenderTypes.SVG
						? DOMUtils.getSVGElementSize(
								select(this).select('svg.layout-svg-wrapper'),
								{
									useBBox: true,
								}
						  )
						: DOMUtils.getHTMLElementSize(this);

				if (growth === LayoutGrowth.PREFERRED) {
					const matchingElementWidth = horizontal
						? matchingElementDimensions.width
						: matchingElementDimensions.height;
					const elementWidth = horizontal ? width : height;

					d.size = (matchingElementWidth / elementWidth) * 100;
				}
			});

		updatedBoxes.exit().remove();

		// Run through stretch x-items
		this.children
			.filter((child) => {
				const growth = Tools.getProperty(child, 'growth', 'x');
				return growth === LayoutGrowth.STRETCH;
			})
			.forEach((child, i) => {
				child.size =
					(100 - +this.getPreferedAndFixedSizeSum()) /
					+this.getNumOfStretchChildren();
			});

		// Update all boxes with new sizing
		const allUpdatedBoxes = parent
			.selectAll(`div.layout-child-${this._instanceID}`)
			.data(this.children, (d: any) => d.id);

		if (horizontal) {
			allUpdatedBoxes.style('width', (d) => `${d.size}%`);
		} else {
			allUpdatedBoxes.style('height', (d) => `${d.size}%`);
		}

		allUpdatedBoxes.each(function (d: any, i) {
			d.components.forEach((itemComponent) => {
				const growth = Tools.getProperty(d, 'growth', 'x');
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
