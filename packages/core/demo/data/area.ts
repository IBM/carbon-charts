import { addZoomBarToOptions } from './zoom-bar';

export const areaTimeSeriesData = [
	{ group: 'Dataset 1', date: new Date(2019, 0, 1), value: 0 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 6), value: 57312 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 8), value: 21432 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 15), value: 70323 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 19), value: 21300 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 1), value: 50000 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 5), value: 15000 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 8), value: 20000 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 13), value: 39213 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 19), value: 61213 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 2), value: 10 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 6), value: 37312 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 8), value: 51432 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 13), value: 40323 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 19), value: 31300 },
];

export const areaTimeSeriesOptions = {
	title: 'Area (time series)',
	axes: {
		bottom: {
			title: '2019 Annual Sales Figures',
			mapsTo: 'date',
			scaleType: 'time',
		},
		left: {
			mapsTo: 'value',
			title: 'Conversion rate',
			scaleType: 'linear',
		},
	},
};

export const areaDiscreteDomain = [
	{ group: 'Dataset 1', value: 10000, key: 'a' },
	{ group: 'Dataset 1', value: 65000, key: 'b' },
	{ group: 'Dataset 1', value: 10000, key: 'c' },
	{ group: 'Dataset 1', value: 49213, key: 'd' },
	{ group: 'Dataset 1', value: 51213, key: 'e' },
	{ group: 'Dataset 2', value: 20000, key: 'a' },
	{ group: 'Dataset 2', value: 25000, key: 'b' },
	{ group: 'Dataset 2', value: 60000, key: 'c' },
	{ group: 'Dataset 2', value: 30213, key: 'd' },
	{ group: 'Dataset 2', value: 55213, key: 'e' },
	{ group: 'Dataset 3', value: 30000, key: 'a' },
	{ group: 'Dataset 3', value: 20000, key: 'b' },
	{ group: 'Dataset 3', value: 40000, key: 'c' },
	{ group: 'Dataset 3', value: 60213, key: 'd' },
	{ group: 'Dataset 3', value: 25213, key: 'e' },
];

export const areaDiscreteDomainOptions = {
	title: 'Area (discrete domain)',
	axes: {
		bottom: {
			title: '2019 Annual Sales Figures',
			mapsTo: 'key',
			scaleType: 'labels',
		},
		left: {
			mapsTo: 'value',
			title: 'Conversion rate',
			scaleType: 'linear',
		},
	},
};

export const areaTimeSeriesCurvedData = [
	{ group: 'Dataset 1', date: new Date(2019, 0, 1), value: 0 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 6), value: -37312 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 8), value: -22392 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 15), value: -52576 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 19), value: 20135 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 1), value: 47263 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 5), value: 14178 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 8), value: 23094 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 13), value: 45281 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 19), value: -63954 },
];

