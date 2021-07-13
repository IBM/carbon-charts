// Internal Imports
import { Component } from '../component';
import { DOMUtils } from '../../services';
import { CartesianOrientations, Events } from '../../interfaces';
import { Tools } from '../../tools';

// D3 Imports
import { Selection, mouse } from 'd3-selection';

type GenericSvgSelection = Selection<SVGElement, any, SVGElement, any>;

const THRESHOLD = 5;

/** check if x is inside threshold area extents  */
function pointIsWithinThreshold(dx: number, x: number) {
	return dx > x - THRESHOLD && dx < x + THRESHOLD;
}

export class Ruler extends Component {
	type = 'ruler';
	backdrop: GenericSvgSelection;
	elementsToHighlight: GenericSvgSelection;
	pointsWithinLine: {
		domainValue: number;
		originalData: any;
	}[];
	isXGridEnabled = Tools.getProperty(
		this.getOptions(),
		'grid',
		'x',
		'enabled'
	);
	isYGridEnabled = Tools.getProperty(
		this.getOptions(),
		'grid',
		'y',
		'enabled'
	);
	// flag for checking whether ruler event listener is added or not
	isEventListenerAdded = false;

	render() {
		const isRulerEnabled = Tools.getProperty(
			this.getOptions(),
			'ruler',
			'enabled'
		);

		this.drawBackdrop();

		if (isRulerEnabled && !this.isEventListenerAdded) {
			this.addBackdropEventListeners();
		} else if (!isRulerEnabled && this.isEventListenerAdded) {
			this.removeBackdropEventListeners();
		}
	}

	removeBackdropEventListeners() {
		this.isEventListenerAdded = false;
		this.backdrop.on('mousemove mouseover mouseout', null);
	}

	formatTooltipData(tooltipData) {
		return tooltipData;
	}

	showRuler([x, y]: [number, number]) {
		const svg = this.parent;
		const orientation: CartesianOrientations = this.services.cartesianScales.getOrientation();
		const mouseCoordinate =
			orientation === CartesianOrientations.HORIZONTAL ? y : x;
		const ruler = DOMUtils.appendOrSelect(svg, 'g.ruler').attr(
			'aria-label',
			'ruler'
		);
		const rulerLine = DOMUtils.appendOrSelect(ruler, 'line.ruler-line');
		const dataPointElements: GenericSvgSelection = svg.selectAll(
			'[role=graphics-symbol]'
		);
		const displayData = this.model.getDisplayData();
		const rangeScale = this.services.cartesianScales.getRangeScale();
		const [yScaleEnd, yScaleStart] = rangeScale.range();

		const pointsWithinLine = displayData
			.map((d) => ({
				domainValue: this.services.cartesianScales.getDomainValue(d),
				originalData: d,
			}))
			.filter((d) =>
				pointIsWithinThreshold(d.domainValue, mouseCoordinate)
			);

		if (
			this.pointsWithinLine &&
			pointsWithinLine.length === this.pointsWithinLine.length &&
			pointsWithinLine.map((point) => point.domainValue).join() ===
				this.pointsWithinLine.map((point) => point.domainValue).join()
		) {
			this.pointsWithinLine = pointsWithinLine;
			return this.services.events.dispatchEvent(Events.Tooltip.MOVE, {
				mousePosition: [x, y],
			});
		}

		this.pointsWithinLine = pointsWithinLine;

		/**
		 * Find matches, reduce is used instead of filter
		 * to only get elements which belong to the same axis coordinate
		 */
		const dataPointsMatchingRulerLine: {
			domainValue: number;
			originalData: any;
		}[] = this.pointsWithinLine.reduce((accum, currentValue) => {
			if (accum.length === 0) {
				accum.push(currentValue);
				return accum;
			}

			// store the first element of the accumulator array to compare it with current element being processed
			const sampleAccumValue = accum[0].domainValue;

			const distanceToCurrentValue = Math.abs(
				mouseCoordinate - currentValue.domainValue
			);
			const distanceToAccumValue = Math.abs(
				mouseCoordinate - sampleAccumValue
			);

			if (distanceToCurrentValue > distanceToAccumValue) {
				// if distance with current value is bigger than already existing value in the accumulator, skip current iteration
				return accum;
			} else if (distanceToCurrentValue < distanceToAccumValue) {
				// currentValue data point is closer to mouse inside the threshold area, so reinstantiate array
				accum = [currentValue];
			} else {
				// currentValue is equal to already stored values, which means there's another match on the same coordinate
				accum.push(currentValue);
			}

			return accum;
		}, []);

		// some data point match
		if (dataPointsMatchingRulerLine.length > 0) {
			const tooltipData = dataPointsMatchingRulerLine
				.map((d) => d.originalData)
				.filter((d) => {
					const rangeIdentifier = this.services.cartesianScales.getRangeIdentifier(
						d
					);
					const value = d[rangeIdentifier];
					return value !== null && value !== undefined;
				});

			// get elements on which we should trigger mouse events
			const domainValuesMatchingRulerLine = dataPointsMatchingRulerLine.map(
				(d) => d.domainValue
			);
			const elementsToHighlight = dataPointElements.filter((d) => {
				const domainValue = this.services.cartesianScales.getDomainValue(
					d
				);
				return domainValuesMatchingRulerLine.includes(domainValue);
			});

			/** if we pass from a trigger area to another one
			 * mouseout on previous elements won't get dispatched
			 * so we need to do it manually
			 */
			if (
				this.elementsToHighlight &&
				this.elementsToHighlight.size() > 0 &&
				!Tools.isEqual(this.elementsToHighlight, elementsToHighlight)
			) {
				this.hideRuler();
			}

			elementsToHighlight.dispatch('mouseover');

			// set current hovered elements
			this.elementsToHighlight = elementsToHighlight;

			console.log("tooltipData", tooltipData)

			this.services.events.dispatchEvent(Events.Tooltip.SHOW, {
				mousePosition: [x, y],
				hoveredElement: rulerLine,
				data: this.formatTooltipData(tooltipData),
			});

			ruler.attr('opacity', 1);

			// line snaps to matching point
			const sampleMatch = dataPointsMatchingRulerLine[0];
			if (orientation === 'horizontal') {
				rulerLine
					.attr('x1', yScaleStart)
					.attr('x2', yScaleEnd)
					.attr('y1', sampleMatch.domainValue)
					.attr('y2', sampleMatch.domainValue);
			} else {
				rulerLine
					.attr('y1', yScaleStart)
					.attr('y2', yScaleEnd)
					.attr('x1', sampleMatch.domainValue)
					.attr('x2', sampleMatch.domainValue);
			}
		} else {
			this.hideRuler();
		}
	}

