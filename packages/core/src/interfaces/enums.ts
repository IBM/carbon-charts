import * as EventEnums from './events';
export const Events = EventEnums;

/**
 * enum of all supported chart themes
 */
export enum ChartTheme {
	DEFAULT = 'default',
	G100 = 'g100',
	G90 = 'g90',
	G10 = 'g10',
}

/**
 * enum of all color classname types
 */
export enum ColorClassNameTypes {
	FILL = 'fill',
	STROKE = 'stroke',
	TOOLTIP = 'tooltip',
}

/**
 * enum of all possible data aggregation types
 */
export enum AggregationTypes {
	COUNT = 'count',
	AVG = 'avg',
	SUM = 'sum',
}

/**
 * enum of all possible axis positions
 */
export enum AxisPositions {
	LEFT = 'left',
	RIGHT = 'right',
	TOP = 'top',
	BOTTOM = 'bottom',
}

/**
 * enum of all possible axis positions
 */
export enum ZoomBarTypes {
	GRAPH_VIEW = 'graph_view',
	SLIDER_VIEW = 'slider_view',
}

/**
 * enum of all possible truncation types
 */
export enum TruncationTypes {
	END_LINE = 'end_line',
	MID_LINE = 'mid_line',
	FRONT_LINE = 'front_line',
	NONE = 'none',
}

/**
 * enum of all possible cartesian orientations
 * to be used for determining the orientation
 * of graphs being draw over
 * cartesian scales
 */
export enum CartesianOrientations {
	VERTICAL = 'vertical',
	HORIZONTAL = 'horizontal',
}

/**
 * enum of all possible scale types
 */
export enum ScaleTypes {
	TIME = 'time',
	LINEAR = 'linear',
	LOG = 'log',
	LABELS = 'labels',
	LABELS_RATIO = 'labels-ratio',
}

/**
 * enum of all possible legend positions
 */
export enum LegendPositions {
	RIGHT = 'right',
	LEFT = 'left',
	TOP = 'top',
	BOTTOM = 'bottom',
}

/**
 * enum of all possible alignments
 */
export enum Alignments {
	LEFT = 'left',
	CENTER = 'center',
	RIGHT = 'right',
}

/**
 * enum of all possible legend orientations
 */
export enum LegendOrientations {
	HORIZONTAL = 'horizontal',
	VERTICAL = 'vertical',
}

/**
 * enum of all possible layout directions
 */
export enum LayoutDirection {
	ROW = 'row',
	COLUMN = 'column',
	ROW_REVERSE = 'row-reverse',
	COLUMN_REVERSE = 'column-reverse',
}

/**
 * enum of all possible layout growth values
 */
export enum LayoutGrowth {
	FIXED = 'fixed',
	PREFERRED = 'preferred',
	STRETCH = 'stretch',
}

/**
 * enum of all possible callout directions
 */
export enum CalloutDirections {
	LEFT = 'left',
	RIGHT = 'right',
}

/**
 * enum of all possible skeleton/empty state types
 */
export enum Skeletons {
	GRID = 'grid',
	VERT_OR_HORIZ = 'vertOrHoriz',
	PIE = 'pie',
	DONUT = 'donut',
}

/**
 * enum of all possible attributes used to aling text horizontally
 */
export enum TextAnchor {
	START = 'start',
	MIDDLE = 'middle',
	END = 'end',
}

/**
 * enum of all possible attributes used to aling text vertically
 */
export enum DominantBaseline {
	BASELINE = 'baseline',
	MIDDLE = 'middle',
	HANGING = 'hanging',
}

export enum GaugeTypes {
	SEMI = 'semi',
	FULL = 'full',
}

/**
 * enum of all possible callout directions
 */
export enum ArrowDirections {
	UP = 'up',
	DOWN = 'down',
}

/**
 * enum of carbon statuses
 */
export enum Statuses {
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger',
}

/**
 * enum of axis ticks rotation
 */
export enum TickRotations {
	ALWAYS = 'always',
	AUTO = 'auto',
	NEVER = 'never',
}

/**
 * enum of chartTypes that work with combo chart
 */
export enum ChartTypes {
	SCATTER = 'scatter',
	LINE = 'line',
	SIMPLE_BAR = 'simple-bar',
	STACKED_BAR = 'stacked-bar',
	GROUPED_BAR = 'grouped-bar',
	AREA = 'area',
	STACKED_AREA = 'stacked-area',
}
/**
 * enum of supported toolbar control types
 */
export enum ToolbarControlTypes {
	ZOOM_IN = 'Zoom in',
	ZOOM_OUT = 'Zoom out',
	RESET_ZOOM = 'Reset zoom',
}
/**
 * enum of title orientations for _vertical axes_
 */
export enum AxisTitleOrientations {
	LEFT = 'left',
	RIGHT = 'right',
}

/**
 * enum of legend item type
 */
export enum LegendItemTypes {
	CHECKBOX = 'checkbox',
	RADIUS = 'radius',
	AREA = 'area',
	SIZE = 'size',
	LINE = 'line',
	QUARTILE = 'quartile',
	ZOOM = 'zoom',
}
