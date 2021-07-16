// Internal Imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import {
	Events,
	Roles,
	ColorClassNameTypes,
	RenderTypes,
	Alignments,
} from '../../interfaces';
import { Tools } from '../../tools';
import {
	Point,
	Angle,
	radialLabelPlacement,
	radToDeg,
	polarToCartesianCoords,
	distanceBetweenPointOnCircAndVerticalDiameter,
} from '../../services/angle-utils';
import * as Configuration from '../../configuration';

// D3 Imports
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max, min, extent } from 'd3-array';
import { lineRadial, curveLinearClosed } from 'd3-shape';

export class Radar extends Component {
	type = 'radar';
	renderType = RenderTypes.SVG;

	svg: SVGElement;
	groupMapsTo: string;
	uniqueKeys: string[];
	uniqueGroups: string[];
	fullDataNormalized: any;
	groupedDataNormalized: any;

	init() {
		const { events } = this.services;
		// Highlight correct line legend item hovers
		events.addEventListener(
			Events.Legend.ITEM_HOVER,
			this.handleLegendOnHover
		);
		// Un-highlight lines on legend item mouseouts
		events.addEventListener(
			Events.Legend.ITEM_MOUSEOUT,
			this.handleLegendMouseOut
		);
	}

	render(animate = true) {
		const svg = this.getComponentContainer();
		const { width, height } = DOMUtils.getSVGElementSize(svg, {
			useAttrs: true,
		});

		const data = this.model.getData();
		const groupedData = this.model.getGroupedData();
		const options = this.getOptions();
		const { angle, value } = Tools.getProperty(options, 'radar', 'axes');
		const groupMapsTo = Tools.getProperty(options, 'data', 'groupMapsTo');
		const {
			xLabelPadding,
			yLabelPadding,
			yTicksNumber,
			minRange,
			xAxisRectHeight,
		} = Configuration.radar;

		this.uniqueKeys = Array.from(new Set(data.map((d) => d[angle])));
		this.uniqueGroups = Array.from(
			new Set(data.map((d) => d[groupMapsTo]))
		);
		this.fullDataNormalized = this.normalizeFlatData(data);
		this.groupedDataNormalized = this.normalizeGroupedData(groupedData);

		const labelHeight = this.getLabelDimensions(this.uniqueKeys[0]).height;
		const margin = 2 * (labelHeight + yLabelPadding);
		const size = Math.min(width, height);
		const diameter = size - margin;
		const radius = diameter / 2;

		if (radius <= 0) {
			return;
		}

		// given a key, return the corresponding angle in radiants
		// rotated by -PI/2 because we want angle 0° at -y (12 o’clock)
		const xScale = scaleBand<string>()
			.domain(this.fullDataNormalized.map((d) => d[angle]))
			.range(
				[0, 2 * Math.PI].map((a) => a - Math.PI / 2) as [Angle, Angle]
			);

		const centerPointMinValue = min(
			this.fullDataNormalized.map((d) => d[value]) as number[]
		);
		const yScale = scaleLinear()
			.domain([
				centerPointMinValue >= 0 ? 0 : centerPointMinValue,
				max(this.fullDataNormalized.map((d) => d[value]) as number[]),
			])
			.range([minRange, radius])
			.nice(yTicksNumber);
		const yTicks = yScale.ticks(yTicksNumber);

		const colorScale = (group: string): string =>
			this.model.getFillColor(group);

		// constructs a new radial line generator
		// the angle accessor returns the angle in radians with 0° at -y (12 o’clock)
		// so map back the angle
		const radialLineGenerator = lineRadial<any>()
			.angle((d) => xScale(d[angle]) + Math.PI / 2)
			.radius((d) => yScale(d[value]))
			.curve(curveLinearClosed);

		// compute the space that each x label needs
		const horizSpaceNeededByEachXLabel = this.uniqueKeys.map((key) => {
			const tickWidth = this.getLabelDimensions(key).width;
			// compute the distance between the point that the label rapresents and the vertical diameter
			const distanceFromDiameter = distanceBetweenPointOnCircAndVerticalDiameter(
				xScale(key),
				radius
			);
			// the space each label occupies is the sum of these two values
			return tickWidth + distanceFromDiameter;
		});
		const leftPadding = max(horizSpaceNeededByEachXLabel);

		// center coordinates
		const c: Point = {
			x: leftPadding + xLabelPadding,
			y: height / 2,
		};

		/////////////////////////////
		// Drawing the radar
		/////////////////////////////

		// y axes
		const yAxes = DOMUtils.appendOrSelect(svg, 'g.y-axes').attr(
			'role',
			Roles.GROUP
		);
		const yAxisUpdate = yAxes
			.selectAll('path')
			.data(yTicks, (tick) => tick);
		// for each tick, create array of data corresponding to the points composing the shape
		const shapeData = (tick: number) =>
			this.uniqueKeys.map((key) => ({ [angle]: key, [value]: tick }));
		yAxisUpdate.join(
			(enter) =>
				enter
					.append('path')
					.attr('role', Roles.GRAPHICS_SYMBOL)
					.attr('opacity', 0)
					.attr('transform', `translate(${c.x}, ${c.y})`)
					.attr('fill', 'none')
					.call((selection) =>
						selection
							.transition(
								this.services.transitions.getTransition(
									'radar_y_axes_enter',
									animate
								)
							)
							.attr('opacity', 1)
							.attr('d', (tick) =>
								radialLineGenerator(shapeData(tick))
							)
					),
			(update) =>
				update.call((selection) =>
					selection
						.transition(
							this.services.transitions.getTransition(
								'radar_y_axes_update',
								animate
							)
						)
						.attr('opacity', 1)
						.attr('transform', `translate(${c.x}, ${c.y})`)
						.attr('d', (tick) =>
							radialLineGenerator(shapeData(tick))
						)
				),
			(exit) =>
				exit.call((selection) =>
					selection
						.transition(
							this.services.transitions.getTransition(
								'radar_y_axes_exit',
								animate
							)
						)
						.attr('d', (tick) =>
							radialLineGenerator(shapeData(tick))
						)
						.attr('opacity', 0)
						.remove()
				)
		);

		// x axes
		const xAxes = DOMUtils.appendOrSelect(svg, 'g.x-axes').attr(
			'role',
			Roles.GROUP
		);
		const xAxisUpdate = xAxes
			.selectAll('line')
			.data(this.uniqueKeys, (key) => key);
		xAxisUpdate.join(
			(enter) =>
				enter
					.append('line')
					.attr('role', Roles.GRAPHICS_SYMBOL)
					.attr('opacity', 0)
					.attr('class', (key) => `x-axis-${Tools.kebabCase(key)}`) // replace spaces with -
					.attr('stroke-dasharray', '0')
					.attr(
						'x1',
						(key) => polarToCartesianCoords(xScale(key), 0, c).x
					)
					.attr(
						'y1',
						(key) => polarToCartesianCoords(xScale(key), 0, c).y
					)
					.attr(
						'x2',
						(key) => polarToCartesianCoords(xScale(key), 0, c).x
					)
					.attr(
						'y2',
						(key) => polarToCartesianCoords(xScale(key), 0, c).y
					)
					.call((selection) =>
						selection
							.transition(
								this.services.transitions.getTransition(
									'radar_x_axes_enter',
									animate
								)
							)
							.attr('opacity', 1)
							.attr(
								'x1',
								(key) =>
									polarToCartesianCoords(
										xScale(key),
										yScale.range()[0],
										c
									).x
							)
							.attr(
								'y1',
								(key) =>
									polarToCartesianCoords(
										xScale(key),
										yScale.range()[0],
										c
									).y
							)
							.attr(
								'x2',
								(key) =>
									polarToCartesianCoords(
										xScale(key),
										yScale.range()[1],
										c
									).x
							)
							.attr(
								'y2',
								(key) =>
									polarToCartesianCoords(
										xScale(key),
										yScale.range()[1],
										c
									).y
							)
					),
			(update) =>
				update.call((selection) =>
					selection
						.transition(
							this.services.transitions.getTransition(
								'radar_x_axes_update',
								animate
							)
						)
						.attr('opacity', 1)
						.attr(
							'x1',
							(key) =>
								polarToCartesianCoords(
									xScale(key),
									yScale.range()[0],
									c
								).x
						)
						.attr(
							'y1',
							(key) =>
								polarToCartesianCoords(
									xScale(key),
									yScale.range()[0],
									c
								).y
						)
						.attr(
							'x2',
							(key) =>
								polarToCartesianCoords(
									xScale(key),
									yScale.range()[1],
									c
								).x
						)
						.attr(
							'y2',
							(key) =>
								polarToCartesianCoords(
									xScale(key),
									yScale.range()[1],
									c
								).y
						)
				),
			(exit) =>
				exit.call((selection) =>
					selection
						.transition(
							this.services.transitions.getTransition(
								'radar_x_axes_exit',
								animate
							)
						)
						.attr('opacity', 0)
						.remove()
				)
		);

		// x labels
		const xLabels = DOMUtils.appendOrSelect(svg, 'g.x-labels').attr(
			'role',
			Roles.GROUP
		);
		const xLabelUpdate = xLabels.selectAll('text').data(this.uniqueKeys);
		xLabelUpdate.join(
			(enter) =>
				enter
					.append('text')
					.text((key) => key)
					.attr('opacity', 0)
					.attr(
						'x',
						(key) =>
							polarToCartesianCoords(
								xScale(key),
								yScale.range()[1] + xLabelPadding,
								c
							).x
					)
					.attr(
						'y',
						(key) =>
							polarToCartesianCoords(
								xScale(key),
								yScale.range()[1] + xLabelPadding,
								c
							).y
					)
					.style(
						'text-anchor',
						(key) => radialLabelPlacement(xScale(key)).textAnchor
					)
					.style(
						'dominant-baseline',
						(key) =>
							radialLabelPlacement(xScale(key)).dominantBaseline
					)
					.call((selection) =>
						selection
							.transition(
								this.services.transitions.getTransition(
									'radar_x_labels_enter',
									animate
								)
							)
							.attr('opacity', 1)
					),
			(update) =>
				update.call((selection) =>
					selection
						.transition(
							this.services.transitions.getTransition(
								'radar_x_labels_update',
								animate
							)
						)
						.attr('opacity', 1)
						.attr(
							'x',
							(key) =>
								polarToCartesianCoords(
									xScale(key),
									yScale.range()[1] + xLabelPadding,
									c
								).x
						)
						.attr(
							'y',
							(key) =>
								polarToCartesianCoords(
									xScale(key),
									yScale.range()[1] + xLabelPadding,
									c
								).y
						)
				),
			(exit) =>
				exit.call((selection) =>
					selection
						.transition(
							this.services.transitions.getTransition(
								'radar_x_labels_exit',
								animate
							)
						)
						.attr('opacity', 0)
						.remove()
				)
		);

		// blobs
		const blobs = DOMUtils.appendOrSelect(svg, 'g.blobs').attr(
			'role',
			Roles.GROUP
		);
		const blobUpdate = blobs
			.selectAll('path')
			.data(this.groupedDataNormalized, (group) => group.name);

		blobUpdate.join(
			(enter) =>
				enter
					.append('path')
					.attr('class', (group) =>
						this.model.getColorClassName({
							classNameTypes: [
								ColorClassNameTypes.FILL,
								ColorClassNameTypes.STROKE,
							],
							dataGroupName: group.name,
							originalClassName: 'blob',
						})
					)
					.attr('role', Roles.GRAPHICS_SYMBOL)
					.attr('opacity', 0)
					.attr(
						'transform',
						animate
							? () =>
									`translate(${c.x}, ${c.y}) scale(${
										1 + Math.random() * 0.35
									})`
							: `translate(${c.x}, ${c.y})`
					)
					.style('fill', (group) => colorScale(group.name))
					.style('fill-opacity', Configuration.radar.opacity.selected)
					.style('stroke', (group) => colorScale(group.name))

					.call((selection) => {
						const selectionUpdate = selection.transition(
							this.services.transitions.getTransition(
								'radar_blobs_enter',
								animate
							)
						);

						if (animate) {
							selectionUpdate
								.delay(() => Math.random() * 30)
								.attr('transform', `translate(${c.x}, ${c.y})`);
						}

						selectionUpdate
							.attr('opacity', 1)
							.attr('d', (group) =>
								radialLineGenerator(group.data)
							);
					}),
			(update) => {
				update
					.attr('class', (group) =>
						this.model.getColorClassName({
							classNameTypes: [
								ColorClassNameTypes.FILL,
								ColorClassNameTypes.STROKE,
							],
							dataGroupName: group.name,
							originalClassName: 'blob',
						})
					)
					.style('fill', (group) => colorScale(group.name))
					.style('stroke', (group) => colorScale(group.name));
				update.call((selection) =>
					selection
						.transition(
							this.services.transitions.getTransition(
								'radar_blobs_update',
								animate
							)
						)
						.attr('opacity', 1)
						.attr('transform', `translate(${c.x}, ${c.y})`)
						.attr('d', (group) => radialLineGenerator(group.data))
				);
			},
			(exit) =>
				exit.call((selection) => {
					const selectionUpdate = selection.transition(
						this.services.transitions.getTransition(
							'radar_blobs_exit',
							animate
						)
					);

					if (animate) {
						selectionUpdate
							.delay(() => Math.random() * 30)
							.attr(
								'transform',
								() =>
									`translate(${c.x}, ${c.y}) scale(${
										1 + Math.random() * 0.35
									})`
							);
					}

					selectionUpdate.attr('opacity', 0).remove();
				})
		);

		// data dots
		const dots = DOMUtils.appendOrSelect(svg, 'g.dots').attr(
			'role',
			Roles.GROUP
		);
		const dotsUpdate = dots
			.selectAll('circle')
			.data(this.fullDataNormalized);
		dotsUpdate
			.join(
				(enter) =>
					enter.append('circle').attr('role', Roles.GRAPHICS_SYMBOL),
				(update) => update,
				(exit) => exit.remove()
			)
			.attr('class', (d) =>
				this.model.getColorClassName({
					classNameTypes: [ColorClassNameTypes.FILL],
					dataGroupName: d[groupMapsTo],
					originalClassName: Tools.kebabCase(d[angle]),
				})
			)
			.attr(
				'cx',
				(d) =>
					polarToCartesianCoords(
						xScale(d[angle]),
						yScale(d[value]),
						c
					).x
			)
			.attr(
				'cy',
				(d) =>
					polarToCartesianCoords(
						xScale(d[angle]),
						yScale(d[value]),
						c
					).y
			)
			.attr('r', 0)
			.attr('opacity', 0)
			.style('fill', (d) => colorScale(d[groupMapsTo]));

		// rectangles
		const xAxesRect = DOMUtils.appendOrSelect(svg, 'g.x-axes-rect').attr(
			'role',
			Roles.GROUP
		);
		const xAxisRectUpdate = xAxesRect
			.selectAll('rect')
			.data(this.uniqueKeys);
		xAxisRectUpdate
			.join(
				(enter) =>
					enter.append('rect').attr('role', Roles.GRAPHICS_SYMBOL),
				(update) => update,
				(exit) => exit.remove()
			)
			.attr('x', c.x)
			.attr('y', c.y - xAxisRectHeight / 2)
			.attr('width', yScale.range()[1])
			.attr('height', xAxisRectHeight)
			.style('fill', 'red')
			.style('fill-opacity', 0)
			.attr(
				'transform',
				(key) => `rotate(${radToDeg(xScale(key))}, ${c.x}, ${c.y})`
			);

		// y labels (show only the min and the max labels)
		const yLabels = DOMUtils.appendOrSelect(svg, 'g.y-labels').attr(
			'role',
			Roles.GROUP
		);
		const yLabelUpdate = yLabels.selectAll('text').data(extent(yTicks));
		yLabelUpdate.join(
			(enter) =>
				enter
					.append('text')
					.attr('opacity', 0)
					.text((tick) => tick)
					.attr(
						'x',
						(tick) =>
							polarToCartesianCoords(
								-Math.PI / 2,
								yScale(tick),
								c
							).x + yLabelPadding
					)
					.attr(
						'y',
						(tick) =>
							polarToCartesianCoords(
								-Math.PI / 2,
								yScale(tick),
								c
							).y
					)
					.style('text-anchor', 'start')
					.style('dominant-baseline', 'middle')
					.call((selection) =>
						selection
							.transition(
								this.services.transitions.getTransition(
									'radar_y_labels_enter',
									animate
								)
							)
							.attr('opacity', 1)
					),
			(update) =>
				update.call((selection) =>
					selection
						.transition(
							this.services.transitions.getTransition(
								'radar_y_labels_update',
								animate
							)
						)
						.text((tick) => tick)
						.attr('opacity', 1)
						.attr(
							'x',
							(tick) =>
								polarToCartesianCoords(
									-Math.PI / 2,
									yScale(tick),
									c
								).x + yLabelPadding
						)
						.attr(
							'y',
							(tick) =>
								polarToCartesianCoords(
									-Math.PI / 2,
									yScale(tick),
									c
								).y
						)
				),
			(exit) =>
				exit.call((selection) =>
					selection
						.transition(
							this.services.transitions.getTransition(
								'radar_y_labels_exit',
								animate
							)
						)
						.attr('opacity', 0)
						.remove()
				)
		);

		const alignment = Tools.getProperty(options, 'radar', 'alignment');

		const alignmentXOffset = this.getAlignmentXOffset(
			alignment,
			svg,
			this.getParent()
		);
		svg.attr('x', alignmentXOffset);

		// Add event listeners
		this.addEventListeners();
	}

