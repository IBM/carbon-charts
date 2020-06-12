import { pieData } from "./pie";

export const donutData = pieData;

export const donutOptions = {
	title: "Donut",
	resizable: true,
	donut: {
		center: {
			label: "Browsers"
		}
	}
};

// donut - empty state
export const donutEmptyStateData = [];
export const donutEmptyStateOptions = {
	title: "Donut (empty state)",
	resizable: true,
	donut: {
		center: {
			label: "Browsers"
		}
	}
};

// donut - skeleton
export const donutSkeletonData = [];
export const donutSkeletonOptions = {
	title: "Donut (skeleton)",
	resizable: true,
	donut: {
		center: {
			label: "Browsers"
		}
	},
	data: {
		loading: true
	}
};
