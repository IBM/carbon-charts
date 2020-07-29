// simple radar
export const radarData = [
	{ product: "Product 1", feature: "Price", score: 60 },
	{ product: "Product 1", feature: "Usability", score: 92 },
	{ product: "Product 1", feature: "Availability", score: 5 },
	{ product: "Product 1", feature: "Performance", score: 85 },
	{ product: "Product 1", feature: "Quality", score: 60 },
	{ product: "Product 2", feature: "Price", score: 70 },
	{ product: "Product 2", feature: "Usability", score: 63 },
	{ product: "Product 2", feature: "Availability", score: 78 },
	{ product: "Product 2", feature: "Performance", score: 50 },
	{ product: "Product 2", feature: "Quality", score: 30 }
];
export const radarOptions = {
	title: "Radar",
	radar: {
		axes: {
			angle: "feature",
			value: "score"
		}
	},
	data: {
		groupMapsTo: "product"
	}
};

export const radarCenteredData = radarData;

export const radarCenteredOptions = {
	title: "Radar (centered)",
	radar: {
		axes: {
			angle: "feature",
			value: "score"
		},
		alignment: "center"
	},
	data: {
		groupMapsTo: "product"
	},
	legend: {
		alignment: "center"
	}
};

// radar with missing data
export const radarWithMissingDataData = [
	{ group: "Sugar", key: "London", value: 25 },
	{ group: "Oil", key: "London", value: 6 },
	{ group: "Water", key: "London", value: 12 },
	{ group: "Sugar", key: "Milan", value: 13 },
	{ group: "Oil", key: "Milan", value: 6 },
	{ group: "Water", key: "Milan", value: 28 },
	{ group: "Sugar", key: "Paris", value: 19 },
	{ group: "Oil", key: "Paris", value: 16 },
	{ group: "Water", key: "Paris", value: 10 },
	{ group: "Sugar", key: "New York", value: 11 },
	{ group: "Oil", key: "New York", value: 18 },
	{ group: "Water", key: "New York", value: 8 },
	{ group: "Sugar", key: "Sydney", value: 12 },
	{ group: "Oil", key: "Sydney", value: 16 }
];
export const radarWithMissingDataOptions = {
	title: "Radar - Missing datapoints"
};

// radar dense
export const radarDenseData = [
	{ month: "January", activity: "Eating", hoursAvg: 2 },
	{ month: "January", activity: "Drinking", hoursAvg: 6 },
	{ month: "January", activity: "Sleeping", hoursAvg: 6 },
	{ month: "January", activity: "Working", hoursAvg: 8 },
	{ month: "January", activity: "Walking", hoursAvg: 1 },
	{ month: "January", activity: "Running", hoursAvg: 0.5 },
	{ month: "January", activity: "Cycling", hoursAvg: 1 },
	{ month: "January", activity: "Swimming", hoursAvg: 0 },
	{ month: "February", activity: "Eating", hoursAvg: 1.5 },
	{ month: "February", activity: "Drinking", hoursAvg: 9 },
	{ month: "February", activity: "Sleeping", hoursAvg: 7 },
	{ month: "February", activity: "Working", hoursAvg: 9 },
	{ month: "February", activity: "Walking", hoursAvg: 2 },
	{ month: "February", activity: "Running", hoursAvg: 2 },
	{ month: "February", activity: "Cycling", hoursAvg: 0 },
	{ month: "February", activity: "Swimming", hoursAvg: 1.5 },
	{ month: "March", activity: "Eating", hoursAvg: 3 },
	{ month: "March", activity: "Drinking", hoursAvg: 5 },
	{ month: "March", activity: "Sleeping", hoursAvg: 5 },
	{ month: "March", activity: "Working", hoursAvg: 6 },
	{ month: "March", activity: "Walking", hoursAvg: 3 },
	{ month: "March", activity: "Running", hoursAvg: 9 },
	{ month: "March", activity: "Cycling", hoursAvg: 1 },
	{ month: "March", activity: "Swimming", hoursAvg: 7 },
	{ month: "April", activity: "Eating", hoursAvg: 5 },
	{ month: "April", activity: "Drinking", hoursAvg: 1 },
	{ month: "April", activity: "Sleeping", hoursAvg: 4 },
	{ month: "April", activity: "Working", hoursAvg: 2 },
	{ month: "April", activity: "Walking", hoursAvg: 5 },
	{ month: "April", activity: "Running", hoursAvg: 4 },
	{ month: "April", activity: "Cycling", hoursAvg: 6 },
	{ month: "April", activity: "Swimming", hoursAvg: 3 },
	{ month: "May", activity: "Eating", hoursAvg: 7 },
	{ month: "May", activity: "Drinking", hoursAvg: 0 },
	{ month: "May", activity: "Sleeping", hoursAvg: 5 },
	{ month: "May", activity: "Working", hoursAvg: 4 },
	{ month: "May", activity: "Walking", hoursAvg: 8 },
	{ month: "May", activity: "Running", hoursAvg: 2 },
	{ month: "May", activity: "Cycling", hoursAvg: 3 },
	{ month: "May", activity: "Swimming", hoursAvg: 1 }
];
export const radarDenseOptions = {
	title: "Radar - Dense",
	radar: {
		axes: {
			angle: "activity",
			value: "hoursAvg"
		}
	},
	data: {
		groupMapsTo: "month"
	}
};
