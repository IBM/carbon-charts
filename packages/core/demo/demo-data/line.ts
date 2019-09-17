import { colors } from "./colors";
import { getTheme } from "./themes";

export const curvedLineData = {
	labels: ["Qty", "More", "Sold", "Restocking", "Misc"],
	datasets: [
		{
			label: "Dataset 1",
			backgroundColors: [colors[0]],
			data: [
				65000,
				79000,
				49213,
				51213,
				16932
			]
		},
		{
			label: "Dataset 2",
			backgroundColors: [colors[1]],
			data: [
				80000,
				21312,
				56456,
				21312,
				0
			]
		},
		{
			label: "Dataset 3",
			backgroundColors: [colors[2]],
			data: [
				12312,
				34232,
				39232,
				12312,
				34234
			]
		}
	]
};

export const curvedLineOptions = {
	accessibility: false,
	scales: {
		x: {
			title: "2018 Annual Sales Figures",
		},
		y: {
			title: "Dollars (CAD)",
			yMaxAdjuster: yMax => yMax * 1.2,
			yMinAdjuster: yMin => yMin * 1.2,
			formatter: axisValue => `${axisValue / 1000}k`
		},
		y2: {
			ticks: {
				max: 1,
				min: 0
			}
		}
	},
	curve: {
		name: "curveNatural"
	},
	legendClickable: true,
	resizable: true,
	theme: getTheme()
};


export const lineData = {
	labels: ["Qty", "More", "Sold", "Restocking", "Misc"],
	datasets: [
		{
			label: "Dataset 1",
			backgroundColors: [colors[0]],
			data: [
				2000,
				4200,
				7000,
				4000,
				19000
			]
		},
		{
			label: "Dataset 2",
			backgroundColors: [colors[1]],
			data: [
				0,
				10000,
				20000,
				30000,
				40000
			]
		},
		{
			label: "Dataset 3",
			backgroundColors: [colors[2]],
			data: [
				0,
				20000,
				40000,
				60000,
				80000
			]
		}
	]
};

export const lineOptions = () => ({
	// animations: false,
	accessibility: false,
	axes: {
		top: {
			title: "2018 Annual Sales Figures",
			type: Math.random() > 0.5 ? "labels" : "linear",
			secondary: true
		},
		right: {
			primary: true
		}
	},
	curve: "curveNatural",
	legendClickable: true,
	resizable: true,
	points: {
		filled: Math.random() < 0.5,
		radius: Math.random() * 15
	}
});


export const lineTimeSeriesOptions = () => ({
	title: "Line",
	// animations: false,
	accessibility: false,
	curve: "curveNatural",
	axes: {
		bottom: {
			type: "labels",
			title: "2018 Annual Sales Figures",

		},
		left: {
			type: "log",
			title: "2018 Annual Sales Figures",

		},
		right: {
			// formatter: val => `${(val/80000) * 100}%`,

		},
		top: {
			type: "labels",
		}
	},
	grid: {
		y: {
			numberOfTicks: 20
		}
	},
	legendClickable: true,
	resizable: true
});


export const scatterTimeSeriesData = {
	labels: ["Qty", "More", "Sold", "Restocking", "Misc"],
	datasets: [
		{
			label: "Dataset 1",
			backgroundColors: [colors[0]],
			data: [
				{
					key: new Date(2019, 0, 1),
					value: 10000
				},
				{
					key: new Date(2019, 0, 5),
					value: 65000
				},
				{
					key: new Date(2019, 0, 8),
					value: 10000
				},
				{
					key: new Date(2019, 0, 13),
					value: 49213
				},
				{
					key: new Date(2019, 0, 17),
					value: 51213
				}
			]
		},
		{
			label: "Dataset 2",
			backgroundColors: [colors[1]],
			data: [
				{
					key: new Date(2019, 0, 2),
					value: 0
				},
				{
					key: new Date(2019, 0, 6),
					value: 57312
				},
				{
					key: new Date(2019, 0, 8),
					value: 21432
				},
				{
					key: new Date(2019, 0, 15),
					value: 70323
				},
				{
					key: new Date(2019, 0, 19),
					value: 21300
				}
			]
		},
		{
			label: "Dataset 3",
			backgroundColors: [colors[2]],
			data: [
				{
					key: new Date(2019, 0, 1),
					value: 50000
				},
				{
					key: new Date(2019, 0, 5),
					value: 15000
				},
				{
					key: new Date(2019, 0, 8),
					value: 20000
				},
				{
					key: new Date(2019, 0, 13),
					value: 39213
				},
				{
					key: new Date(2019, 0, 17),
					value: 61213
				}
			]
		},
		{
			label: "Dataset 4",
			backgroundColors: [colors[3]],
			data: [
				{
					key: new Date(2019, 0, 2),
					value: 10
				},
				{
					key: new Date(2019, 0, 6),
					value: 37312
				},
				{
					key: new Date(2019, 0, 8),
					value: 51432
				},
				{
					key: new Date(2019, 0, 15),
					value: 40323
				},
				{
					key: new Date(2019, 0, 19),
					value: 31300
				}
			]
		},
		// {
		// 	label: "Dataset 3",
		// 	backgroundColors: [colors[2]],
		// 	data: [
		// 		41200,
		// 		23400,
		// 		34210,
		// 		1400,
		// 		42100
		// 	]
		// }
	]
};

export const scatterData = {
	labels: ["Qty", "More", "Sold", "Restocking", "Misc"],
	datasets: [
		{
			label: "Dataset 1",
			backgroundColors: [colors[0]],
			data: [
				32100,
				23500,
				53100,
				42300,
				12300
			]
		},
		{
			label: "Dataset 2",
			backgroundColors: [colors[1]],
			data: [
				34200,
				53200,
				42300,
				21400,
				0
			]
		},
		{
			label: "Dataset 3 long name",
			backgroundColors: [colors[2]],
			data: [
				41200,
				23400,
				34210,
				1400,
				42100
			]
		},

		{
			label: "Dataset 4 long name",
			backgroundColors: [colors[3]],
			data: [
				22000,
				1200,
				9000,
				24000,
				3000
			]
		},
		{
			label: "Dataset 5 long name",
			backgroundColors: [colors[4]],
			data: [
				2412,
				30000,
				10000,
				5000,
				31000
			]
		},
		{
			label: "Dataset 6 long name",
			backgroundColors: [colors[5]],
			data: [
				0,
				20000,
				40000,
				60000,
				80000
			]
		}
	]
};
