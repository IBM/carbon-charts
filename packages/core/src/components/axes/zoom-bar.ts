// Internal Imports
import { Component } from '../component';
import { ChartModelCartesian } from '../../model-cartesian-charts';
import { Tools } from '../../tools';
import {
	AxisPositions,
	Events,
	ScaleTypes,
	ZoomBarTypes,
} from '../../interfaces';
import { DOMUtils } from '../../services';
import * as Configuration from '../../configuration';

// D3 Imports
import { extent } from 'd3-array';
import { brushX } from 'd3-brush';
import { area, line } from 'd3-shape';
import { event, select } from 'd3-selection';

// import the settings for the css prefix
import settings from 'carbon-components/es/globals/js/settings';

export class ZoomBar extends Component {
	type = 'zoom-bar';

	// The minimum selection x range to trigger handler update
	// Smaller number may introduce a handler flash during initialization
	// Bigger number may not trigger handler update while selection area on chart is very small
	MIN_SELECTION_DIFF = 9e-10;

	// needs to match the style in _zoom-bar.scss
	brushSelector = 'g.zoom-bar-brush';

	// The max allowed selection range, will be updated soon in render()
	maxSelectionRange: [0, 0];

	// Give every zoomBarClip a distinct ID
	// so they don't interfere the other zoom bars in a page
	clipId = 'zoomBarClip-' + Math.floor(Math.random() * 99999999999);

	brush = brushX();
	xScale: any;
	yScale: any;

	protected model: ChartModelCartesian;

	init() {
		this.services.events.addEventListener(
			Events.ZoomBar.UPDATE,
			this.render.bind(this)
		);
		// check if pre-defined zoom bar data exists
		const definedZoomBarData = Tools.getProperty(
			this.getOptions(),
			'zoomBar',
			AxisPositions.TOP,
			'data'
		);

		// load up the zoomBarData into this model
		this.model.setZoomBarData(definedZoomBarData);
	}

