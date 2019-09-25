import React from 'react';
import { storiesOf } from '@storybook/react';

import PieChart from "../src/pie-chart";
import DonutChart from "../src/donut-chart";

import { colors } from "../helpers/commons";
import { DonutCenter } from "@carbon/charts";

const demoPieOptions = {
	accessibility: false,
	legendClickable: true,
	containerResizable: true,
	colors
};

const demoPieData = {
	labels: ["2V2N-9KYPM version 1", "L22I-P66EP-L22I-P66EP-L22I-P66EP", "JQAI-2M4L1", "J9DZ-F37AP",
		"YEL48-Q6XK-YEL48", "P66EP-L22I-L22I", "Q6XK-YEL48", "XKB5-L6EP", "YEL48-Q6XK", "L22I-P66EP-L22I"],
	datasets: [
		{
			label: "Dataset 1",
			backgroundColors: colors,
			data: [100000, 200000, 600000, 100000, 400000, 450000, 300000, 70000, 20000, 120000]
		}
	]
};

const demoDonutOptions = {
	accessibility: false,
	legendClickable: true,
	containerResizable: true,
	colors,
	// center: new DonutCenter({
	// 	number: 25423,
	// 	label: "Browsers"
	// })
};

const pieStories = storiesOf("Pie", module);
pieStories.add("Basic", () => (
	<PieChart
		data={demoPieData}
		options={demoPieOptions}
	/>
));

pieStories.add("Accessible", () => (
	<PieChart
		data={demoPieData}
		options={Object.assign({}, demoPieOptions, {accessibility: true})}
	/>
));

const donutStories = storiesOf("Donut", module);
donutStories.add("Basic", () => (
	<DonutChart
		data={demoPieData}
		options={demoDonutOptions}
	/>
));

donutStories.add("Accessible", () => (
	<DonutChart
		data={demoPieData}
		options={Object.assign({}, demoDonutOptions, {accessibility: true})}
	/>
));
