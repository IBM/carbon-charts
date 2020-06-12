import trLocaleObject from "date-fns/locale/tr/index";

export const groupedBarData = [
	{ group: "Dataset 1", key: "Qty", value: 65000 },
	{ group: "Dataset 1", key: "More", value: -29123 },
	{ group: "Dataset 1", key: "Sold", value: -35213 },
	{ group: "Dataset 1", key: "Restocking", value: 51213 },
	{ group: "Dataset 1", key: "Misc", value: 16932 },
	{ group: "Dataset 2", key: "Qty", value: 32432 },
	{ group: "Dataset 2", key: "More", value: -21312 },
	{ group: "Dataset 2", key: "Sold", value: -56456 },
	{ group: "Dataset 2", key: "Restocking", value: -21312 },
	{ group: "Dataset 2", key: "Misc", value: 34234 },
	{ group: "Dataset 3", key: "Qty", value: -12312 },
	{ group: "Dataset 3", key: "More", value: 23232 },
	{ group: "Dataset 3", key: "Sold", value: 34232 },
	{ group: "Dataset 3", key: "Restocking", value: -12312 },
	{ group: "Dataset 3", key: "Misc", value: -34234 },
	{ group: "Dataset 4", key: "Qty", value: -32423 },
	{ group: "Dataset 4", key: "More", value: 21313 },
	{ group: "Dataset 4", key: "Sold", value: 64353 },
	{ group: "Dataset 4", key: "Restocking", value: 24134 },
	{ group: "Dataset 4", key: "Misc", value: 24134 }
];

export const groupedBarOptions = {
	title: "Grouped bar (discrete)",
	axes: {
		left: {
			mapsTo: "value"
		},
		bottom: {
			scaleType: "labels",
			mapsTo: "key"
		}
	}
};

// Horizontal Grouped
export const groupedHorizontalBarData = groupedBarData;

export const groupedHorizontalBarOptions = {
	title: "Grouped horizontal bar (discrete)",
	axes: {
		left: {
			scaleType: "labels",
			mapsTo: "key"
		},
		bottom: {
			mapsTo: "value"
		}
	}
};

// Simple bar
export const simpleBarData = [
	{ group: "Qty", value: 65000 },
	{ group: "More", value: 29123 },
	{ group: "Sold", value: 35213 },
	{ group: "Restocking", value: 51213 },
	{ group: "Misc", value: 16932 }
];

export const simpleBarOptions = {
	title: "Simple bar (discrete)",
	axes: {
		left: {
			mapsTo: "value"
		},
		bottom: {
			mapsTo: "group",
			scaleType: "labels"
		}
	}
};

export const simpleBarFixedDomainOptions = {
	title: "Simple bar (customized domain)",
	axes: {
		left: {
			mapsTo: "value",
			domain: [-100000, 100000]
		},
		bottom: {
			scaleType: "labels",
			mapsTo: "group"
		}
	}
};

// Horizontal Simple
export const simpleHorizontalBarData = simpleBarData;

export const simpleHorizontalBarOptions = {
	title: "Simple horizontal bar (discrete)",
	axes: {
		left: {
			mapsTo: "group",
			scaleType: "labels"
		},
		bottom: {
			mapsTo: "value"
		}
	}
};

export const simpleBarTimeSeriesData = [
	{ group: "Qty", date: new Date(2019, 0, 1), value: 10000 },
	{ group: "More", date: new Date(2019, 0, 2), value: 65000 },
	{ group: "Sold", date: new Date(2019, 0, 3), value: 30000 },
	{ group: "Restocking", date: new Date(2019, 0, 6), value: 49213 },
	{ group: "Misc", date: new Date(2019, 0, 7), value: 51213 }
];

export const simpleBarTimeSeriesOptions = {
	title: "Simple bar (time series - Turkish)",
	axes: {
		left: {
			mapsTo: "value"
		},
		bottom: {
			mapsTo: "date",
			scaleType: "time"
		}
	},
	timeScale: { localeObject: trLocaleObject }
};

// Horizontal simple time series
export const simpleHorizontalBarTimeSeriesOptions = {
	title: "Simple horizontal bar (time series)",
	axes: {
		left: {
			mapsTo: "date",
			scaleType: "time"
		},
		bottom: {
			mapsTo: "value"
		}
	}
};