	render(animate = true) {
		const svg = this.getContainerSVG();

		const isTopZoomBarLoading = this.services.zoom.isZoomBarLoading(
			AxisPositions.TOP
		);
		const isTopZoomBarLocked = this.services.zoom.isZoomBarLocked(
			AxisPositions.TOP
		);

		const zoombarType = Tools.getProperty(
			this.getOptions(),
			'zoomBar',
			AxisPositions.TOP,
			'type'
		);

		const zoombarHeight = Configuration.zoomBar.height[zoombarType];

		const { width } = DOMUtils.getSVGElementSize(this.parent, {
			useAttrs: true,
		});
		// initialization is not completed yet
		if (width === 0) {
			return;
		}
		// get axes margins
		let axesLeftMargin = 0;
		const axesMargins = this.model.get('axesMargins');
		if (axesMargins && axesMargins.left) {
			axesLeftMargin = axesMargins.left;
		}

		const container = DOMUtils.appendOrSelect(svg, 'svg.zoom-container')
			.attr('width', '100%')
			.attr('height', zoombarHeight)
			.attr('opacity', 1);

		const spacer = DOMUtils.appendOrSelect(svg, 'rect.zoom-spacer')
			.attr('x', 0)
			.attr('y', zoombarHeight)
			.attr('width', '100%')
			.attr('height', Configuration.zoomBar.spacerHeight)
			.attr('opacity', 1)
			.attr('fill', 'none');

		const { canvas } = Tools.getProperty(this.getOptions(), 'zoomBar');

		let zoomGraphAreaUnselected;
		let zoomGraphArea;

		if (zoombarType === ZoomBarTypes.GRAPH_VIEW) {
			// Draw zoombar background rectangle
			DOMUtils.appendOrSelect(container, 'rect.zoom-bg')
				.attr('x', axesLeftMargin)
				.attr('y', 0)
				.attr('width', width - axesLeftMargin)
				.attr('height', '100%')
				.classed('zoom-bg-skeleton', isTopZoomBarLoading);

			if (canvas) {
				const canvasContainer = this.addCanvasContainer(
					width,
					zoombarHeight
				);

				// Append canvases
				zoomGraphAreaUnselected = DOMUtils.appendOrSelectCanvas(
					canvasContainer,
					{ width: String(width), height: zoombarHeight },
					'zoom-graph-area-unselected-canvas'
				);

				zoomGraphArea = DOMUtils.appendOrSelectCanvas(
					canvasContainer,
					{ width: String(width), height: zoombarHeight },
					'zoom-graph-area-canvas'
				);
			}
		} else if (zoombarType === ZoomBarTypes.SLIDER_VIEW) {
			// Draw zoombar background line
			DOMUtils.appendOrSelect(container, 'rect.zoom-slider-bg')
				.attr('x', axesLeftMargin)
				.attr('y', zoombarHeight / 2 - 1)
				.attr('width', width - axesLeftMargin)
				.attr('height', 2)
				.classed('zoom-slider-bg-skeleton', isTopZoomBarLoading);
		}

		if (isTopZoomBarLoading) {
			this.renderSkeleton(container, axesLeftMargin, width);
			return;
		}

		const { cartesianScales } = this.services;
		const mainXScale = cartesianScales.getMainXScale();
		const mainYScale = cartesianScales.getMainYScale();
		const mainXScaleType = cartesianScales.getMainXScaleType();

		if (mainXScale && mainXScaleType === ScaleTypes.TIME) {
			let zoomBarData = this.services.zoom.getZoomBarData();
			if (Tools.isEmpty(zoomBarData)) {
				// if there's no zoom bar data we can't do anything
				return;
			}
			this.xScale = mainXScale.copy();
			this.yScale = mainYScale.copy();

			const defaultDomain = this.services.zoom.getDefaultZoomBarDomain(
				zoomBarData
			);

			// add value 0 to the extended domain for zoom bar area graph
			zoomBarData = this.compensateDataForDefaultDomain(
				zoomBarData,
				defaultDomain
			);

			// get old initialZoomDomain from model
			const oldInitialZoomDomain = this.model.get('initialZoomDomain');
			// get new initialZoomDomain from option
			const newInitialZoomDomain = Tools.getProperty(
				this.getOptions(),
				'zoomBar',
				AxisPositions.TOP,
				'initialZoomDomain'
			);
			// change string date to Date object if necessary
			if (
				newInitialZoomDomain &&
				newInitialZoomDomain[0] &&
				newInitialZoomDomain[1]
			) {
				newInitialZoomDomain[0] = new Date(newInitialZoomDomain[0]);
				newInitialZoomDomain[1] = new Date(newInitialZoomDomain[1]);
			}
			// update initialZoomDomain and set zoomDomain in model only if the option is changed
			// not the same object, and both start date and end date are not equal
			if (
				newInitialZoomDomain &&
				!(
					oldInitialZoomDomain &&
					oldInitialZoomDomain[0].valueOf() ===
						newInitialZoomDomain[0].valueOf() &&
					oldInitialZoomDomain[1].valueOf() ===
						newInitialZoomDomain[1].valueOf()
				)
			) {
				this.model.set(
					{
						// use a new object instead of newInitialZoomDomain
						initialZoomDomain: Tools.merge(
							[],
							newInitialZoomDomain
						),
						zoomDomain: newInitialZoomDomain
							? Tools.merge([], newInitialZoomDomain)
							: defaultDomain,
					},
					{ skipUpdate: true }
				);
			} else if (
				newInitialZoomDomain === null &&
				oldInitialZoomDomain != null
			) {
				// if newInitialZoomDomain is set to null (when oldInitialZoomDomain is not null)
				// save initialZoomDomain and reset zoom domain to default domain
				this.model.set(
					{
						initialZoomDomain: null,
						zoomDomain: Tools.merge([], defaultDomain),
					},
					{ skipUpdate: true }
				);
			}

			this.xScale.range([axesLeftMargin, width]).domain(defaultDomain);

			// keep max selection range
			this.maxSelectionRange = this.xScale.range();

			this.yScale
				.range([0, zoombarHeight - 6])
				.domain(extent(zoomBarData, (d: any) => d.value));

			const zoomDomain = this.model.get('zoomDomain');

			if (zoombarType === ZoomBarTypes.GRAPH_VIEW) {
				this.renderZoomBarArea(
					canvas ? zoomGraphAreaUnselected : container,
					'path.zoom-graph-area-unselected',
					zoomBarData,
					null
				);
				this.updateClipPath(svg, this.clipId, 0, 0, 0, 0);
				this.renderZoomBarArea(
					canvas ? zoomGraphArea : container,
					'path.zoom-graph-area',
					zoomBarData,
					this.clipId
				);
				// Draw the zoom bar base line
				this.renderZoomBarBaseline(
					canvas ? zoomGraphAreaUnselected : container,
					axesLeftMargin,
					width
				);
				if (canvas) {
					this.renderZoomBarBaseline(
						zoomGraphArea,
						axesLeftMargin,
						width
					);
				}
			}

			// Attach brushing event listeners
			this.addBrushEventListener(zoomDomain, axesLeftMargin, width);

			// Draw the brushing area
			const brushArea = DOMUtils.appendOrSelect(
				svg,
				this.brushSelector
			).call(this.brush);

			if (zoomDomain === undefined) {
				// do nothing, initialization not completed yet
				// don't update brushHandle to avoid flash
			} else if (zoomDomain[0].valueOf() === zoomDomain[1].valueOf()) {
				brushArea.call(this.brush.move, this.xScale.range()); // default to full range
				this.updateBrushHandle(
					this.getContainerSVG(),
					this.xScale.range(),
					this.xScale.domain()
				);
			} else {
				const selected = zoomDomain.map((domain) =>
					this.xScale(domain)
				);
				if (selected[1] - selected[0] < this.MIN_SELECTION_DIFF) {
					// initialization not completed yet
					// don't update brushHandle to avoid flash
				} else {
					brushArea.call(this.brush.move, selected); // set brush to correct position
					this.updateBrushHandle(
						this.getContainerSVG(),
						selected,
						zoomDomain
					);
				}
			}
			if (isTopZoomBarLocked) {
				this.brush.filter(() => {
					return false;
				});
				// reset all cursor to auto
				brushArea.selectAll('rect').attr('cursor', 'auto');
			}
		}
	}

