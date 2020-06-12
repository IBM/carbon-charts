import { lineTimeSeriesData } from "./line";

export const doubleLinearScatterData = [
	{ group: "Dataset 1", employees: 5000, sales: 32100 },
	{ group: "Dataset 1", employees: 3000, sales: 25100 },
	{ group: "Dataset 1", employees: 8000, sales: 12100 },
	{ group: "Dataset 1", employees: 4000, sales: 53100 },
	{ group: "Dataset 2", employees: 2000, sales: 34100 },
	{ group: "Dataset 2", employees: 4000, sales: 23100 },
	{ group: "Dataset 2", employees: 7000, sales: 14100 },
	{ group: "Dataset 2", employees: 6000, sales: 53100 }
];

export const doubleLinearScatterOptions = {
	title: "Scatter (linear x & y)",
	axes: {
		bottom: {
			title: "No. of employees",
			mapsTo: "employees",
			scaleType: "linear"
		},
		left: {
			title: "Annual sales",
			mapsTo: "sales",
			scaleType: "linear"
		}
	}
};

export const scatterDiscreteData = [
	{ group: "Dataset 1", key: "Qty", value: 32100 },
	{ group: "Dataset 1", key: "More", value: 23500 },
	{ group: "Dataset 1", key: "Sold", value: 53100 },
	{ group: "Dataset 1", key: "Restocking", value: 42300 },
	{ group: "Dataset 1", key: "Misc", value: 12300 },
	{ group: "Dataset 2", key: "Qty", value: 34200 },
	{ group: "Dataset 2", key: "More", value: 53200 },
	{ group: "Dataset 2", key: "Sold", value: 42300 },
	{ group: "Dataset 2", key: "Restocking", value: 21400 },
	{ group: "Dataset 2", key: "Misc", value: 0 },
	{ group: "Dataset 3", key: "Qty", value: 41200 },
	{ group: "Dataset 3", key: "More", value: 18400 },
	{ group: "Dataset 3", key: "Sold", value: 34210 },
	{ group: "Dataset 3", key: "Restocking", value: 1400 },
	{ group: "Dataset 3", key: "Misc", value: 42100 },
	{ group: "Dataset 4", key: "Qty", value: 22000 },
	{ group: "Dataset 4", key: "More", value: 1200 },
	{ group: "Dataset 4", key: "Sold", value: 9000 },
	{ group: "Dataset 4", key: "Restocking", value: 24000 },
	{ group: "Dataset 4", key: "Misc", value: 3000 }
];

export const scatterDiscreteOptions = {
	title: "Scatter (discrete)",
	axes: {
		bottom: {
			title: "2019 Annual Sales Figures",
			scaleType: "labels",
			mapsTo: "key"
		},
		left: {
			mapsTo: "value"
		}
	}
};

export const scatterTimeSeriesData = lineTimeSeriesData;

export const scatterTimeSeriesOptions = {
	title: "Scatter (time series)",
	axes: {
		bottom: {
			title: "2019 Annual Sales Figures",
			scaleType: "time",
			mapsTo: "date"
		},
		left: {
			mapsTo: "value"
		}
	}
};

// scatter - empty state
export const scatterEmptyStateData = [];
export const scatterEmptyStateOptions = {
	title: "Scatter (empty state)",
	axes: {
		bottom: {
			title: "2019 Annual Sales Figures",
			scaleType: "time",
			mapsTo: "date"
		},
		left: {
			mapsTo: "value"
		}
	}
};

// scatter - skeleton
export const scatterSkeletonData = [];
export const scatterSkeletonOptions = {
	title: "Scatter (skeleton)",
	axes: {
		bottom: {
			title: "2019 Annual Sales Figures",
			scaleType: "time",
			mapsTo: "date"
		},
		left: {
			mapsTo: "value"
		}
	},
	data: {
		loading: true
	}
};
