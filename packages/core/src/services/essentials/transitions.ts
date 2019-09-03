// Internal Imports
import { Service } from "../service";

// // Carbon motion package
// import { easings, motion } from "@carbon/motion";

// D3 Imports
import { Transition, transition } from "d3-transition";

export class Transitions extends Service {
	getDefaultTransition(name?: string): Transition<any, any, any, any> {
		if (this._model.getOptions().animations === false || this._model.get("animations") === false) {
			return this.getInstantTransition(name);
		}

		return transition(name).duration(300);
	}

	getInstantTransition(name?: string): Transition<any, any, any, any>  {
		return transition(name).duration(0);
	}
}
