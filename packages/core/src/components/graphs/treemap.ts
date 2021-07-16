// Internal Imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import { Events, ColorClassNameTypes, RenderTypes } from '../../interfaces';
import { Tools } from '../../tools';

// D3 Imports
import { hierarchy as d3Hierarchy, treemap as d3Treemap } from 'd3-hierarchy';
import { sum } from 'd3-array';
import { hsl, color } from 'd3-color';
import { select } from 'd3-selection';

// Carbon colors
import { colors } from '@carbon/colors';

const findColorShade = (hex) => {
	if (!hex) {
		return null;
	}

	for (let colorName of Object.keys(colors)) {
		const colorShades = colors[colorName];

		for (let colorShadeLevel of Object.keys(colorShades)) {
			const colorShade = colorShades[colorShadeLevel];

			if (colorShade === hex) {
				return colorShadeLevel;
			}
		}
	}

	return null;
};

const textFillColor = function () {
	const correspondingLeaf = select(this.parentNode).select(
		'rect.leaf'
	) as any;
	const correspondingLeafFill = getComputedStyle(
		correspondingLeaf.node(),
		null
	).getPropertyValue('fill');
	const cl = color(correspondingLeafFill) as any;

	let colorShade;
	if (cl) {
		colorShade = findColorShade(cl ? cl.hex() : null);
	}

	if (colorShade === null || colorShade === undefined) {
		const lightness = hsl(cl).l;
		colorShade = Math.abs(lightness * 100 - 100);
	}

	return colorShade > 50 ? 'white' : 'black';
};

let uidCounter = 0;
export class Treemap extends Component {
	type = 'treemap';
	renderType = RenderTypes.SVG;

	init() {
		const { events } = this.services;
		// Highlight correct circle on legend item hovers
		events.addEventListener(
			Events.Legend.ITEM_HOVER,
			this.handleLegendOnHover
		);
		// Un-highlight circles on legend item mouseouts
		events.addEventListener(
			Events.Legend.ITEM_MOUSEOUT,
			this.handleLegendMouseOut
		);
	}