export const sparklineTimeSeriesData = [
	{ group: 'Dataset 1', date: 1558453260000, value: 2 },
	{ group: 'Dataset 1', date: 1558453320000, value: 3 },
	{ group: 'Dataset 1', date: 1558453380000, value: 5 },
	{ group: 'Dataset 1', date: 1558453440000, value: 1 },
	{ group: 'Dataset 1', date: 1558453500000, value: 4 },
	{ group: 'Dataset 1', date: 1558453560000, value: 4 },
	{ group: 'Dataset 1', date: 1558453620000, value: 3 },
	{ group: 'Dataset 1', date: 1558453680000, value: 4 },
	{ group: 'Dataset 1', date: 1558453740000, value: 2 },
	{ group: 'Dataset 1', date: 1558453800000, value: 0 },
	{ group: 'Dataset 1', date: 1558453860000, value: 5 },
	{ group: 'Dataset 1', date: 1558453920000, value: 5 },
	{ group: 'Dataset 1', date: 1558453980000, value: 6 },
	{ group: 'Dataset 1', date: 1558454040000, value: 2 },
	{ group: 'Dataset 1', date: 1558454100000, value: 3 },
	{ group: 'Dataset 1', date: 1558454160000, value: 6 },
	{ group: 'Dataset 1', date: 1558454280000, value: 2 },
	{ group: 'Dataset 1', date: 1558454340000, value: 6 },
	{ group: 'Dataset 1', date: 1558454400000, value: 0 },
	{ group: 'Dataset 1', date: 1558454460000, value: 3 },
	{ group: 'Dataset 1', date: 1558454520000, value: 2 },
	{ group: 'Dataset 1', date: 1558454580000, value: 4 },
	{ group: 'Dataset 1', date: 1558454640000, value: 3 },
	{ group: 'Dataset 1', date: 1558454700000, value: 4 },
	{ group: 'Dataset 1', date: 1558454760000, value: 2 },
	{ group: 'Dataset 1', date: 1558454820000, value: 4 },
	{ group: 'Dataset 1', date: 1558454880000, value: 1 },
	{ group: 'Dataset 1', date: 1558454940000, value: 1 },
	{ group: 'Dataset 1', date: 1558455000000, value: 3 },
	{ group: 'Dataset 1', date: 1558455060000, value: 2 },
];

export const areaTimeSeriesCurvedOptions = {
	title: 'Area (time series - natural curve)',
	axes: {
		bottom: {
			title: '2019 Annual Sales Figures',
			mapsTo: 'date',
			scaleType: 'time',
		},
		left: {
			mapsTo: 'value',
			scaleType: 'linear',
		},
	},
	curve: 'curveNatural',
};

export const sparklineOptions = {
	title: 'Sparkline (modified area chart)',
	height: '150px',
	grid: {
		x: {
			enabled: false,
		},
		y: {
			enabled: false,
		},
	},
	axes: {
		bottom: {
			visible: false,
			title: '2019 Annual Sales Figures',
			mapsTo: 'date',
			scaleType: 'time',
		},
		left: {
			visible: false,
			mapsTo: 'value',
			scaleType: 'linear',
		},
	},
	color: {
		gradient: {
			enabled: true,
		},
	},
	points: {
		enabled: false,
	},
	legend: {
		enabled: false,
	},
};

export const stackedAreaTimeSeriesData = [
	{ group: 'Dataset 1', date: new Date(2019, 0, 1), value: 10000 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 5), value: 65000 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 8), value: 10000 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 13), value: 49213 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 17), value: 51213 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 1), value: 20000 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 5), value: 25000 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 8), value: 60000 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 13), value: 30213 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 17), value: 55213 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 1), value: 30000 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 5), value: 20000 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 8), value: 40000 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 13), value: 60213 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 17), value: 25213 },
];

export const stackedAreaTimeSeriesOptions = {
	title: 'Stacked area (time series)',
	axes: {
		left: {
			stacked: true,
			scaleType: 'linear',
			mapsTo: 'value',
		},
		bottom: {
			scaleType: 'time',
			mapsTo: 'date',
		},
	},
	curve: 'curveMonotoneX',
};

export const stackedAreaTimeSeriesUnevenData = [
	{ group: 'Dataset 1', date: new Date(2019, 0, 1), value: 10000 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 8), value: 10000 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 13), value: 49213 },
	{ group: 'Dataset 1', date: new Date(2019, 0, 17), value: 51213 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 5), value: 25000 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 8), value: 60000 },
	{ group: 'Dataset 2', date: new Date(2019, 0, 17), value: 55213 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 1), value: 30000 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 5), value: 20000 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 8), value: 40000 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 13), value: 60213 },
	{ group: 'Dataset 3', date: new Date(2019, 0, 17), value: 25213 },
];

export const stackedAreaTimeSeriesUnevenDataOptions = {
	title: 'Stacked area (time series with uneven data)',
	axes: {
		left: {
			stacked: true,
		},
		bottom: {
			scaleType: 'time',
			mapsTo: 'date',
		},
	},
	curve: 'curveMonotoneX',
};

