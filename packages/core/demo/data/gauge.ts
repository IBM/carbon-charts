export const gaugeData = [
	{ group: "Dataset", key: "current", value: 85 },
	{ group: "Dataset", key: "old", value: 100 },
	{ group: "Dataset", key: "total", value: 200 }
];

export const gaugeOptionsSemi = {
	title: "Gauge semicircular",
	resizable: true,
	height: "250px",
	gauge: {
		arcRatio: 0.5
	}
};

export const gaugeOptionsCircular = {
	title: "Gauge circular",
	resizable: true,
	height: "250px",
	gauge: {
		arcRatio: 1
	}
};