	addCanvasContainer(width, zoombarHeight) {
		const chartprefix = Tools.getProperty(
			this.getOptions(),
			'style',
			'prefix'
		);
		// Append div for canvases onto chart holder and position
		// Done this way to ensure cross browser compatability
		// As canvas positioning is not the same across browsers when canvas appended onto svg
		let canvasContainerPosition;
		const zoomSvgPosition = select(
			`svg.${settings.prefix}--${chartprefix}--zoom-bar`
		);
		if (!zoomSvgPosition.empty()) {
			canvasContainerPosition = `${zoomSvgPosition.attr('y')}px`;
		}

		let canvasContainer;
		const holder = select(this.model.get('holder'));
		const selection = holder.select(
			`div.${settings.prefix}--${chartprefix}--canvas-container`
		);

		if (selection.empty()) {
			// Use of xhtml causes errors in DOMUtils appendorselect method
			canvasContainer = holder
				.append('xhtml:div')
				.attr(
					'class',
					`${settings.prefix}--${chartprefix}--canvas-container`
				)
				.style('width', `${width}px`)
				.style('height', `${zoombarHeight}px`)
				.style('position', 'absolute')
				.style('top', canvasContainerPosition);
		} else {
			canvasContainer = selection
				.style('width', `${width}px`)
				.style('height', `${zoombarHeight}px`)
				.style('top', canvasContainerPosition);
		}
		return canvasContainer;
	}
	addBrushEventListener(zoomDomain, axesLeftMargin, width) {
		const brushEventListener = () => {
			const selection = event.selection;
			// follow d3 behavior: when selection is null, reset default full range
			// select behavior is completed, but nothing selected
			if (selection === null) {
				this.handleBrushedEvent(
					zoomDomain,
					this.xScale,
					this.xScale.range()
				);
			} else if (selection[0] === selection[1]) {
				// select behavior is not completed yet, do nothing
			} else {
				this.handleBrushedEvent(zoomDomain, this.xScale, selection);
			}
		};

		const zoombarType = Tools.getProperty(
			this.getOptions(),
			'zoomBar',
			AxisPositions.TOP,
			'type'
		);
		const zoombarHeight = Configuration.zoomBar.height[zoombarType];

		// Initialize the d3 brush
		this.brush
			.extent([
				[axesLeftMargin, 0],
				[width, zoombarHeight],
			])
			.on('start brush end', null) // remove old listener first
			.on('start brush end', brushEventListener);
	}

