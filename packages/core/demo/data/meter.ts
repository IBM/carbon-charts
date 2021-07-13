export const meterData = [
	{
		group: 'Dataset 1',
		value: 56,
	},
];

export const meterOptionsWithStatus = {
	title: 'Meter Chart - with statuses',
	meter: {
		peak: 80,
		status: {
			ranges: [
				{ range: [0, 50], status: 'success' },
				{ range: [50, 60], status: 'warning' },
				{ range: [60, 100], status: 'danger' },
			],
		},
	},
	height: '100px',
};

export const meterOptionsCustomColor = {
	title: 'Meter Chart - statuses and custom color',
	meter: {
		peak: 70,
		status: {
			ranges: [
				{ range: [0, 40], status: 'success' },
				{ range: [40, 60], status: 'warning' },
				{ range: [60, 100], status: 'danger' },
			],
		},
	},
	color: {
		scale: {
			'Dataset 1': '#925699',
		},
	},
	height: '100px',
};

export const meterOptionsNoStatus = {
	title: 'Meter Chart - no status',
	meter: {
		peak: 70,
	},
	height: '100px',
};

export const propMeterData = [
	{ group: 'emails', value: 202 },
	{ group: 'photos', value: 654 },
	{ group: 'text messages', value: 723 },
	{ group: 'other', value: 120 },
];

export const propMeterOptions = {
	title: 'Proportional Meter Chart',
	height: '110px',
	meter: {
		proportional: {
			total: 2000,
			unit: 'GB',
		},
	},
	color: {
		pairing: {
			option: 2,
		},
	},
};

export const propMeterTruncationOptions = {
	title: 'Proportional Meter Chart (truncated)',
	height: '110px',
	meter: {
		proportional: {
			total: 2000,
			unit: 'MB',
			totalFormatter: (total) => `custom total string for: ${total}`,
			breakdownFormatter: (x) =>
				`You are using ${x.datasetsTotal} GB of the space this label is really long will need to be truncated with a tooltip Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
		},
	},
};
