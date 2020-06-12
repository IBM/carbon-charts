import { lineTimeSeriesData } from "./line";

export const bubbleDoubleLinearData = [
	{ group: "Dataset 1", sales: 10000, profit: 32100, surplus: 50000 },
	{ group: "Dataset 1", sales: 12000, profit: 23500, surplus: 34000 },
	{ group: "Dataset 1", sales: 14000, profit: 53100, surplus: 63000 },
	{ group: "Dataset 1", sales: 15000, profit: 42300, surplus: 43000 },
	{ group: "Dataset 1", sales: 16000, profit: 12300, surplus: 55000 },
	{ group: "Dataset 2", sales: 11000, profit: 12400, surplus: 25000 },
	{ group: "Dataset 2", sales: 13000, profit: 34500, surplus: 35000 },
	{ group: "Dataset 2", sales: 13500, profit: 23100, surplus: 55000 },
	{ group: "Dataset 2", sales: 15500, profit: 63200, surplus: 35000 },
	{ group: "Dataset 2", sales: 15750, profit: 24300, surplus: 64000 }
];

export const bubbleDoubleLinearOptions = {
	title: "Bubble (linear)",
	axes: {
		bottom: {
			title: "No. of employees",
			mapsTo: "sales",
			includeZero: false
		},
		left: {
			title: "Annual sales",
			mapsTo: "profit",
			includeZero: false
		}
	},
	bubble: {
		radiusMapsTo: "surplus"
	}
};

export const bubbleDiscreteData = [
	{ group: "Dataset 1", key: "Qty", value: 8000, surplus: 50000 },
	{ group: "Dataset 1", key: "More", value: 23500, surplus: 15000 },
	{ group: "Dataset 1", key: "Sold", value: 53100, surplus: 32000 },
	{ group: "Dataset 1", key: "Restocking", value: 42300, surplus: 53000 },
	{ group: "Dataset 1", key: "Misc", value: 12300, surplus: 34000 },
	{ group: "Dataset 2", key: "Qty", value: 34200, surplus: 23000 },
	{ group: "Dataset 2", key: "More", value: 53200, surplus: 31000 },
	{ group: "Dataset 2", key: "Sold", value: 42300, surplus: 13000 },
	{ group: "Dataset 2", key: "Restocking", value: 13400, surplus: 55000 },
	{ group: "Dataset 2", key: "Misc", value: 0, surplus: 12000 },
	{ group: "Dataset 3", key: "Qty", value: 41200, surplus: 32000 },
	{ group: "Dataset 3", key: "More", value: 18400, surplus: 12000 },
	{ group: "Dataset 3", key: "Sold", value: 34210, surplus: 18000 },
	{ group: "Dataset 3", key: "Restocking", value: 1400, surplus: 21000 },
	{ group: "Dataset 3", key: "Misc", value: 42100, surplus: 22000 },
	{ group: "Dataset 4", key: "Qty", value: 22000, surplus: 32000 },
	{ group: "Dataset 4", key: "More", value: 4000, surplus: 32000 },
	{ group: "Dataset 4", key: "Sold", value: 9000, surplus: 43000 },
	{ group: "Dataset 4", key: "Restocking", value: 24000, surplus: 43000 },
	{ group: "Dataset 4", key: "Misc", value: 7000, surplus: 21000 }
];

export const bubbleDiscreteOptions = {
	title: "Bubble (discrete)",
	axes: {
		bottom: {
			title: "2019 Annual Sales Figures",
			scaleType: "labels",
			mapsTo: "key"
		},
		left: {
			mapsTo: "value"
		}
	},
	bubble: {
		radiusMapsTo: "surplus"
	}
};

export const bubbleTimeSeriesData = lineTimeSeriesData.map((datum) =>
	Object.assign(datum, {
		surplus: 50000 * Math.random() * ((datum["value"] || 1) / 2)
	})
);

export const bubbleTimeSeriesOptions = {
	title: "Bubble (time series)",
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
	bubble: {
		radiusMapsTo: "surplus"
	}
};

// bubble - empty state
export const bubbleEmptyStateData = [];
export const bubbleEmptyStateOptions = {
	title: "Bubble (empty state)",
	axes: {
		bottom: {
			title: "No. of employees",
			mapsTo: "sales",
			includeZero: false
		},
		left: {
			title: "Annual sales",
			mapsTo: "profit",
			includeZero: false
		}
	},
	bubble: {
		radiusMapsTo: "surplus"
	}
};

// bubble - skeleton
export const bubbleSkeletonData = [];
export const bubbleSkeletonOptions = {
	title: "Bubble (skeleton)",
	axes: {
		bottom: {
			title: "No. of employees",
			mapsTo: "sales",
			includeZero: false
		},
		left: {
			title: "Annual sales",
			mapsTo: "profit",
			includeZero: false
		}
	},
	bubble: {
		radiusMapsTo: "surplus"
	},
	data: {
		loading: true
	}
};
