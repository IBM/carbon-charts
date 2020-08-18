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

export const groupedBarSelectedGroupsData = groupedBarData;

// Grouped bar with selected groups option
export const groupedBarSelectedGroupsOptions = {
	title: "Grouped bar (selected groups)",
	data: {
		selectedGroups: ["Dataset 1", "Dataset 3"]
	},
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

export const simpleBarCustomLegendOrderOptions = {
	title: "Simple bar (custom legend order)",
	axes: {
		left: {
			mapsTo: "value"
		},
		bottom: {
			mapsTo: "group",
			scaleType: "labels"
		}
	},
	legend: {
		order: ["Restocking", "Misc", "Sold", "Qty", "More"]
	}
};

// Simple bar with custom tick values
export const simpleBarDataCustomTicks = [
	{ group: "Group 1", value: 0.5 },
	{ group: "Group 2", value: 2 }
];

export const simpleBarOptionsCustomTicks = {
	title: "Simple bar (custom ticks)",
	axes: {
		left: {
			mapsTo: "value",
			ticks: {
				values: [0, 1.2, 1.3, 2]
			}
		},
		bottom: {
			mapsTo: "group",
			scaleType: "labels"
		}
	}
};

export const simpleBarCenteredLegendData = simpleBarData;

export const simpleBarCenteredLegendOptions = {
	title: "Simple bar (centered legend)",
	axes: {
		left: {
			mapsTo: "value"
		},
		bottom: {
			mapsTo: "group",
			scaleType: "labels"
		}
	},
	legend: {
		alignment: "center"
	}
};

// Simple bar with long labels
export const simpleBarLongLabelData = [
	{
		group:
			"6591DA8668C339B1B39297C61091E320C35391AB7AFC15B469F96B8A2DD0C231",
		value: 65000
	},
	{
		group:
			"347FEDE2F7403759069E5F84B65B49D2467D8914B5184738699259AA310EB0F9",
		value: 29123
	},
	{
		group:
			"232D788298773BB389DBB8FCE44D3FB4E878879BE7AFB0B303BCE0D56EBB92E2",
		value: 35213
	},
	{
		group:
			"58B01AADFA87E5547A218B3C6CE3AF07B8DF7BAB9E12BF60FD2BBB739C46B86E",
		value: 51213
	},
	{ group: "Qty", value: 16932 }
];

export const simpleBarLongLabelOptions = {
	title: "Simple bar (truncated labels)",
	axes: {
		left: {
			mapsTo: "value"
		},
		bottom: {
			mapsTo: "group",
			scaleType: "labels"
		}
	},
	legend: {
		truncation: {
			type: "end_line",
			threshold: 10,
			numCharacter: 12
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
export const simpleHorizontalBarLongLabelData = simpleBarLongLabelData;

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

export const simpleHorizontalBarCenteredLegendData = simpleBarData;

export const simpleHorizontalBarCenteredLegendOptions = {
	title: "Simple horizontal bar (centered legend)",
	axes: {
		left: {
			mapsTo: "group",
			scaleType: "labels"
		},
		bottom: {
			mapsTo: "value"
		}
	},
	legend: {
		alignment: "center"
	}
};

export const simpleHorizontalBarLongLabelOptions = {
	title: "Simple horizontal bar (truncated labels)",
	axes: {
		left: {
			mapsTo: "group",
			scaleType: "labels",
			truncation: {
				type: "mid_line",
				threshold: 10,
				numCharacter: 14
			}
		},
		bottom: {
			mapsTo: "value"
		}
	},
	legend: {
		truncation: {
			type: "mid_line",
			threshold: 15,
			numCharacter: 12
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

export const simpleBarTimeSeriesDenseData = [
	{ group: "data", date: new Date(2019, 1, 1, 10, 10, 0), value: 10000 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 12, 4), value: 20001 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 14, 8), value: 10002 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 15, 8), value: 10062 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 17, 12), value: 30003 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 18, 16), value: 20004 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 19, 20), value: 10005 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 22, 24), value: 50006 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 24, 24), value: 20006 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 26, 28), value: 40007 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 27, 32), value: 30008 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 30, 36), value: 10000 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 32, 36), value: 10000 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 35, 40), value: 20000 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 36, 44), value: 10000 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 37, 48), value: 30000 },
	{ group: "data", date: new Date(2019, 1, 1, 10, 40, 52), value: 10000 }
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

