if (typeof window !== "undefined") {
	(function () {
		if (typeof window["CustomEvent"] === "function") {
			return false;
		}

		function CustomEvent(event, params) {
			params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};
			const evt = document.createEvent("CustomEvent");
			evt.initCustomEvent(
				event,
				params.bubbles,
				params.cancelable,
				params.detail
			);
			return evt;
		}

		CustomEvent.prototype = window["Event"].prototype;
		window["CustomEvent"] = CustomEvent as any;
	})();

	// Avoid multiple instances of babel-polyfill
	function idempotentBabelPolyfill() {
		if (
			(typeof global !== "undefined" && !global["_babelPolyfill"]) ||
			!window["_babelPolyfill"]
		) {
			return require("babel-polyfill");
		}

		return null;
	}

	idempotentBabelPolyfill();
}
