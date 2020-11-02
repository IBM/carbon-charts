import { storiesOf } from "@storybook/html";
import { withKnobs, object } from "@storybook/addon-knobs";

import { storybookDemoGroups } from "../demo/data";
import * as ChartComponents from "../src/charts";
import * as storyUtils from "./utils";

import "../demo/styles.scss";

const introStories = storiesOf("Intro", module).addDecorator(withKnobs);

// Loop through the demos for the group
introStories.add("Welcome", () => {
	// container creation
	const container = document.createElement("div");
	container.setAttribute("class", "container intro");

	container.innerHTML = `
<div class="content">
	<div class="logo">
		<img src="logo.svg" alt="Carbon Charts">
	</div>

	<div class="content">
		<h1>Carbon Charts</h1>
		<h3>A reusable framework-agnostic D3 charting library.</h3>

		<span class="netlify">Deploys by <a href="https://netlify.com" target="_blank">Netlify</a></span>

		<div class="links">
			<a class="bx--btn bx--btn--primary" href="https://github.com/carbon-design-system/carbon-charts" target="_blank">
				Repository
			</a>

			<a class="bx--btn bx--btn--primary" href="https://carbon-design-system.github.io/carbon-charts/documentation/" target="_blank">
				Docs
			</a>

			<a class="bx--btn bx--btn--primary" href="https://carbon-design-system.github.io/carbon-charts/angular" target="_blank">
				<svg class="angular" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 250 250" style="enable-background:new 0 0 250 250; fill: #fff;" xml:space="preserve">
					<g>
						<polygon points="108,135.4 125,135.4 125,135.4 125,135.4 142,135.4 125,94.5 	"></polygon>
						<path d="M125,30L125,30L125,30L31.9,63.2l14.2,123.1L125,230l0,0l0,0l78.9-43.7l14.2-123.1L125,30z M183.1,182.6h-21.7h0
							l-11.7-29.2H125h0h0h-24.7l-11.7,29.2h0H66.9h0L125,52.1l0,0l0,0l0,0l0,0L183.1,182.6L183.1,182.6z"></path>
					</g>
				</svg>

				Angular
			</a>

			<a class="bx--btn bx--btn--primary" href="https://carbon-design-system.github.io/carbon-charts/react" target="_blank">
				<svg class="react" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700.9 595.3" style="fill: #fff;">
					<g>
						<path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"></path>
						<circle cx="420.9" cy="296.5" r="45.7"></circle>
					</g>
				</svg>

				React
			</a>

			<a class="bx--btn bx--btn--primary last" href="https://carbon-design-system.github.io/carbon-charts/vue" target="_blank">
				<svg class="vue" viewBox="0 0 197 170" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<polygon fill="#ffffff" points="157.06 0 98.16 102.01 39.23 0 0 0 98.16 170.02 196.32 0 120.83 0"></polygon>
					<polygon fill="#ffffff" points="98.16 28.93 81.35 0 75.5 0 98.16 39.26 120.82 0 114.973219 0">
					</polygon>
				</svg>

				Vue
			</a>
		</div>
	</div>
</header>
	`;

	return container;
});

// Loop through all demo groups
storybookDemoGroups.forEach((demoGroup) => {
	// Create story group for each demo group
	const groupStories = storiesOf(demoGroup.title, module).addDecorator(
		withKnobs
	);

	demoGroup.demos.forEach((demo) => {
		const ClassToInitialize = ChartComponents[demo.chartType.vanilla];

		// Loop through the demos for the group
		groupStories.add(demo.title, () => {
			// container creation
			const container = document.createElement("div");
			container.setAttribute("class", "container");

			container.innerHTML = `
<h3>
	<b class="component">Component:</b>
	<span class="bx--tag bx--tag--green component-name">${
		demo.chartType.vanilla
	}</span>
</h3>
<p class="props">
	<span><b>Props: </b><span>data, </span><a href="https://carbon-design-system.github.io/carbon-charts/documentation/modules/_interfaces_charts_.html" target="_blank">options</a></span>
</p>

${
	demo.options.experimental
		? `
<div data-notification
  class="bx--inline-notification bx--inline-notification--warning"
  role="alert">
  <div class="bx--inline-notification__details">
    <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--inline-notification__icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1	s1,0.4,1,1S10.6,16,10,16z"></path><path d="M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z" data-icon-path="inner-path" opacity="0"></path></svg>
    <div class="bx--inline-notification__text-wrapper">
      <p class="bx--inline-notification__title">Alpha release</p>
      <p class="bx--inline-notification__subtitle">This is not a stable release of this component, certain pieces might be added or modified in the future. Additionally, the current implementation might have issues that we have not uncovered yet, and will work to resolve through our stable release of the component.</p>
    </div>
  </div>
</div>`
		: ""
}

${storyUtils.generateThemePickerHTML()}

<div class="marginTop-30" id="chart-demo">
</div>

<h3 class="marginTop-30">Code Sample</h3>
<a href="${demo.codesandbox.vanilla}" target="_blank">
	<img class="marginTop" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>
			`;

			storyUtils.addRadioButtonEventListeners(container);

			// Initialize chart
			const chart = new ClassToInitialize(
				container.querySelector("div#chart-demo"),
				{
					data: object("Data", demo.data),
					options: object("Options", demo.options)
				}
			);

			return container;
		});
	});
});

// DEV ONLY STORIES
if (process.env.NODE_ENV !== "production") {
	const devStories = storiesOf("__DEV__", module).addDecorator(withKnobs);

	// Loop through the demos for the group
	devStories.add("All chart types", () => {
		// container creation
		const container = document.createElement("div");
		container.setAttribute("class", "container theme--g100");

		container.innerHTML = `
	<h3>
		<b class="component">Collection of all demos</b>
	</h3>

	${storyUtils.generateThemePickerHTML()}
`;

		storyUtils.addRadioButtonEventListeners(container);

		const getNewRow = () => {
			const newRow = document.createElement("div");
			newRow.setAttribute("class", "bx--row");
			return newRow;
		};

		const grid = document.createElement("div");
		grid.setAttribute("class", "bx--grid");
		container.appendChild(grid);

		let i = 0;
		let row = getNewRow();

		storybookDemoGroups.forEach((demoGroup) => {
			demoGroup.demos.forEach((demo) => {
				grid.appendChild(row);
				if (i % 2 === 0 && i !== 0) {
					row = getNewRow();
					grid.appendChild(row);
				}

				const ClassToInitialize =
					ChartComponents[demo.chartType.vanilla];

				const column = document.createElement("div");
				column.className = "bx--col-md-12 bx--col-lg-6 chart-demo";
				column.setAttribute("id", demo.title);
				const chart = new ClassToInitialize(column, {
					data: demo.data,
					options: demo.options
				});

				row.appendChild(column);

				i++;
			});
		});

		return container;
	});
}
