// Internal Imports
import { Service } from "../service";

export class Events extends Service {
	// DOM Event target
	documentFragment: DocumentFragment;

	init() {
		// Setup the event fragment on the DOM
		this.documentFragment = document.createDocumentFragment();
	}

	addEventListener(type: string, listener: Function) {
		// Need the casting to any here since typescript
		// Is expecting a function of type EventListenerOrEventListenerObject here
		// Which seems unreasonable
		this.documentFragment.addEventListener(type, listener as any);
	}

	removeEventListener(type: string, listener: Function) {
		// Need the casting to any here since typescript
		// Is expecting a function of type EventListenerOrEventListenerObject here
		// Which seems unreasonable
		this.documentFragment.removeEventListener(type, listener as any);
	}

	dispatchEvent(eventType: string, eventDetail?: object) {
		let newEvent;
		if (eventDetail) {
			newEvent = new CustomEvent(eventType, {
				detail: eventDetail
			});
		} else {
			newEvent = document.createEvent("Event");
			newEvent.initEvent(eventType, false, true);
		}

		this.documentFragment.dispatchEvent(newEvent);
	}
}