	getAlignmentXOffset(alignment, svg, parent) {
		const svgDimensions = DOMUtils.getSVGElementSize(svg, {
			useBBox: true,
		});
		const { width } = DOMUtils.getSVGElementSize(parent, { useAttr: true });

		let alignmentOffset = 0;
		if (alignment === Alignments.CENTER) {
			alignmentOffset = Math.floor((width - svgDimensions.width) / 2);
		} else if (alignment === Alignments.RIGHT) {
			alignmentOffset = width - svgDimensions.width;
		}

		return alignmentOffset;
	}

	// append temporarily the label to get the exact space that it occupies
	getLabelDimensions = (label: string) => {
		const tmpTick = DOMUtils.appendOrSelect(
			this.getComponentContainer(),
			`g.tmp-tick`
		);
		const tmpTickText = DOMUtils.appendOrSelect(tmpTick, `text`).text(
			label
		);
		const { width, height } = DOMUtils.getSVGElementSize(
			tmpTickText.node(),
			{ useBBox: true }
		);
		tmpTick.remove();
		return { width, height };
	};

	// Given a flat array of objects, if there are missing data on key,
	// creates corresponding data with value = null
	normalizeFlatData = (dataset: any) => {
		const options = this.getOptions();
		const { angle, value } = Tools.getProperty(options, 'radar', 'axes');
		const groupMapsTo = Tools.getProperty(options, 'data', 'groupMapsTo');
		const completeBlankData = Tools.flatMapDeep(
			this.uniqueKeys.map((key) => {
				return this.uniqueGroups.map((group) => ({
					[angle]: key,
					[groupMapsTo]: group,
					[value]: null,
				}));
			})
		);
		return Tools.merge(completeBlankData, dataset);
	};