	hideRuler() {
		const svg = this.parent;
		const ruler = DOMUtils.appendOrSelect(svg, 'g.ruler');
		const dataPointElements = svg.selectAll('[role=graphics-symbol]');

		dataPointElements.dispatch('mouseout');
		this.services.events.dispatchEvent(Events.Tooltip.HIDE);
		ruler.attr('opacity', 0);
	}

	/**
	 * Adds the listener on the X grid to trigger multiple point tooltips along the x axis.
	 */
	addBackdropEventListeners() {
		this.isEventListenerAdded = true;
		const self = this;
		const displayData = this.model.getDisplayData();

		let mouseMoveCallback = function () {
			const pos = mouse(self.parent.node());
			self.showRuler(pos);
		};

		// Debounce mouseMoveCallback if there are more than 100 datapoints
		if (displayData.length > 100) {
			const debounceThreshold = (displayData.length % 50) * 12.5;

			mouseMoveCallback = Tools.debounceWithD3MousePosition(
				function () {
					const { mousePosition } = this;
					self.showRuler(mousePosition);
				},
				debounceThreshold,
				this.parent.node()
			);
		}

		this.backdrop
			.on('mousemove mouseover', mouseMoveCallback)
			.on('mouseout', this.hideRuler.bind(this));
	}

	drawBackdrop() {
		const svg = this.parent;

		const mainXScale = this.services.cartesianScales.getMainXScale();
		const mainYScale = this.services.cartesianScales.getMainYScale();

		const [xScaleStart, xScaleEnd] = mainXScale.range();
		const [yScaleEnd, yScaleStart] = mainYScale.range();

		// Get height from the grid
		this.backdrop = DOMUtils.appendOrSelect(svg, 'svg.chart-grid-backdrop');
		const backdropRect = DOMUtils.appendOrSelect(
			this.backdrop,
			this.isXGridEnabled || this.isYGridEnabled
				? 'rect.chart-grid-backdrop.stroked'
				: 'rect.chart-grid-backdrop'
		);
	}
}