export const stackedAreaPercentageTimeSeriesOptions = {
	title: 'Stacked area (percentage)',
	axes: {
		left: {
			stacked: true,
			percentage: true,
			ticks: {
				formatter: (d) => `${d}%`,
			},
		},
		bottom: {
			scaleType: 'time',
			mapsTo: 'date',
		},
	},
	curve: 'curveMonotoneX',
};

export const boundedAreaTimeSeriesData = [
	{
		group: 'Dataset 1',
		date: new Date(2019, 0, 1),
		value: 47263,
		min: 40000,
		max: 50000,
	},
	{
		group: 'Dataset 1',
		date: new Date(2019, 0, 5),
		value: 14178,
		min: 10000,
		max: 20000,
	},
	{
		group: 'Dataset 1',
		date: new Date(2019, 0, 8),
		value: 23094,
		min: 10000,
		max: 25000,
	},
	{
		group: 'Dataset 1',
		date: new Date(2019, 0, 13),
		value: 45281,
		min: 42000,
		max: 50000,
	},
	{
		group: 'Dataset 1',
		date: new Date(2019, 0, 19),
		value: -63954,
		min: -70000,
		max: -10000,
	},
];

export const boundedAreaTimeSeriesOptions = {
	title: 'Bounded area (time series - natural curve)',
	legend: {
		enabled: false,
	},
	bounds: {
		upperBoundMapsTo: 'max',
		lowerBoundMapsTo: 'min',
	},
	axes: {
		bottom: {
			title: '2019 Annual Sales Figures',
			mapsTo: 'date',
			scaleType: 'time',
		},
		left: {
			mapsTo: 'value',
			scaleType: 'linear',
		},
	},
	curve: 'curveNatural',
};

export const boundedAreaTimeSeriesWithHighlightsOptions = {
	title: 'Bounded area (time series - natural curve)',
	legend: {
		enabled: false,
	},
	bounds: {
		upperBoundMapsTo: 'max',
		lowerBoundMapsTo: 'min',
	},
	axes: {
		bottom: {
			title: '2019 Annual Sales Figures',
			mapsTo: 'date',
			scaleType: 'time',
			highlights: {
				highlightStartMapsTo: 'startHighlight',
				highlightEndMapsTo: 'endHighlight',
				labelMapsTo: 'label',
				data: [
					{
						startHighlight: new Date(2019, 0, 7),
						label: 'Custom formatter',
						endHighlight: new Date(2019, 0, 8),
					},
					{
						startHighlight: new Date(2019, 0, 13),
						label: 'Custom formatter',
						endHighlight: new Date(2019, 0, 14),
					},
				],
			},
		},
		left: {
			mapsTo: 'value',
			scaleType: 'linear',
		},
	},
	curve: 'curveNatural',
};

export const boundedAreaTimeSeriesWithHighlightsZoomOptions = addZoomBarToOptions(
	Object.assign({}, boundedAreaTimeSeriesWithHighlightsOptions)
);

// area - empty state
export const areaEmptyData = [];
export const areaEmptyOptions = {
	title: 'Area (empty state)',
	axes: {
		left: {},
		bottom: {
			scaleType: 'labels',
		},
	},
};

// area - loading skeleton
export const areaSkeletonData = boundedAreaTimeSeriesData;
export const areaSkeletonOptions = {
	title: 'Area (skeleton)',
	bounds: {
		upperBoundMapsTo: 'max',
		lowerBoundMapsTo: 'min',
	},
	axes: {
		bottom: {
			title: '2019 Annual Sales Figures',
			mapsTo: 'date',
			scaleType: 'time',
		},
		left: {
			mapsTo: 'value',
			scaleType: 'linear',
		},
	},
	curve: 'curveNatural',
	data: {
		loading: true,
	},
};
