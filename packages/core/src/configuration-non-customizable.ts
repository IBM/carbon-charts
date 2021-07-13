import { ZoomBarTypes, LegendItemTypes } from './interfaces';
import { easeCubicInOut } from 'd3-ease';

export const area = {
	opacity: {
		unselected: 0.05,
		selected: 0.4,
	},
};

export const axis = {
	ticks: {
		number: 7,
		rotateIfSmallerThan: 30,
		verticalSpaceRatio: 2.5,
		horizontalSpaceRatio: 3.5,
	},
	ratio: {
		reference: 'value',
		compareTo: 'marker',
	},
	paddingRatio: 0.1,
};

export const canvasZoomSettings = {
	duration: 1000,
	ease: easeCubicInOut,
	zoomLevel: 3,
};

export const circlePack = {
	circles: {
		fillOpacity: 0.3,
		hover: {
			stroke: '#FFF',
		},
	},
	padding: {
		mainGroup: 4,
		children: 2,
	},
	hierarchyLevel: 2,
};

export const color = {
	pairingOptions: {
		'1-color': 4,
		'2-color': 5,
		'3-color': 5,
		'4-color': 3,
		'5-color': 2,
		'14-color': 1,
	},
};

export const boxplot = {
	circle: {
		radius: 4,
		opacity: {
			hovered: 1,
			default: 0.3,
		},
	},
	box: {
		opacity: {
			hovered: 0.5,
			default: 0.3,
		},
	},
	strokeWidth: {
		default: 1,
		thicker: 2,
	},
};

export const legend = {
	items: {
		status: {
			ACTIVE: 1,
			DISABLED: 0,
		},
		horizontalSpace: 12,
		verticalSpace: 24,
		textYOffset: 8,
		spaceAfter: 4,
	},
	checkbox: {
		radius: 6.5,
	},
	radius: {
		iconData: [
			{ cx: 7, cy: 7, r: 6.5 },
			{ cx: 7, cy: 10, r: 3.5 },
		],
		fill: null,
		stroke: '#8c8c8c',
	},
	line: {
		yPosition: 6,
		width: 24,
		strokeWidth: 1.4,
		fill: null,
		stroke: '#999999',
	},
	area: {
		width: 24,
		height: 13,
		fill: '#6f6f6f',
		stroke: null,
	},
	size: {
		iconData: [
			{ width: 23, height: 12 },
			{ width: 13, height: 6 },
		],
		fill: null,
		stroke: '#8D8D8D',
	},
	quartile: {
		iconData: [
			{ x: 0, y: 0, width: 24, height: 13 },
			{ x: 11, y: 4, width: 1, height: 4 },
		],
	},
	zoom: {
		iconData: [{ x: 0, y: 0, width: 12, height: 12 }],
		color: '#8D8D8D',
	},
};

export const lines = {
	opacity: {
		unselected: 0.3,
		selected: 1,
	},
	weight: {
		selected: 2,
		unselected: 1,
	},
};

export const meter = {
	statusBar: {
		paddingRight: 5,
	},
	status: {
		indicatorSize: 16,
		paddingLeft: 15,
	},
	total: {
		paddingLeft: 36
	},
	height: {
		default: 8,
		proportional: 16
	},
	dividerWidth: 2
};

export const pie = {
	radiusOffset: -15,
	innerRadius: 2,
	padAngle: 0.007,
	hoverArc: {
		outerRadiusOffset: 3,
	},
	xOffset: 30,
	yOffset: 20,
	yOffsetCallout: 10,
	callout: {
		minSliceDegree: 5,
		offsetX: 15,
		offsetY: 12,
		horizontalLineLength: 8,
		textMargin: 2,
	},
};

export const radar = {
	opacity: {
		unselected: 0.1,
		selected: 0.3,
	},
	xLabelPadding: 10,
	yLabelPadding: 8,
	yTicksNumber: 4,
	minRange: 10,
	xAxisRectHeight: 50,
	dotsRadius: 5,
};

export const spacers = {
	default: {
		size: 24,
	},
};

export const tooltips = {
	horizontalOffset: 10,
};

/**
 * Base transition configuration
 */
export const transitions = {
	default: {
		duration: 300,
	},
	pie_slice_mouseover: {
		duration: 100,
	},
	pie_chart_titles: {
		duration: 375,
	},
	graph_element_mouseover_fill_update: {
		duration: 100,
	},
	graph_element_mouseout_fill_update: {
		duration: 100,
	},
};

export const toolbar = {
	buttonSize: 32,
	iconSize: 20,
	height: 32,
	spacerHeight: 10,
	iconPadding: 6,
};

export const zoomBar = {
	height: {
		[ZoomBarTypes.GRAPH_VIEW]: 32,
		[ZoomBarTypes.SLIDER_VIEW]: 10,
	},
	spacerHeight: 8,
	handleWidth: 5,
	handleBarWidth: 1,
	handleBarHeight: 12,
};

export const defaultLegendAdditionalItems = [
	{
		type: LegendItemTypes.RADIUS,
		name: 'Radius',
	},
	{
		type: LegendItemTypes.AREA,
		name: 'Poor area',
	},
	{
		type: LegendItemTypes.AREA,
		name: 'Satisfactory area',
	},
	{
		type: LegendItemTypes.AREA,
		name: 'Great area',
	},
	{
		type: LegendItemTypes.QUARTILE,
		name: 'Quartiles',
	},
]
