export const heatmapData = [
	{
		group: "A",
		hour: "2019-01-01T15:00:00.000Z",
		value: 18
	},
	{
		group: "A",
		hour: "2019-01-01T16:00:00.000Z",
		value: 18
	},
	{
		group: "A",
		hour: "2019-01-01T17:00:00.000Z",
		value: 18
	},
	{
		group: "A",
		hour: "2019-01-01T18:00:00.000Z",
		value: 18
	},
	{
		group: "A",
		hour: "2019-01-01T19:00:00.000Z",
		value: 18
	},
	{
		group: "A",
		hour: "2019-01-01T20:00:00.000Z",
		value: 18
	},
	{
		group: "A",
		hour: "2019-01-01T21:00:00.000Z",
		value: 18
	}
];

export const heatmapOptions = {
	title: "Heatmap",
	axes: {
		bottom: {
			title: "Hour",
			mapsTo: "hour",
			scaleType: "time",
			ticks: {
				formatter: (t, i, defaultFormattedValue) => {
					const commaIndex = defaultFormattedValue.indexOf(", ");
					if (commaIndex === -1) {
						return defaultFormattedValue;
					}

					return defaultFormattedValue.slice(commaIndex + 2);
				}
			}
		},
		left: {
			title: "Category",
			mapsTo: "value",
			ticks: {
				values: [0, 20],
				formatter: (d) => `A${d * 5}`
			}
		}
	},
	timeScale: {
		addSpaceOnEdges: 0,
		showDayName: false
	},
	legend: {
		enabled: false
	}
};
