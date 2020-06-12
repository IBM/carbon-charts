import { Tools } from "@carbon/charts/tools";

import {
	lineData,
	lineOptions,
	lineTimeSeriesData,
	lineTimeSeriesOptions
} from "./line";

export const stepOptions = Tools.merge({}, lineOptions, {
	title: "Step (discrete)",
	curve: "curveStepAfter"
});

export const stepData = lineData;

export const stepTimeSeriesOptions = Tools.merge({}, lineTimeSeriesOptions, {
	title: "Step (time series)",
	curve: "curveStepAfter"
});

export const stepTimeSeriesData = lineTimeSeriesData;

// step - empty state
export const stepEmptyStateData = [];
export const stepEmptyStateOptions = Tools.merge({}, lineTimeSeriesOptions, {
	title: "Step (empty state)",
	curve: "curveStepAfter"
});

// step - skeleton
export const stepSkeletonData = [];
export const stepSkeletonOptions = Tools.merge({}, lineTimeSeriesOptions, {
	title: "Step (skeleton)",
	curve: "curveStepAfter",
	data: {
		loading: true
	}
});
