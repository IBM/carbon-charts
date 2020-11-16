/**
 * enum of all events related to the chart on the DOM
 */
export enum Chart {
	RENDER_FINISHED = "render-finished",
	RESIZE = "chart-resize",
	MOUSEOVER = "chart-mouseover",
	// MOUSEMOVE = "chart-mousemove",
	// CLICK = "chart-click",
	MOUSEOUT = "chart-mouseout"
}

/**
 * enum of all events related to the chart model
 */
export enum Model {
	UPDATE = "model-update"
}

/**
 * enum of all toolbar events
 */
export enum Toolbar {
	SHOW_OVERFLOW_MENU = "show-toolbar-overflow-menu",
	HIDE_OVERFLOW_MENU = "hide-toolbar-overflow-menu"
}

/**
 * enum of all events related to the zoom-bar
 */
export enum ZoomBar {
	UPDATE = "zoom-bar-update",
	SELECTION_START = "zoom-bar-selection-start",
	SELECTION_IN_PROGRESS = "zoom-bar-selection-in-progress",
	SELECTION_END = "zoom-bar-selection-end"
}

/**
 * enum of all events related to the zoom domain
 */
export enum ZoomDomain {
	CHANGE = "zoom-domain-change"
}

/**
 * enum of all axis-related events
 */
export enum Axis {
	LABEL_MOUSEOVER = "axis-label-mouseover",
	LABEL_MOUSEMOVE = "axis-label-mousemove",
	LABEL_CLICK = "axis-label-click",
	LABEL_MOUSEOUT = "axis-label-mouseout"
}

/**
 * enum of all area graph events
 */
export enum Area {
	AREA_MOUSEOVER = "area-mouseover",
	AREA_MOUSEMOVE = "area-mousemove",
	AREA_CLICK = "area-click",
	AREA_MOUSEOUT = "area-mouseout"
}

/**
 * enum of all pie graph events
 */
export enum Pie {
	SLICE_MOUSEOVER = "pie-slice-mouseover",
	SLICE_MOUSEMOVE = "pie-slice-mousemove",
	SLICE_CLICK = "pie-slice-click",
	SLICE_MOUSEOUT = "pie-slice-mouseout"
}

/**
 * enum of all gauge graph events
 */
export enum Gauge {
	ARC_MOUSEOVER = "gauge-arc-mouseover",
	ARC_MOUSEMOVE = "gauge-arc-mousemove",
	ARC_CLICK = "gauge-arc-click",
	ARC_MOUSEOUT = "gauge-arc-mouseout"
}

/**
 * enum of all bar graph events
 */
export enum Bar {
	BAR_MOUSEOVER = "bar-mouseover",
	BAR_MOUSEMOVE = "bar-mousemove",
	BAR_CLICK = "bar-click",
	BAR_MOUSEOUT = "bar-mouseout"
}

/**
 * enum of all scatter graph events
 */
export enum Scatter {
	SCATTER_MOUSEOVER = "scatter-mouseover",
	SCATTER_MOUSEMOVE = "scatter-mousemove",
	SCATTER_CLICK = "scatter-click",
	SCATTER_MOUSEOUT = "scatter-mouseout"
}

/**
 * enum of all line graph events
 */
export enum Line {
	POINT_MOUSEOVER = "scatter-mouseover",
	POINT_MOUSEMOVE = "scatter-mousemove",
	POINT_CLICK = "scatter-click",
	POINT_MOUSEOUT = "scatter-mouseout"
}

/**
 * enum of all radar graph events
 */
export enum Radar {
	X_AXIS_MOUSEOVER = "radar-x-axis-mouseover",
	X_AXIS_MOUSEMOVE = "radar-x-axis-mousemove",
	X_AXIS_CLICK = "radar-x-axis-click",
	X_AXIS_MOUSEOUT = "radar-x-axis-mouseout"
}

/**
 * enum of all treemap graph events
 */
export enum Treemap {
	LEAF_MOUSEOVER = "leaf-mouseover",
	LEAF_MOUSEMOVE = "leaf-mousemove",
	LEAF_CLICK = "leaf-click",
	LEAF_MOUSEOUT = "leaf-mouseout"
}

/**
 * enum of all tooltip events
 */
export enum Tooltip {
	SHOW = "show-tooltip",
	MOVE = "move-tooltip",
	HIDE = "hide-tooltip"
}

/**
 * enum of all events related to the overlay modal
 */
export enum Modal {
	SHOW = "show-modal",
	HIDE = "hide-modal"
}

/**
 * enum of all threshold events
 */
export enum Threshold {
	SHOW = "show-threshold",
	HIDE = "hide-threshold"
}

/**
 * enum of all legend related events
 */
export enum Legend {
	ITEM_HOVER = "legend-item-onhover",
	ITEM_CLICK = "legend-item-onclick",
	ITEM_MOUSEOUT = "legend-item-onmouseout",
	ITEMS_UPDATE = "legend-items-update"
}
