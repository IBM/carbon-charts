import marked from "marked";

export const vanillaTutorial = marked(`
# Carbon Charts - VanillaJS

The Carbon Charts Vanilla library provides a collection of reusable charting components to build websites and user interfaces. Adopting the library enables developers to use consistent markup, styles, and behavior in prototype and production work.

#### Install

**with yarn:**
\`\`\`bash
yarn add @carbon/charts d3
\`\`\`

**with npm:**

\`\`\`bash
npm install --save @carbon/charts d3
\`\`\`



#### Getting started


**consuming with a bundler (e.g. webpack):**

###### index.html
\`\`\`html
...
<div id="my-bar-chart"></div>
...
\`\`\`

###### index.js
\`\`\`js
import "@carbon/charts/styles.css";
import { StackedBarChart } from "@carbon/charts";

// grab chart holder DOM element
const chartHolder = document.getElementById("my-bar-chart");

// initialize the chart
new StackedBarChart(chartHolder, {
  data: stackedBarData,
  options: stackedBarOptions,
});
\`\`\`

**consuming in a browser environment (e.g. CDNs):**

###### index.html
\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/@carbon/charts/styles.css" />
  </head>
  <body>
    <div id="my-bar-chart"></div>

    <script src="https://unpkg.com/@carbon/charts/bundle.js"></script>
    <script>
      // grab chart holder DOM element
      const chartHolder = document.getElementById("my-bar-chart");

      const stackedBarData = {
        // ...see next section
      };

      const stackedBarOptions = {
        // ...see next section
      };

      // initialize the chart
      new Charts.StackedBarChart(chartHolder, {
        data: stackedBarData,
        options: stackedBarOptions,
      });
    </script>
  </body>
</html>
\`\`\`

##### Data and Options
Data and options follow the same model in all charts, with minor exceptions and differences in specific components.
See tutorial (TODO on Data and Options)

#### Guidance
Please refer to the [Carbon Design Systems guidance](https://www.carbondesignsystem.com/data-visualization/chart-types) on using the different charts available in this library.

#### Development

Please refer to the [Contribution Guidelines](https://github.com/carbon-design-system/carbon-charts/blob/master/CONTRIBUTING.md) before starting any work.


##### Using the server
We recommend the use of [Webpack Dev Server](https://github.com/webpack/webpack-dev-server) for developing components.


###### Start the server
\`\`\`bash
cd packages/core
yarn demo:server
\`\`\`

Open browser to \`http://localhost:9006\`

##### List of available components
View available components [here](https://github.com/carbon-design-system/carbon-charts#component-status)


#### Troubleshoot
If you experience any issues while getting set up with Carbon Charts, please head over to the [GitHub repo](https://github.com/carbon-design-system/carbon-charts) for more guidelines and support. Please [create an issue](https://github.com/carbon-design-system/carbon-charts/issues) if your issue does not already exist.
`);
