// Internal Imports
import { Service } from '../service';
import * as Configuration from '../../configuration';
import { Events } from './../../interfaces';
import { Tools } from '../../tools';

// D3 Imports
import { Transition, transition } from 'd3-transition';

export class Transitions extends Service {
	pendingTransitions = {};
	// transitions: Transition<any, any, any, any>[];

	init() {
		this.services.events.addEventListener(Events.Model.UPDATE, () => {
			this.pendingTransitions = {};
		});
	}

	getTransition(
		name?: string,
		animate?: boolean
	): Transition<any, any, any, any> {
		return null;
	}

	getInstantTransition(name?: string): Transition<any, any, any, any> {
		return null;
	}

	getPendingTransitions() {
		return this.pendingTransitions;
	}
}
