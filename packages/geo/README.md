# `@carbon/charts`

> Carbon Charting components

## Getting Started

Run the following command using [npm](https://www.npmjs.com/):

```bash
npm install -S @carbon/charts d3
```

If you prefer [Yarn](https://yarnpkg.com/en/), use the following command
instead:

```bash
yarn add @carbon/charts d3
```

## Step-by-step Instructions
[Read on carbondesignsystem.com](https://www.carbondesignsystem.com/data-visualization/getting-started/vanilla)

## Sample Project
[![Edit Carbon Charts - Vanilla](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/carbon-charts-vanilla-m9r77)

## Charting Data & Options
Although we will definitely introduce new models in the future as we start shipping new components such as maps, Data and options follow the same model in all charts, with minor exceptions and differences in specific components, .

For instance, in the case of pie and donut charts, you would only provide one data set. In the case of donut charts, you can pass in an additional field called `center` in your options configuring the donut center.

There are also additional options available depending on the chart type being used, [for more examples please see here](https://github.com/carbon-design-system/carbon-charts/tree/master/packages/core/demo/demo-data).
