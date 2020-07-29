export const meterData = [
	{
		group: "Dataset 1",
		value: 56
	}
];

export const meterOptionsWithStatus = {
	title: "Meter Chart - with statuses",
	meter: {
		peak: 80,
		status: {
			ranges: [
				{ range: [0, 50], status: "success" },
				{ range: [50, 60], status: "warning" },
				{ range: [60, 100], status: "danger" }
			]
		}
	},
	height: "100px"
};

export const meterOptionsCustomColor = {
	title: "Meter Chart - statuses and custom color",
	meter: {
		peak: 70,
		status: {
			ranges: [
				{ range: [0, 40], status: "success" },
				{ range: [40, 60], status: "warning" },
				{ range: [60, 100], status: "danger" }
			]
		}
	},
	color: {
		scale: {
			"Dataset 1": "#925699"
		}
	},
	height: "100px"
};

export const meterOptionsNoStatus = {
	title: "Meter Chart - no status",
	meter: {
		peak: 70
	},
	height: "100px"
};