	render(animate = true) {
		const svg = this.getComponentContainer();

		const allData = this.model.getData();
		const displayData = this.model.getDisplayData();
		const options = this.model.getOptions();

		const windowLocation = Tools.getProperty(window, 'location');

		const { width, height } = DOMUtils.getSVGElementSize(svg, {
			useAttrs: true,
		});

		const hierarchy = d3Hierarchy({
			name: options.title || 'Treemap',
			children: displayData,
		})
			.sum((d: any) => d.value)
			.sort((a, b) => b.value - a.value);

		const total = sum(allData, (d: any) =>
			sum(d.children, (child: any) => child.value)
		);

		const root = d3Treemap()
			.size([width, height])
			.paddingInner(1)
			.paddingOuter(0)
			.round(true)(hierarchy);
		const { transitions } = this.services;

		const leafGroups = svg
			.selectAll("g[data-name='leaf']")
			.data(root.leaves(), (leaf) => leaf.data.name);

		// Remove leaf groups that need to be removed
		leafGroups.exit().attr('opacity', 0).remove();

		// Add the leaf groups that need to be introduced
		const enteringLeafGroups = leafGroups
			.enter()
			.append('g')
			.attr('data-name', 'leaf')
			.attr('data-uid', () => uidCounter++);

		const allLeafGroups = enteringLeafGroups.merge(leafGroups);

		allLeafGroups
			.attr('data-name', 'leaf')
			.transition(
				transitions.getTransition('treemap-group-update', animate)
			)
			.attr('transform', (d) => `translate(${d.x0},${d.y0})`);

		const rects = allLeafGroups.selectAll('rect.leaf').data((d) => [d]);

		rects.exit().attr('width', 0).attr('height', 0).remove();

		const enteringRects = rects
			.enter()
			.append('rect')
			.classed('leaf', true);

		enteringRects
			.merge(rects)
			.attr('width', 0)
			.attr('height', 0)
			.attr('id', function () {
				const uid = select(this.parentNode).attr('data-uid');
				return `${options.style.prefix}-leaf-${uid}`;
			})
			.attr('class', (d) => {
				while (d.depth > 1) d = d.parent;

				return this.model.getColorClassName({
					classNameTypes: [ColorClassNameTypes.FILL],
					dataGroupName: d.data.name,
					originalClassName: 'leaf',
				});
			})
			.transition(
				this.services.transitions.getTransition(
					'treemap-leaf-update-enter',
					animate
				)
			)
			.attr('width', (d) => d.x1 - d.x0)
			.attr('height', (d) => d.y1 - d.y0)
			.style('fill', (d) => {
				while (d.depth > 1) d = d.parent;
				return this.model.getFillColor(d.data.name);
			});

		// Update all clip paths
		allLeafGroups
			.selectAll('clipPath')
			.data(
				(d) => {
					if (d.data.showLabel !== true) {
						return [];
					}

					return [1];
				},
				(d) => d
			)
			.join(
				(enter) => {
					enter
						.append('clipPath')
						.attr('id', function () {
							const uid = select(this.parentNode).attr(
								'data-uid'
							);
							return `${options.style.prefix}-clip-${uid}`;
						})
						.append('use')
						.attr('xlink:href', function () {
							const uid = select(this.parentNode.parentNode).attr(
								'data-uid'
							);
							const leafID = `${options.style.prefix}-leaf-${uid}`;

							return new URL(`#${leafID}`, windowLocation) + '';
						});
				},
				(update) => null,
				(exit) => exit.remove()
			);

		// Update all titles
		allLeafGroups
			.selectAll('text')
			.data(
				(d) => {
					if (d.data.showLabel !== true) {
						return [];
					}

					let parent = d;
					while (parent.depth > 1) parent = parent.parent;
					const color = hsl(
						this.model.getFillColor(parent.data.name)
					);
					return [
						{
							text: d.data.name,
							color: color.l < 0.5 ? 'white' : 'black',
						},
					];
				},
				(d) => d
			)
			.join(
				(enter) => {
					const addedText = enter
						.append('text')
						.text((d) => d.text)
						.style('fill', textFillColor)
						.attr('x', 7)
						.attr('y', 18);

					if (windowLocation) {
						addedText.attr('clip-path', function () {
							const uid = select(this.parentNode).attr(
								'data-uid'
							);
							const clipPathID = `${options.style.prefix}-clip-${uid}`;

							return `url(${
								new URL(`#${clipPathID}`, windowLocation) + ''
							})`;
						});
					}
				},
				(update) =>
					update.text((d) => d.text).style('fill', textFillColor),
				(exit) => exit.remove()
			);

		// Add event listeners to elements drawn
		this.addEventListeners();
	}

	addEventListeners() {
		const self = this;
		this.parent
			.selectAll('rect.leaf')
			.on('mouseover', function (event, datum) {
				const hoveredElement = select(this);
				let fillColor = getComputedStyle(this, null).getPropertyValue(
					'fill'
				);

				let parent = datum;
				while (parent.depth > 1) parent = parent.parent;

				hoveredElement
					.transition(
						self.services.transitions.getTransition(
							'graph_element_mouseover_fill_update'
						)
					)
					.style('fill', (d: any) => {
						const customColor = self.model.getFillColor(
							d.parent.data.name
						);
						if (customColor) {
							fillColor = customColor;
						}
						return color(fillColor).darker(0.7).toString();
					});

				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					items: [
						{
							color: fillColor,
							label: parent.data.name,
							bold: true,
						},
						{
							label: datum.data.name,
							value: datum.data.value,
						},
					],
				});

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Treemap.LEAF_MOUSEOVER,
					{
						element: hoveredElement,
						datum,
					}
				);
			})
			.on('mousemove', function (event, datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Treemap.LEAF_MOUSEMOVE,
					{
						element: hoveredElement,
						datum,
					}
				);

				self.services.events.dispatchEvent(Events.Tooltip.MOVE);
			})
			.on('click', function (event, datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Treemap.LEAF_CLICK, {
					element: select(this),
					datum,
				});
			})
			.on('mouseout', function (event, datum) {
				const hoveredElement = select(this);
				hoveredElement.classed('hovered', false);

				let parent = datum;
				while (parent.depth > 1) parent = parent.parent;

				hoveredElement
					.transition(
						self.services.transitions.getTransition(
							'graph_element_mouseout_fill_update'
						)
					)
					.style('fill', (d: any) =>
						self.model.getFillColor(d.parent.data.name)
					);

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Treemap.LEAF_MOUSEOUT,
					{
						element: hoveredElement,
						datum,
					}
				);

				// Hide tooltip
				self.services.events.dispatchEvent(Events.Tooltip.HIDE, {
					hoveredElement,
				});
			});
	}

	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;

		this.parent
			.selectAll("g[data-name='leaf']")
			.transition(
				this.services.transitions.getTransition('legend-hover-treemap')
			)
			.attr('opacity', (d) =>
				d.parent.data.name === hoveredElement.datum()['name'] ? 1 : 0.3
			);
	};

	handleLegendMouseOut = (event: CustomEvent) => {
		this.parent
			.selectAll("g[data-name='leaf']")
			.transition(
				this.services.transitions.getTransition(
					'legend-mouseout-treemap'
				)
			)
			.attr('opacity', 1);
	};
}