	// brush event listener
	handleBrushedEvent(zoomDomain, scale, selection) {
		const newDomain = [
			scale.invert(selection[0]),
			scale.invert(selection[1]),
		];

		// update brush handle position
		this.updateBrushHandle(this.getContainerSVG(), selection, newDomain);

		// be aware that the value of d3.event changes during an event!
		// update zoomDomain only if the event comes from mouse/touch event
		if (
			event.sourceEvent != null &&
			(event.sourceEvent.type === 'mousemove' ||
				event.sourceEvent.type === 'mouseup' ||
				event.sourceEvent.type === 'mousedown' ||
				event.sourceEvent.type === 'touchstart' ||
				event.sourceEvent.type === 'touchmove' ||
				event.sourceEvent.type === 'touchend')
		) {
			// only if zoomDomain is never set or needs update
			if (
				zoomDomain === undefined ||
				zoomDomain[0] !== newDomain[0] ||
				zoomDomain[1] !== newDomain[1]
			) {
				// don't dispatch event for all event types
				// let the following code to dispatch necessary events
				this.services.zoom.handleDomainChange(newDomain, {
					dispatchEvent: false,
				});
			}

			// dispatch selection events
			let zoomBarEventType;
			if (event.type === 'start') {
				zoomBarEventType = Events.ZoomBar.SELECTION_START;
			} else if (event.type === 'brush') {
				zoomBarEventType = Events.ZoomBar.SELECTION_IN_PROGRESS;
			} else if (event.type === 'end') {
				zoomBarEventType = Events.ZoomBar.SELECTION_END;
				// only dispatch zoom domain change event for triggering api call when event type equals to end
				this.services.events.dispatchEvent(Events.ZoomDomain.CHANGE, {
					newDomain,
				});
			}
			this.services.events.dispatchEvent(zoomBarEventType, {
				selection,
				newDomain,
			});
		}
	}

	updateBrushHandle(svg, selection, domain) {
		const self = this;
		const handleWidth = Configuration.zoomBar.handleWidth;

		const zoombarType = Tools.getProperty(
			this.getOptions(),
			'zoomBar',
			AxisPositions.TOP,
			'type'
		);
		const handleHeight = Configuration.zoomBar.height[zoombarType];
		const handleXDiff = -handleWidth / 2;

		const handleBarWidth = Configuration.zoomBar.handleBarWidth;
		const handleBarHeight =
			zoombarType === ZoomBarTypes.GRAPH_VIEW
				? Configuration.zoomBar.handleBarHeight
				: 6;
		const handleBarXDiff = -handleBarWidth / 2;
		const handleYBarDiff = (handleHeight - handleBarHeight) / 2;

		// handle
		svg.select(this.brushSelector)
			.selectAll('rect.handle')
			.data([{ type: 'w' }, { type: 'e' }])
			.attr('x', function (d) {
				if (d.type === 'w') {
					// handle should not exceed zoom bar range
					return Math.max(
						selection[0] + handleXDiff,
						self.maxSelectionRange[0]
					);
				} else if (d.type === 'e') {
					// handle should not exceed zoom bar range
					return Math.min(
						selection[1] + handleXDiff,
						self.maxSelectionRange[1] - handleWidth
					);
				}
			})
			.attr('y', 0)
			.attr('width', handleWidth)
			.attr('height', handleHeight)
			.attr('cursor', 'ew-resize')
			.style('display', null); // always display

		// handle-bar
		const handleBars = svg
			.select(this.brushSelector)
			.selectAll('rect.handle-bar')
			.data([{ type: 'w' }, { type: 'e' }]);
		// create rect if not exists
		handleBars
			.enter()
			.append('rect')
			.attr('class', function (d) {
				return 'handle-bar handle-bar--' + d.type;
			});
		// update positions
		handleBars
			.attr('x', function (d) {
				if (d.type === 'w') {
					return Math.max(
						selection[0] + handleBarXDiff,
						self.maxSelectionRange[0] - handleXDiff + handleBarXDiff
					);
				} else if (d.type === 'e') {
					return Math.min(
						selection[1] + handleBarXDiff,
						self.maxSelectionRange[1] + handleXDiff + handleBarXDiff
					);
				}
			})
			.attr('y', handleYBarDiff)
			.attr('width', handleBarWidth)
			.attr('height', handleBarHeight)
			.attr('cursor', 'ew-resize');

		// Update slider selected area
		if (zoombarType === ZoomBarTypes.SLIDER_VIEW) {
			this.updateSliderSelectedArea(selection);
		}

		this.updateClipPath(
			svg,
			this.clipId,
			selection[0],
			0,
			selection[1] - selection[0],
			handleHeight
		);
	}