	// Given a a grouped array of objects, if there are missing data on key,
	// creates corresponding data with value = null
	normalizeGroupedData = (dataset: any) => {
		const options = this.getOptions();
		const { angle, value } = Tools.getProperty(options, 'radar', 'axes');
		const groupMapsTo = Tools.getProperty(options, 'data', 'groupMapsTo');
		return dataset.map(({ name, data }) => {
			const completeBlankData = this.uniqueKeys.map((k) => ({
				[groupMapsTo]: name,
				[angle]: k,
				[value]: null,
			}));
			return { name, data: Tools.merge(completeBlankData, data) };
		});
	};

	handleLegendOnHover = (event: CustomEvent) => {
		const { hoveredElement } = event.detail;
		this.parent
			.selectAll('g.blobs path')
			.transition(
				this.services.transitions.getTransition('legend-hover-blob')
			)
			.style('fill-opacity', (group) => {
				if (group.name !== hoveredElement.datum().name) {
					return Configuration.radar.opacity.unselected;
				}
				return Configuration.radar.opacity.selected;
			})
			.style('stroke-opacity', (group) => {
				if (group.name !== hoveredElement.datum().name) {
					return Configuration.radar.opacity.unselected;
				}
				return 1;
			});
	};

	handleLegendMouseOut = (event: CustomEvent) => {
		this.parent
			.selectAll('g.blobs path')
			.transition(
				this.services.transitions.getTransition('legend-mouseout-blob')
			)
			.style('fill-opacity', Configuration.radar.opacity.selected)
			.style('stroke-opacity', 1);
	};