export const simpleHorizontalBarTimeSeriesData = simpleBarTimeSeriesData;

// Stacked bar
export const stackedBarData = [
	{ group: "Dataset 1", key: "Qty", value: 65000 },
	{ group: "Dataset 1", key: "More", value: 29123 },
	{ group: "Dataset 1", key: "Sold", value: 35213 },
	{ group: "Dataset 1", key: "Restocking", value: 51213 },
	{ group: "Dataset 1", key: "Misc", value: 16932 },
	{ group: "Dataset 2", key: "Qty", value: 32432 },
	{ group: "Dataset 2", key: "More", value: 21312 },
	{ group: "Dataset 2", key: "Sold", value: 56456 },
	{ group: "Dataset 2", key: "Restocking", value: 21312 },
	{ group: "Dataset 2", key: "Misc", value: 34234 },
	{ group: "Dataset 3", key: "Qty", value: 12312 },
	{ group: "Dataset 3", key: "More", value: 23232 },
	{ group: "Dataset 3", key: "Sold", value: 34232 },
	{ group: "Dataset 3", key: "Restocking", value: 12312 },
	{ group: "Dataset 3", key: "Misc", value: 34234 },
	{ group: "Dataset 4", key: "Qty", value: 32423 },
	{ group: "Dataset 4", key: "More", value: 21313 },
	{ group: "Dataset 4", key: "Sold", value: 64353 },
	{ group: "Dataset 4", key: "Restocking", value: 24134 },
	{ group: "Dataset 4", key: "Misc", value: 32423 }
];

export const stackedBarOptions = {
	title: "Stacked bar (discrete)",
	axes: {
		left: {
			mapsTo: "value",
			stacked: true
		},
		bottom: {
			mapsTo: "key",
			scaleType: "labels"
		}
	}
};

// horizontal stacked bar
export const stackedHorizontalBarData = stackedBarData;

export const stackedHorizontalBarOptions = {
	title: "Stacked horizontal bar (discrete)",
	axes: {
		left: {
			scaleType: "labels"
		},
		bottom: {
			stacked: true
		}
	}
};

export const stackedBarTimeSeriesData = [
	{ group: "Dataset 1", date: new Date(2019, 0, 1), value: 10000 },
	{ group: "Dataset 1", date: new Date(2019, 0, 5), value: 65000 },
	{ group: "Dataset 1", date: new Date(2019, 0, 8), value: 10000 },
	{ group: "Dataset 1", date: new Date(2019, 0, 13), value: 49213 },
	{ group: "Dataset 1", date: new Date(2019, 0, 17), value: 51213 },
	{ group: "Dataset 2", date: new Date(2019, 0, 3), value: 75000 },
	{ group: "Dataset 2", date: new Date(2019, 0, 6), value: 57312 },
	{ group: "Dataset 2", date: new Date(2019, 0, 8), value: 21432 },
	{ group: "Dataset 2", date: new Date(2019, 0, 15), value: 70323 },
	{ group: "Dataset 2", date: new Date(2019, 0, 19), value: 21300 },
	{ group: "Dataset 3", date: new Date(2019, 0, 1), value: 50000 },
	{ group: "Dataset 3", date: new Date(2019, 0, 5), value: 15000 },
	{ group: "Dataset 3", date: new Date(2019, 0, 8), value: 20000 },
	{ group: "Dataset 3", date: new Date(2019, 0, 13), value: 39213 },
	{ group: "Dataset 3", date: new Date(2019, 0, 17), value: 61213 },
	{ group: "Dataset 4", date: new Date(2019, 0, 2), value: 10 },
	{ group: "Dataset 4", date: new Date(2019, 0, 6), value: 37312 },
	{ group: "Dataset 4", date: new Date(2019, 0, 8), value: 51432 },
	{ group: "Dataset 4", date: new Date(2019, 0, 15), value: 40323 },
	{ group: "Dataset 4", date: new Date(2019, 0, 19), value: 31300 }
];

export const stackedBarTimeSeriesOptions = {
	title: "Stacked bar (time series)",
	axes: {
		left: {
			mapsTo: "value",
			stacked: true
		},
		bottom: {
			mapsTo: "date",
			scaleType: "time"
		}
	}
};