	updateSliderSelectedArea(selection) {
		const zoombarType = Tools.getProperty(
			this.getOptions(),
			'zoomBar',
			AxisPositions.TOP,
			'type'
		);
		const zoombarHeight = Configuration.zoomBar.height[zoombarType];

		const { width } = DOMUtils.getSVGElementSize(this.parent, {
			useAttrs: true,
		});

		// get axes margins
		let axesLeftMargin = 0;
		const axesMargins = this.model.get('axesMargins');
		if (axesMargins && axesMargins.left) {
			axesLeftMargin = axesMargins.left;
		}

		const svg = this.getContainerSVG();
		const container = svg.select('svg.zoom-container');

		// Draw zoombar background line
		DOMUtils.appendOrSelect(container, 'rect.zoom-slider-selected-area')
			.attr('x', selection[0])
			.attr('y', zoombarHeight / 2 - 1)
			.attr('width', selection[1] - selection[0])
			.attr('height', 2);
	}

	renderZoomBarArea(container, querySelector, data, clipId) {
		const { cartesianScales } = this.services;
		const mainXAxisPosition = cartesianScales.getMainXAxisPosition();
		const mainYAxisPosition = cartesianScales.getMainYAxisPosition();
		const mainXScaleType = cartesianScales.getMainXScaleType();
		const mainYScaleType = cartesianScales.getMainYScaleType();

		const { canvas } = Tools.getProperty(this.getOptions(), 'zoomBar');

		const accessorFunction = (scale, scaleType, axisPosition) => {
			return (d, i) => {
				return cartesianScales.getValueFromScale(
					scale,
					scaleType,
					axisPosition,
					d,
					i
				);
			};
		};

		const xAccessor = accessorFunction(
			this.xScale,
			mainXScaleType,
			mainXAxisPosition
		);
		const yAccessor = accessorFunction(
			this.yScale,
			mainYScaleType,
			mainYAxisPosition
		);

		const zoombarType = Tools.getProperty(
			this.getOptions(),
			'zoomBar',
			AxisPositions.TOP,
			'type'
		);
		const zoombarHeight = Configuration.zoomBar.height[zoombarType];
		const areaGenerator = area()
			.x((d, i) => xAccessor(d, i))
			.y0(zoombarHeight)
			.y1((d, i) => zoombarHeight - yAccessor(d, i));

		if (canvas) {
			areaGenerator.context(container);

			const handleWidth = Configuration.zoomBar.handleWidth;

			const axesMargins = this.model.get('axesMargins');
			const axesLeftMargin =
				axesMargins && axesMargins.left ? axesMargins.left : null;
			const { width } = DOMUtils.getSVGElementSize(this.parent, {
				useAttrs: true,
			});

			const zoomDomain = this.model.get('zoomDomain');
			const selection = zoomDomain
				? zoomDomain.map((domain) => this.xScale(domain))
				: [axesLeftMargin, width - axesLeftMargin];

			// clip the canvas based on selected area
			if (querySelector !== 'path.zoom-graph-area-unselected') {
				const clipStart = Math.max(
					selection[0] + handleWidth / 2,
					this.maxSelectionRange[0] + handleWidth
				);

				const clipWidth =
					Math.min(
						selection[1] - handleWidth / 2,
						this.maxSelectionRange[1] - handleWidth
					) - clipStart;

				container.rect(clipStart, 0, clipWidth, zoombarHeight);
				container.clip();
			}

			// clip the canvas based on unselected area
			if (querySelector === 'path.zoom-graph-area-unselected') {
				container.rect(
					0,
					0,
					selection[0] - handleWidth / 2,
					zoombarHeight
				);
				container.rect(
					selection[1] + handleWidth / 2,
					0,
					this.maxSelectionRange[1] - selection[1],
					zoombarHeight
				);
				container.clip();
			}

			container.beginPath();
			areaGenerator(data);

			//non position based styling on canvas does not work through css
			//so have to apply here
			if (querySelector !== 'path.zoom-graph-area-unselected') {
				container.lineWidth = 2;
				container.fillStyle = DOMUtils.getComponentStyle(
					'canvas.zoom-graph-area-canvas',
					'fill'
				);
				container.strokeStyle = DOMUtils.getComponentStyle(
					'canvas.zoom-graph-area-canvas',
					'stroke'
				);
				container.stroke();
			} else {
				container.fillStyle = DOMUtils.getComponentStyle(
					'canvas.zoom-graph-area-unselected-canvas',
					'fill'
				);
			}

			container.fill();
			container.closePath();
		} else {
			const areaGraph = DOMUtils.appendOrSelect(container, querySelector)
				.datum(data)
				.attr('d', areaGenerator);

			if (clipId) {
				areaGraph.attr('clip-path', `url(#${clipId})`);
			}
		}
	}

