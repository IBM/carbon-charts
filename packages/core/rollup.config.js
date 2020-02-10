import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
	input: "dist/index.js",
	output:	{
		file: `./dist/bundle.js`,
		format: "umd",
		name: "Charts",
		globals: {
			"d3-scale": "d3Scale",
			"d3-selection": "d3Selection",
			"d3-transition": "d3Transition",
			"d3-shape": "d3Shape",
			"d3-color": "d3Color",
			"d3-interpolate": "d3Interpolate",
			"d3-axis": "d3Axis",
			"d3-array": "d3Array",
			"d3-hierarchy": "d3Hierarchy"
		}
	},
	plugins: [
		terser(),
		resolve(),
		commonjs()
	],
	onwarn(warning, next) {
		// logs the circular dependencies inside the d3 codebase
		if (warning.code === "CIRCULAR_DEPENDENCY" &&
			warning.importer.indexOf("d3") !== -1) {
			console.warn(
				"Circular dependency found in D3:",
				warning.toString().replace("Circular dependency:", "")
			);
			return;
		}

		next(warning);
	}
};
