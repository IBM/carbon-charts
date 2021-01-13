import { storiesOf } from "@storybook/html";
import { withKnobs, object } from "@storybook/addon-knobs";

import { storybookDemoGroups } from "../demo/data";
import * as ChartComponents from "../src/charts";
import * as storyUtils from "./utils";

import "../demo/styles.scss";
import { Legend } from "../src/components";

const groupStories = storiesOf("Standalone components", module).addDecorator(
	withKnobs
);

// Loop through the demos for the group
groupStories.add("Demo", () => {
	// container creation
	const container = document.createElement("div");
	container.setAttribute("class", "container theme--g100");

	container.innerHTML = `
<h3>
<b class="component">Component</b>
<span class="bx--tag bx--tag--green component-name">CustomChart</span>
</h3>
<p class="props">
<span><b>Props: </b><span><a href="/?path=/story/tutorials--tabular-data-format">data</a>, </span><a href="https://carbon-design-system.github.io/carbon-charts/documentation/modules/_interfaces_charts_.html" target="_blank">options</a></span>
</p>

<div id="charting-controls">
</div>

<div class="marginTop-30" id="chart-demo">
</div>
	`;

	// Initialize chart
	const chart = new ChartComponents.CustomChart(
		container.querySelector("div#chart-demo"),
		{
			data: object("Data", [
				{ group: "2V2N 9KYPM version 1", value: 20000 },
				{ group: "L22I P66EP L22I P66EP L22I P66EP", value: 65000 },
				{ group: "JQAI 2M4L1", value: 75000 },
				{ group: "J9DZ F37AP", value: 1200 },
				{ group: "YEL48 Q6XK YEL48", value: 10000 },
				{ group: "Misc", value: 25000 }
			]) as any,
			options: object("Options", {
				data: {
					groupMapsTo: "group"
				},
				components: [
					{
						component: Legend,
						configs: {
							one: true
						}
					}
				]
			})
		}
	);

	storyUtils.addDemoDataFormListeners(container, {}, chart);
	storyUtils.addControls(container, chart);

	return container;
});
