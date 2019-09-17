import { Tools } from "./tools";
import {
	BaseChartOptions,
	AxisChartOptions,
	ScatterChartOptions,
	LineChartOptions,
} from "./interfaces/index";

/*
 *****************************
 * User configurable options *
 *****************************
 */

/**
 * Base chart options common to any chart
 */
const baseOptions: BaseChartOptions = {
	legend: {
		clickable: true
	},
	resizable: true,
	tooltip: {
		formatter: null
	}
};

// /**
//  * Options specific to pie charts
//  */
// export type PieChartOptions = BaseChartOptions;
// /**
//  * Options specific to pie charts
//  */
// const pieOptions: PieChartOptions = Tools.merge({}, baseOptions);

// const donutOptions: DonutChartOptions = Tools.merge({}, baseOptions);

/**
 * Options common to any chart with an axis
 */
const axisOptions: AxisChartOptions = Tools.merge({}, baseOptions, {
	scales: {
		x: {
			domain: null,
			ticks: 5
		},
		y: {
			domain: null,
			ticks: 5
		},
		ySecondary: {
			domain: null,
			ticks: 10
		}
	}
});

/**
 * options specific to line charts
 */
const lineOptions: LineChartOptions = Tools.merge({}, axisOptions, {
	points: {
		// default point radius to 3
		radius: 3,
		filled: true
	}
});

/**
 * options specific to line charts
 */
const scatterOptions: ScatterChartOptions = Tools.merge({}, axisOptions, {
	points: {
		// default point radius to 4
		radius: 4,
		fillOpacity: 0.3
	}
});

// /**
//  * options specific to bar charts
//  */
// const barOptions: BarChartOptions = Tools.merge({}, axisOptions);

// /**
//  * options specific to bar charts
//  */
// export type StackedBarChartOptions = BarChartOptions;
// /**
//  * options specific to bar charts
//  */
// const stackedBarOptions: StackedBarChartOptions = Tools.merge({}, barOptions);

// /**
//  * Options specific to combo charts.
//  *
//  */
// const comboOptions: ComboChartOptions = Tools.merge({}, axisOptions, barOptions, lineOptions, scatterOptions);

export const options = {
	BASE: baseOptions,
	AXIS: axisOptions,
	LINE: lineOptions,
	SCATTER: scatterOptions
};

/*
 ********************************************
 * Internal (non-user configurable) options *
 ********************************************
 */

/**
 * General chart options. margins, min/max widths, etc
 */
export const charts = {
	// margin: {
	// 	top: 20,
	// 	bottom: 60,
	// 	left: 60,
	// 	right: 20,
	// 	bar: {
	// 		top: 0,
	// 		right: -40,
	// 		bottom: 50,
	// 		left: 40
	// 	},
	// 	line: {
	// 		top: 0,
	// 		right: -40,
	// 		bottom: 50,
	// 		left: 40
	// 	}
	// },
	// resetOpacity: {
	// 	opacity: 1,
	// 	circle: {
	// 		fill: "white"
	// 	},
	// 	outline: "grey"
	// },
	// reduceOpacity: {
	// 	opacity: 0.25,
	// 	outline: "grey"
	// },
	// points: {
	// 	radius: 3
	// },
	// patternFills: {
	// 	width: 20,
	// 	height: 20
	// },
	// minWidth: 150,
	// widthBreak: 600,
	// marginForLegendTop: 40,
	// title: {
	// 	marginBottom: 8
	// },
	// magicRatio: 0.7,
	// magicMoreForY2Axis: 70,
	// axisCharts: {
	// 	minWidth: 100,
	// 	minHeight: 200
	// }
};

/**
 * Options to render scales to spec
 */
export const scales = {
	// maxWidthOfAxisLabel: 175,
	// maxNumOfAxisLabelLetters: 60,
	// yAxisAngle: -90,
	// xAxisAngle: -45,
	// domain: {
	// 	color: "#959595",
	// 	strokeWidth: 2
	// },
	// dx: "-1em",
	// label: {
	// 	dy: "1em"
	// },
	// tick: {
	// 	dy: "0.5em",
	// 	widthAdditionY: 25,
	// 	widthAdditionY2: 15,
	// 	heightAddition: 16,
	// 	lineHeight: 1.1
	// },
	// magicDy1: "0.71em",
	// magicY1: 9,
	// magicX1: -4,
	// magicY2: -9,
	// magicX2: 4,
	// y: {
	// 	numberOfTicks: 5,
	// 	thresholds: {
	// 		colors: {
	// 			"danger": "rgba(255, 39, 41, 0.1)",
	// 			"success": "rgba(0, 212, 117, 0.1)",
	// 			"warning": "rgba(255, 214, 0, 0.1)"

	// 		}
	// 	}
	// },
	// x: {
	// 	numberOfTicks: 5,
	// 	padding: 0.2
	// },
	// y2: {
	// 	numberOfTicks: 5
	// }
};

/**
 * Grid options
 */
export const grid = {
	x: {
		numberOfTicks: 5
	},
	y: {
		numberOfTicks: 5
	},
	strokeColor: "#ECEEEF"
};

/**
 * Options for line behaviour
 */
export const lines = {
	opacity: {
		unselected: 0.3,
		selected: 1
	}
};

// /**
//  * Options for pie behaviour
//  */
// export const pie = {
// 	maxWidth: 516.6,
// 	mouseover: {
// 		strokeWidth: 6,
// 		strokeOpacity: 0.5
// 	},
// 	mouseout: {
// 		strokeWidth: 0,
// 		strokeOpacity: 1
// 	},
// 	sliceLimit: 6,
// 	label: {
// 		dy: ".32em",
// 		margin: 8,
// 		other: "Other",
// 		fontSize: 12
// 	},
// 	callout : {
// 		sliceDegreeThreshold: 5,
// 		calloutOffsetX: 15,
// 		calloutOffsetY: 12,
// 		calloutTextMargin: 2,
// 		horizontalLineLength: 8,
// 		direction: {
// 			LEFT: "left",
// 			RIGHT: "right"
// 		}
// 	},
// 	default: {
// 		strokeWidth: 2
// 	},
// 	paddingLeft: 20
// };

// /**
//  * Options for donut behaviour
//  */
// export const donut = {
// 	centerText: {
// 		title: {
// 			y: 22
// 		},
// 		breakpoint: 175,
// 		magicScaleRatio: 2.5,
// 		numberFontSize: 24,
// 		titleFontSize: 15
// 	}
// };

/**
 * Legend configuration
 */
export const legend = {
	items: {
		status: {
			ACTIVE: 1,
			DISABLED: 0
		},
		horizontalSpace: 12,
		verticalSpace: 24
	},
	checkbox: {
		radius: 6.5,
		spaceAfter: 4
	},
	text: {

	}
};

/**
 * Tooltip options
 */
export const tooltip = {
	width: 200,
	arrowWidth: 10,
	magicXPoint2: 20,
	magicTop1: 21,
	magicTop2: 22,
	magicLeft1: 11,
	magicLeft2: 10,
	fadeIn: {
		duration: 250
	},
	fadeOut: {
		duration: 250
	},
	size: {
		COMPACT: "compact"
	}
};

/**
 * Base transition configuration
 */
export const transitions = {
	default: {
		duration: 300
	},
	pie_slice_hover: {
		duration: 100
	},
	pie_chart_titles: {
		duration: 375
	}
};