// Vertical simple time series with dense data
export const simpleBarTimeSeriesDenseOptions = {
	title: "Simple bar (time series) with dense data",
	axes: {
		left: {
			mapsTo: "value"
		},
		bottom: {
			mapsTo: "date",
			scaleType: "time"
		}
	},
	timeScale: { localeObject: trLocaleObject },
	bars: { maxWidth: 200 }
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

// demo with custom ticks
export const stackedBarTimeSeriesDataCustomTicks = stackedBarTimeSeriesData;

export const stackedBarTimeSeriesOptionsCustomTicks = {
	title: "Stacked bar (time series - custom ticks)",
	axes: {
		left: {
			mapsTo: "value",
			stacked: true
		},
		bottom: {
			mapsTo: "date",
			scaleType: "time",
			ticks: {
				values: [new Date(2019, 0, 17)]
			}
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
		left: {},
		bottom: {
			scaleType: "labels"
		}
	}
};

// simple bar - skeleton
export const simpleBarSkeletonData = [];
export const simpleBarSkeletonOptions = {
	title: "Simple bar (skeleton)",
	axes: {
		left: {},
		bottom: {
			scaleType: "labels"
		}
	},
	data: {
		loading: true
	}
};

// simple bar - error
export const simpleBarErrorData = [];
export const simpleBarErrorOptions = {
	title: "Simple bar (error)",
	axes: {
		left: {},
		bottom: {
			scaleType: "labels"
		}
	},
	data: {
		loading: false,
		error: {
			title: "No data available",
			subtitle: "Lorem ipsum dolor sit."
		}
	}
};

// grouped bar - empty state
export const groupedBarEmptyStateData = [];
export const groupedBarEmptyStateOptions = {
	title: "Grouped bar (empty state)",
	axes: {
		left: {},
		bottom: {
			scaleType: "labels"
		}
	}
};

// grouped bar - skeleton
export const groupedBarSkeletonData = [];
export const groupedBarSkeletonOptions = {
	title: "Grouped bar (skeleton)",
	axes: {
		left: {},
		bottom: {
			scaleType: "labels"
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
		left: {},
		bottom: {
			scaleType: "labels"
		}
	}
};

// stacked bar - skeleton
export const stackedBarSkeletonData = [];
export const stackedBarSkeletonOptions = {
	title: "Stacked bar (skeleton)",
	axes: {
		left: {},
		bottom: {
			scaleType: "labels"
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
			scaleType: "labels"
		},
		bottom: {}
	}
};

// simple horizontal bar - skeleton
export const simpleHorizontalBarSkeletonData = [];
export const simpleHorizontalBarSkeletonOptions = {
	title: "Simple horizontal bar (skeleton)",
	axes: {
		left: {
			scaleType: "labels"
		},
		bottom: {}
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
			scaleType: "labels"
		},
		bottom: {}
	}
};

// grouped horizontal bar - skeleton
export const groupedHorizontalBarSkeletonData = [];
export const groupedHorizontalBarSkeletonOptions = {
	title: "Grouped horizontal bar (skeleton)",
	axes: {
		left: {
			scaleType: "labels"
		},
		bottom: {}
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
			scaleType: "labels"
		},
		bottom: {}
	}
};

// stacked horizontal bar - skeleton
export const stackedHorizontalBarSkeletonData = [];
export const stackedHorizontalBarSkeletonOptions = {
	title: "Stacked horizontal bar (skeleton)",
	axes: {
		left: {
			scaleType: "labels"
		},
		bottom: {}
	},
	data: {
		loading: true
	}
};
