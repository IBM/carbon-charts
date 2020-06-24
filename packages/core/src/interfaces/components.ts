import { LayoutGrowth, LegendPositions } from "./enums";
import { Component } from "../components/component";
import { TruncationOptions } from "./truncation";

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
	items?: {
		status?: {
			ACTIVE?: Number;
			DISABLED?: Number;
		};
		horizontalSpace?: Number;
		verticalSpace?: Number;
		textYOffset?: Number;
	};
	checkbox?: {
		radius?: Number;
		spaceAfter?: Number;
	};
	truncation?: TruncationOptions;
}

export interface TooltipOptions {
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
	 *  options to configure the datapoint tooltip
	 */
	datapoint?: {
		/**
		 * offset of the tooltip from the mouse position
		 */
		horizontalOffset?: number;
		/**
		 * toggles on/off datapoint tooltips.
		 */
		enabled?: boolean;
		/**
		 * vertical offset for tooltip placement
		 */
		verticalOffset?: number;
	};
	title?: {
		/**
		 * vertical offset for title tooltip placement. < 0 shifts the tooltip above title, > 0 shifts vertically down
		 */
		verticalOffset?: number;
		/**
		 * max width of title tooltip relative to the width of the chart-svg (percentage should be < 1)
		 */
		width?: number;
	};
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

/**
 * extends tooltip options to provide support for multiple gridline tooltips
 */
export interface AxisTooltipOptions extends TooltipOptions {
	/** options for gridline event listeners */
	gridline?: {
		/**
		 * controls whether the gridlines are active for tooltip support
		 */
		enabled?: boolean;
		/**
		 * optional set threshold (value between 0 and 1) for active gridlines
		 */
		threshold?: number;
	};
}

/**
 * extends tooltip for bar tooltip
 */
export interface BarTooltipOptions extends TooltipOptions {
	datapoint: {
		/**
		 * padding between the bar items and the tooltip
		 */
		verticalOffset: number;
	};
}

export interface GridOptions {
	y?: {
		numberOfTicks?: number;
	};
	x?: {
		numberOfTicks?: number;
	};
	strokeColor?: string;
}

export interface BarOptions {
	width?: number;
	maxWidth?: number;
}

export interface StackedBarOptions extends BarOptions {
	dividerSize?: number;
}