	updateClipPath(svg, clipId, x, y, width, height) {
		const zoomBarClipPath = DOMUtils.appendOrSelect(svg, `clipPath`).attr(
			'id',
			clipId
		);
		DOMUtils.appendOrSelect(zoomBarClipPath, 'rect')
			.attr('x', x)
			.attr('y', y)
			.attr('width', width)
			.attr('height', height);
	}

	// assume the domains in data are already sorted
	compensateDataForDefaultDomain(data, defaultDomain) {
		if (!data || data.length < 2) {
			return;
		}
		const zoomBarData = Tools.clone(data);

		const domainIdentifier = this.services.cartesianScales.getDomainIdentifier();
		const rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();

		// if min domain is extended
		if (
			Number(defaultDomain[0]) < Number(zoomBarData[0][domainIdentifier])
		) {
			const newDatum = {};
			newDatum[domainIdentifier] = defaultDomain[0];
			newDatum[rangeIdentifier] = 0;
			zoomBarData.unshift(newDatum);
		}
		// if max domain is extended
		if (
			Number(defaultDomain[1]) >
			Number(zoomBarData[zoomBarData.length - 1][domainIdentifier])
		) {
			const newDatum = {};
			newDatum[domainIdentifier] = defaultDomain[1];
			newDatum[rangeIdentifier] = 0;
			zoomBarData.push(newDatum);
		}
		return zoomBarData;
	}

	renderZoomBarBaseline(container, startX, endX, skeletonClass = false) {
		const zoombarType = Tools.getProperty(
			this.model.getOptions(),
			'zoomBar',
			AxisPositions.TOP,
			'type'
		);
		const { canvas } = Tools.getProperty(this.getOptions(), 'zoomBar');
		const zoombarHeight = Configuration.zoomBar.height[zoombarType];

		if (canvas) {
			container.strokeStyle = DOMUtils.getComponentStyle(
				'canvas.zoom-graph-area-canvas',
				'stroke'
			);
			container.beginPath();
			container.lineWidth = 2;
			container.moveTo(startX, zoombarHeight);
			container.lineTo(endX, zoombarHeight);
			container.stroke();
		} else {
			const baselineGenerator = line()([
				[startX, zoombarHeight],
				[endX, zoombarHeight],
			]);
			DOMUtils.appendOrSelect(container, 'path.zoom-bg-baseline')
				.attr('d', baselineGenerator)
				.classed('zoom-bg-baseline-skeleton', skeletonClass);
		}
	}

	renderSkeleton(container, startX, endX) {
		// need to clear current zoom bar area
		this.renderZoomBarArea(
			container,
			'path.zoom-graph-area-unselected',
			[],
			null
		);
		this.renderZoomBarArea(
			container,
			'path.zoom-graph-area',
			[],
			this.clipId
		);
		// remove brush listener
		this.brush.on('start brush end', null);
		// clear d3 brush
		DOMUtils.appendOrSelect(
			this.getContainerSVG(),
			this.brushSelector
		).html(null);

		// re-render baseline because no axis labels in skeleton so the baseline length needs to change
		const zoombarType = Tools.getProperty(
			this.getOptions(),
			'zoomBar',
			AxisPositions.TOP,
			'type'
		);
		if (zoombarType === ZoomBarTypes.GRAPH_VIEW) {
			this.renderZoomBarBaseline(container, startX, endX, true);
		}
	}

	destroy() {
		this.brush.on('start brush end', null); // remove event listener
		this.services.events.removeEventListener(
			Events.ZoomBar.UPDATE,
			this.render.bind(this)
		);
	}
}
