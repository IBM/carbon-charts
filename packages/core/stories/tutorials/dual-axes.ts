import marked from "marked";

export const dualAxesTutorial = {
	name: "Dual Axes Tutorial",
	content: marked(`
# Dual Axes Charts
If a chart is considered to be a **dual axes** chart, it means that the chart uses 2 **different** axes for visually mapping out ranges for the data.
Careful consideration should be taken when using dual axes charts because they can more often misrepresent the data.

Please refer to dataviz guidelines [here](https://www.carbondesignsystem.com/data-visualization/getting-started) for more information on IBM's best practices.

____

## Setting up a dual axes chart
When using multiple Y or X axes, it is best to specify which axes will be the primary axis using the configurations.
Below we define options for an axis chart with **two dual axes (both vertical)** and one horizontal axis (bottom). In this case, we want to
set up the horizontal axis (bottom) as the domain, and have the datasets' range mapped to the different vertical axes - "Temperature" on the left axis and "Products Sold" on the right.

Use the \`main\` option to define the \`left\` axis as the primary axis. The axis defined as \`main\` will be used to map **all datasets** until we set the
\`correspondingDatasets\` on the non-primary (secondary) axis. If there is no \`correspondingDatasets\` set on the secondary axis, then the chart will render
a read-only axis (without datasets mapped to it).

\`\`\`
const dualAxesOptions = {
	...otherOptions,
	axes: {
		bottom: {
		  mapsTo: date,
		  scaleType: time
		},
		left: {
		  mapsTo: temperature,
		  scaleType: linear,
		  main: true // this will be the primary axis
		},
		right: {
		  mapsTo: value,
		  scaleType: linear,
		  // the dataset "Products Sold" will map to this axis instead
		  correspondingDatasets: [
			"Products Sold"
		  ]
		}
	  },
};
\`\`\`

Note: There is underlying functionality to determine the orientation/primary axes **without the use of \`main\`**,
however it is best to be explicit when working with dual axes charts. If there is no \`main\` specified, the library
will try to determine the best primary/secondary assignments to make which could result in some confusion down the road.

`)
};
