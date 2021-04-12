import {
	LayoutGrowth,
	LegendPositions,
	Alignments,
	ToolbarControlTypes,
	ZoomBarTypes,
} from './enums';
import { Component } from '../components/component';
import { TruncationOptions } from './truncation';

/**
 * customize the overlay contents
 */
export interface LayoutComponentChild {
	id: string;
	/**
	 * the component that'll be rendered inside layout child
	 */
	components: Component[];
	/**
	 * size of the layout child
	 */
	size?: number;
	/**
	 * how the layout child will grow or shrink in x & y directions
	 */
	growth?: {
		x: LayoutGrowth;
		y: LayoutGrowth;
	};
}

/**
 * customize the legend component
 */
export interface LegendOptions {
	enabled?: boolean;
	position?: LegendPositions;
	/**
	 * the clickability of legend items
	 */
	clickable?: boolean;
	truncation?: TruncationOptions;
	alignment?: Alignments;
	order?: string[];
}

export interface TooltipOptions {
	/**
	 * enable or disable tooltip
	 */
	enabled?: boolean;
	/**
	 * a function to format the tooltip values
	 */
	valueFormatter?: Function;
	/**
	 * custom function for returning tooltip HTML
	 * passed an array or object with the data, and then the default tooltip markup
	 */
	customHTML?: Function;
	/**
	 * customizes the `Group` label shown inside tooltips
	 */
	groupLabel?: string;
	/**
	 * show total of items
	 */
	showTotal?: boolean;
	/**
	 * customizes the `Total` label shown inside tooltips
	 */
	totalLabel?: string;
	truncation?: TruncationOptions;
}

/**
 * Threshold options
 */
export interface ThresholdOptions {
	/**
	 * threshold value
	 */
	value: number | Date;
	/**
	 * a function to format the threshold values
	 */
	valueFormatter?: Function;
	/**
	 * hex threshold line color
	 */
	fillColor: string;
	/**
	 * threshold label
	 */
	label: string;
}

export interface GridOptions {
	y?: {
		enabled?: boolean;
		numberOfTicks?: number;
		alignWithAxisTicks?: boolean;
	};
	x?: {
		enabled?: boolean;
		numberOfTicks?: number;
		alignWithAxisTicks?: boolean;
	};
}

/**
 * Ruler options
 */
export interface RulerOptions {
	enabled?: boolean;
}

export interface BarOptions {
	width?: number;
	maxWidth?: number;
}

export interface StackedBarOptions extends BarOptions {
	dividerSize?: number;
}

/**
 * customize the Toolbar component
 */
export interface ToolbarOptions {
	/**
	 * is the toolbar visible or not
	 */
	enabled?: boolean;
	/**
	 * the maximum toolbar controls to be displayed as icons
	 * controls more than this number will appear in the overflow menu
	 * minimum is 1. (all toolbar controls are in overflow menu)
	 */
	numberOfIcons?: number;
	/**
	 * toolbar controls which will be displayed following the array order
	 */
	controls?: ToolbarControl[];
}

/**
 * options for each toolbar control
 */
export interface ToolbarControl {
	/**
	 * the toolbar control type
	 */
	type: ToolbarControlTypes;
	/**
	 * the text to display (if this control is displayed in overflow menu)
	 * type value will be displayed if text is not available
	 */
	text?: string;
}

/**
 * customize the ZoomBars in a chart
 */
export interface ZoomBarsOptions {
	/**
	 * a variable to handle default zoom in ratio (0 ~ 1.0)
	 * ex: shift click zoom in ratio
	 */
	zoomRatio?: number;
	/**
	 * a variable to define the minimum zoom ratio (0 ~ 1.0)
	 * If  ( zoom domain / max domain ) < minZoomRatio, zoom-in functions will be disabled
	 */
	minZoomRatio?: number;
	/**
	 * currently only the top position is supported
	 */
	top?: ZoomBarOptions;
	/**
	 * whether keep updating range axis in real time while zoom domain is changing
	 */
	updateRangeAxis?: boolean;
	/**
	 * whether to use the canvas option 
	 * currently only works for graph view
	 */
	canvas?: boolean;
}

/**
 * customize the ZoomBar component
 */
export interface ZoomBarOptions {
	/**
	 * is the zoom-bar visible or not
	 */
	enabled?: boolean;
	/**
	 * is the zoom-bar in loading state
	 */
	loading?: boolean;
	/**
	 * is the zoom-bar in locked state
	 */
	locked?: boolean;
	/**
	 * whether the zoom bar is showing a slider view or a graph view etc.
	 */
	type?: ZoomBarTypes;
	/**
	 * an two element array which represents the initial zoom domain
	 */
	initialZoomDomain?: Object[];
	/**
	 * options related to zoom bar data
	 */
	data?: Object[];
}
