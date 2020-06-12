export const areaTimeSeriesData = [
	{ group: "Dataset 1", date: new Date(2019, 0, 1), value: 0 },
	{ group: "Dataset 1", date: new Date(2019, 0, 6), value: 57312 },
	{ group: "Dataset 1", date: new Date(2019, 0, 8), value: 21432 },
	{ group: "Dataset 1", date: new Date(2019, 0, 15), value: 70323 },
	{ group: "Dataset 1", date: new Date(2019, 0, 19), value: 21300 },
	{ group: "Dataset 2", date: new Date(2019, 0, 1), value: 50000 },
	{ group: "Dataset 2", date: new Date(2019, 0, 5), value: 15000 },
	{ group: "Dataset 2", date: new Date(2019, 0, 8), value: 20000 },
	{ group: "Dataset 2", date: new Date(2019, 0, 13), value: 39213 },
	{ group: "Dataset 2", date: new Date(2019, 0, 19), value: 61213 },
	{ group: "Dataset 3", date: new Date(2019, 0, 2), value: 10 },
	{ group: "Dataset 3", date: new Date(2019, 0, 6), value: 37312 },
	{ group: "Dataset 3", date: new Date(2019, 0, 8), value: 51432 },
	{ group: "Dataset 3", date: new Date(2019, 0, 13), value: 40323 },
	{ group: "Dataset 3", date: new Date(2019, 0, 19), value: 31300 }
];

export const areaTimeSeriesOptions = {
	title: "Area (time series)",
	axes: {
		bottom: {
			title: "2019 Annual Sales Figures",
			mapsTo: "date",
			scaleType: "time"
		},
		left: {
			mapsTo: "value",
			title: "Conversion rate",
			scaleType: "linear"
		}
	}
};

export const areaTimeSeriesCurvedData = [
	{ group: "Dataset 1", date: new Date(2019, 0, 1), value: 0 },
	{ group: "Dataset 1", date: new Date(2019, 0, 6), value: -37312 },
	{ group: "Dataset 1", date: new Date(2019, 0, 8), value: -22392 },
	{ group: "Dataset 1", date: new Date(2019, 0, 15), value: -52576 },
	{ group: "Dataset 1", date: new Date(2019, 0, 19), value: 20135 },
	{ group: "Dataset 2", date: new Date(2019, 0, 1), value: 47263 },
	{ group: "Dataset 2", date: new Date(2019, 0, 5), value: 14178 },
	{ group: "Dataset 2", date: new Date(2019, 0, 8), value: 23094 },
	{ group: "Dataset 2", date: new Date(2019, 0, 13), value: 45281 },
	{ group: "Dataset 2", date: new Date(2019, 0, 19), value: -63954 }
];

export const areaTimeSeriesCurvedOptions = {
	title: "Area (time series - natural curve)",
	axes: {
		bottom: {
			title: "2019 Annual Sales Figures",
			mapsTo: "date",
			scaleType: "time"
		},
		left: {
			mapsTo: "value",
			scaleType: "linear"
		}
	},
	curve: "curveNatural"
};

export const stackedAreaTimeSeriesData = [
	{ group: "Dataset 1", date: new Date(2019, 0, 1), value: 10000 },
	{ group: "Dataset 1", date: new Date(2019, 0, 5), value: 65000 },
	{ group: "Dataset 1", date: new Date(2019, 0, 8), value: 10000 },
	{ group: "Dataset 1", date: new Date(2019, 0, 13), value: 49213 },
	{ group: "Dataset 1", date: new Date(2019, 0, 17), value: 51213 },
	{ group: "Dataset 2", date: new Date(2019, 0, 1), value: 20000 },
	{ group: "Dataset 2", date: new Date(2019, 0, 5), value: 25000 },
	{ group: "Dataset 2", date: new Date(2019, 0, 8), value: 60000 },
	{ group: "Dataset 2", date: new Date(2019, 0, 13), value: 30213 },
	{ group: "Dataset 2", date: new Date(2019, 0, 17), value: 55213 },
	{ group: "Dataset 3", date: new Date(2019, 0, 1), value: 30000 },
	{ group: "Dataset 3", date: new Date(2019, 0, 5), value: 20000 },
	{ group: "Dataset 3", date: new Date(2019, 0, 8), value: 40000 },
	{ group: "Dataset 3", date: new Date(2019, 0, 13), value: 60213 },
	{ group: "Dataset 3", date: new Date(2019, 0, 17), value: 25213 }
];

export const stackedAreaTimeSeriesOptions = {
	title: "Stacked area (time series)",
	axes: {
		left: {
			stacked: true
		},
		bottom: {
			scaleType: "time"
		}
	},
	curve: "curveMonotoneX"
};

export const stackedAreaPercentageTimeSeriesOptions = {
	title: "Stacked area (percentage)",
	axes: {
		left: {
			domain: [0, 100],
			stacked: true,
			ticks: {
				formatter: (d) => `${d}%`
			}
		},
		bottom: {
			scaleType: "time"
		}
	},
	percentage: true,
	curve: "curveMonotoneX"
};
