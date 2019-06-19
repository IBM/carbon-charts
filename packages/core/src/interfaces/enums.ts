/*
 **********************
 * chart config enums *
 **********************
 */

/**
 * enum of all supported charts
 */
export enum ChartType {
	BAR = "bar",
	LINE = "line",
	SCATTER = "scatter",
	PIE = "pie",
	DONUT = "donut",
	COMBO = "combo"
}



/**
 * enum of all possible axis positions
 */
export enum AxisPositions {
	LEFT = "left",
	RIGHT = "right",
	TOP = "top",
	BOTTOM = "bottom"
}

/**
 * enum of all possible tooltip sizes
 */
export enum TooltipSize {
	COMPACT = "compact",
	FULL = ""
}

/**
 * enum of all possible threshold themes
 */
export enum ThresholdTheme {
	SUCCESS = "success",
	ERROR = "error",
	WARNING = "warning"
}


/**
 * enum of all possible threshold themes
 */
export enum LayoutDirection {
	ROW = "row",
	COLUMN = "column",
	ROW_REVERSE = "row-reverse",
	COLUMN_REVERSE = "column-reverse"
}
