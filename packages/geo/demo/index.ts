import {
	TiledMap
} from "../src/index";

// Styles
import "../src/styles/index.scss";
import "./index.scss";

// Functionality for demo options toolbar
import { initializeDemoOptions } from "./demo-options";

// Chart types
import { chartTypes } from "./chart-types";

initializeDemoOptions();

const charts = {};

const createChartContainer = chartType => {
	// Chart holder
	const holder = document.createElement("div");
	holder.className = "demo-chart-holder has-actions";
	holder.id = `classy-${chartType.id}-chart-holder`;

	document.body.appendChild(holder);

	// Chart demo actions container
	const chartDemoActions = document.createElement("div");
	chartDemoActions.className = "chart-demo-actions";
	chartDemoActions.id = `actions-${chartType.id}`;
	chartDemoActions.setAttribute("role", "region");
	chartDemoActions.setAttribute("aria-label", `${chartType} chart actions`);

	// Add update data button
	const updateDataButton = document.createElement("button");
	updateDataButton.className = "bx--btn bx--btn--primary bx--btn--disabled";
	updateDataButton.id = `change-data-${chartType.id}`;
	updateDataButton.innerHTML = "Update data";

	chartDemoActions.appendChild(updateDataButton);
	document.body.appendChild(chartDemoActions);

	return holder;
};

// Initialize all charts
chartTypes.forEach(type => {
	const holder = createChartContainer(type);
	if (holder) {
		let classToInitialize;
		switch (type.id) {
			case "tiled-map":
				classToInitialize = TiledMap;
				break;
		}

		// Add `height` to the chart options
		// type.options.height = "500px";

		// Initialize chart
		charts[type.id] = new classToInitialize(
			holder,
			{
				data: type.data,
				options: type.options
			}
		);
	}
});