	destroy() {
		// Remove event listeners
		this.parent
			.selectAll('.x-axes-rect > rect')
			.on('mouseover', null)
			.on('mousemove', null)
			.on('mouseout', null);
		// Remove legend listeners
		const eventsFragment = this.services.events;
		eventsFragment.removeEventListener(
			Events.Legend.ITEM_HOVER,
			this.handleLegendOnHover
		);
		eventsFragment.removeEventListener(
			Events.Legend.ITEM_MOUSEOUT,
			this.handleLegendMouseOut
		);
	}

	addEventListeners() {
		const self = this;
		const {
			axes: { angle },
		} = Tools.getProperty(this.getOptions(), 'radar');

		// events on x axes rects
		this.parent
			.selectAll('.x-axes-rect > rect')
			.on('mouseover', function (event, datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Radar.X_AXIS_MOUSEOVER,
					{
						element: hoveredElement,
						datum,
					}
				);

				const axisLine = self.parent.select(
					`.x-axes .x-axis-${Tools.kebabCase(datum)}`
				);
				const dots = self.parent.selectAll(
					`.dots circle.${Tools.kebabCase(datum)}`
				);

				// Change style
				axisLine
					.classed('hovered', true)
					.attr('stroke-dasharray', '4 4');
				dots.classed('hovered', true)
					.attr('opacity', 1)
					.attr('r', Configuration.radar.dotsRadius);

				// get the items that should be highlighted
				const itemsToHighlight = self.fullDataNormalized.filter(
					(d) => d[angle] === datum
				);

				const options = self.getOptions();
				const { groupMapsTo } = options.data;
				const valueMapsTo = Tools.getProperty(
					options,
					'radar',
					'axes',
					'value'
				);

				// Show tooltip
				self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
					hoveredElement,
					items: itemsToHighlight
						.filter(
							(datum) => typeof datum[valueMapsTo] === 'number'
						)
						.map((datum) => ({
							label: datum[groupMapsTo],
							value: datum[valueMapsTo],
							color: self.model.getFillColor(datum[groupMapsTo]),
							class: self.model.getColorClassName({
								classNameTypes: [ColorClassNameTypes.TOOLTIP],
								dataGroupName: datum[groupMapsTo],
							}),
						})),
				});
			})
			.on('mousemove', function (event, datum) {
				const hoveredElement = select(this);

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Radar.X_AXIS_MOUSEMOVE,
					{
						element: hoveredElement,
						datum,
					}
				);

				self.services.events.dispatchEvent(Events.Tooltip.MOVE);
			})
			.on('click', function (event, datum) {
				// Dispatch mouse event
				self.services.events.dispatchEvent(Events.Radar.X_AXIS_CLICK, {
					element: select(this),
					datum,
				});
			})
			.on('mouseout', function (event, datum) {
				const hoveredElement = select(this);
				const axisLine = self.parent.select(
					`.x-axes .x-axis-${Tools.kebabCase(datum)}`
				);
				const dots = self.parent.selectAll(
					`.dots circle.${Tools.kebabCase(datum)}`
				);

				// Change style
				axisLine
					.classed('hovered', false)
					.attr('stroke-dasharray', '0');
				dots.classed('hovered', false).attr('opacity', 0).attr('r', 0);

				// Dispatch mouse event
				self.services.events.dispatchEvent(
					Events.Radar.X_AXIS_MOUSEOUT,
					{
						element: hoveredElement,
						datum,
					}
				);

				// Hide tooltip
				self.services.events.dispatchEvent(Events.Tooltip.HIDE);
			});
	}
}