// Stacked horizontal bar (time series)
export const stackedHorizontalBarTimeSeriesOptions = {
	title: "Stacked horizontal bar (time series)",
	axes: {
		left: {
			scaleType: "time"
		},
		bottom: {
			stacked: true
		}
	}
};

export const stackedHorizontalBarTimeSeriesData = stackedBarTimeSeriesData;

// simple bar - empty state
export const simpleBarEmptyStateData = [];
export const simpleBarEmptyStateOptions = {
	title: "Simple bar (empty state)",
	axes: {
		left: {
			primary: true
		},
		bottom: {
			scaleType: "labels",
			secondary: true
		}
	}
};

// simple bar - skeleton
export const simpleBarSkeletonData = [];
export const simpleBarSkeletonOptions = {
	title: "Simple bar (skeleton)",
	axes: {
		left: {
			primary: true
		},
		bottom: {
			scaleType: "labels",
			secondary: true
		}
	},
	data: {
		loading: true
	}
};

// grouped bar - empty state
export const groupedBarEmptyStateData = [];
export const groupedBarEmptyStateOptions = {
	title: "Grouped bar (empty state)",
	axes: {
		left: {
			primary: true
		},
		bottom: {
			scaleType: "labels",
			secondary: true
		}
	}
};

// grouped bar - skeleton
export const groupedBarSkeletonData = [];
export const groupedBarSkeletonOptions = {
	title: "Grouped bar (skeleton)",
	axes: {
		left: {
			primary: true
		},
		bottom: {
			scaleType: "labels",
			secondary: true
		}
	},
	data: {
		loading: true
	}
};

// stacked bar - empty state
export const stackedBarEmptyStateData = [];
export const stackedBarEmptyStateOptions = {
	title: "Stacked bar (empty state)",
	axes: {
		left: {
			primary: true
		},
		bottom: {
			scaleType: "labels",
			secondary: true
		}
	}
};

// stacked bar - skeleton
export const stackedBarSkeletonData = [];
export const stackedBarSkeletonOptions = {
	title: "Stacked bar (skeleton)",
	axes: {
		left: {
			primary: true
		},
		bottom: {
			scaleType: "labels",
			secondary: true
		}
	},
	data: {
		loading: true
	}
};

// simple horizontal bar - empty state
export const simpleHorizontalBarEmptyStateData = [];
export const simpleHorizontalBarEmptyStateOptions = {
	title: "Simple horizontal bar (empty state)",
	axes: {
		left: {
			primary: true,
			scaleType: "labels"
		},
		bottom: {
			secondary: true
		}
	}
};

// simple horizontal bar - skeleton
export const simpleHorizontalBarSkeletonData = [];
export const simpleHorizontalBarSkeletonOptions = {
	title: "Simple horizontal bar (skeleton)",
	axes: {
		left: {
			primary: true,
			scaleType: "labels"
		},
		bottom: {
			secondary: true
		}
	},
	data: {
		loading: true
	}
};

// grouped horizontal bar - empty state
export const groupedHorizontalBarEmptyStateData = [];
export const groupedHorizontalBarEmptyStateOptions = {
	title: "Grouped horizontal bar (empty state)",
	axes: {
		left: {
			primary: true,
			scaleType: "labels"
		},
		bottom: {
			secondary: true
		}
	}
};

// grouped horizontal bar - skeleton
export const groupedHorizontalBarSkeletonData = [];
export const groupedHorizontalBarSkeletonOptions = {
	title: "Grouped horizontal bar (skeleton)",
	axes: {
		left: {
			primary: true,
			scaleType: "labels"
		},
		bottom: {
			secondary: true
		}
	},
	data: {
		loading: true
	}
};

// stacked horizontal bar - empty state
export const stackedHorizontalBarEmptyStateData = [];
export const stackedHorizontalBarEmptyStateOptions = {
	title: "Stacked horizontal bar (empty state)",
	axes: {
		left: {
			primary: true,
			scaleType: "labels"
		},
		bottom: {
			secondary: true
		}
	}
};

// stacked horizontal bar - skeleton
export const stackedHorizontalBarSkeletonData = [];
export const stackedHorizontalBarSkeletonOptions = {
	title: "Stacked horizontal bar (skeleton)",
	axes: {
		left: {
			primary: true,
			scaleType: "labels"
		},
		bottom: {
			secondary: true
		}
	},
	data: {
		loading: true
	}
};
