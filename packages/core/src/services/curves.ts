import {
	curveBasis,
	curveBasisClosed,
	curveBasisOpen,
	curveBundle,
	curveCardinal,
	curveCardinalClosed,
	curveCardinalOpen,
	curveCatmullRom,
	curveCatmullRomClosed,
	curveCatmullRomOpen,
	curveLinear,
	curveLinearClosed,
	curveMonotoneX,
	curveMonotoneY,
	curveNatural,
	curveStep,
	curveStepAfter,
	curveStepBefore,
	// the imports below are needed because of typescript bug (error TS4029)
	CurveBundleFactory,
	CurveCardinalFactory,
	CurveCatmullRomFactory,
	CurveGenerator
} from "d3-shape";

// this import is needed because of typescript bug (error TS4029)
import { Path } from "d3-path";

// Internal Imports
import { Service } from "./service";

export class Curves extends Service {
	curveTypes = {
		curveLinear,
		curveLinearClosed,
		curveBasis,
		curveBasisClosed,
		curveBasisOpen,
		curveBundle,
		curveCardinal,
		curveCardinalClosed,
		curveCardinalOpen,
		curveCatmullRom,
		curveCatmullRomClosed,
		curveCatmullRomOpen,
		curveMonotoneX,
		curveMonotoneY,
		curveNatural,
		curveStep,
		curveStepAfter,
		curveStepBefore
	};

	getD3Curve() {
		let curveName = "curveLinear";
		const curveOptions = this.model.getOptions().curve;

		// Parse curve type whether the user provided a string
		// Or an object with more options
		if (curveOptions) {
			if (typeof curveOptions === "string") {
				// curve: 'string'
				curveName = curveOptions;
			} else {
				// curve: { name: 'string' }
				curveName = curveOptions.name;
			}
		}

		if (this.curveTypes[curveName]) {
			// Grab correct d3 curve function
			let curve = this.curveTypes[curveName];

			// Apply user-provided options to the d3 curve
			if (curveOptions) {
				Object.keys(curveOptions).forEach((optionName) => {
					if (curve[optionName]) {
						curve = curve[optionName](curveOptions[optionName]);
					}
				});
			}

			return curve;
		}

		console.warn(
			`The curve type '${curveName}' is invalid, using 'curveLinear' instead`
		);
		return this.curveTypes["curveLinear"];
	}
}
