// Internal Imports
import { Service } from "../service";
import { Events } from "./../../interfaces";

// D3 Imports
import { select, Selection } from "d3-selection";
import { Tools } from "../../tools";

// import the settings for the css prefix
import settings from "carbon-components/es/globals/js/settings";

// MISC
import ResizeObserver from "resize-observer-polyfill";

export class DOMUtils extends Service {
	static getSVGElementSize(
		svgSelector: Selection<any, any, any, any>,
		options?: any
	) {
		if (!svgSelector.attr) {
			svgSelector = select(svgSelector as any);
		}

		const finalDimensions = {
			width: 0,
			height: 0
		};

		const validateAndSetDimensions = (dimensions) => {
			if (dimensions) {
				Object.keys(finalDimensions).forEach((dimensionKey) => {
					if (dimensions[dimensionKey]) {
						const dimension = dimensions[dimensionKey];
						const dimensionNumber = parseFloat(dimension);
						if (
							dimension &&
							dimensionNumber > finalDimensions[dimensionKey] &&
							("" + dimension).indexOf("%") === -1
						) {
							finalDimensions[dimensionKey] = dimensionNumber;
						}
					}
				});
			}
		};

		const attrDimensions = {
			width: svgSelector.attr("width"),
			height: svgSelector.attr("height")
		};

		let bbox, bboxDimensions, boundingRect, boundingRectDimensions;
		// In many versions of Firefox
		// getBBox will cause an "NSFailure" error
		try {
			bbox = svgSelector.node().getBBox();
			bboxDimensions = {
				width: bbox.width,
				height: bbox.height
			};
		} catch (e) {}

		try {
			boundingRect = svgSelector.node().getBoundingClientRect();
			boundingRectDimensions = {
				width: boundingRect.width,
				height: boundingRect.height
			};
		} catch (e) {}

		const clientDimensions = {
			width: svgSelector.node().clientWidth,
			height: svgSelector.node().clientHeight
		};

		// If both attribute values are numbers
		// And not percentages or NaN
		if (options) {
			if (options.useAttrs) {
				validateAndSetDimensions(attrDimensions);

				if (finalDimensions.width > 0 && finalDimensions.height > 0) {
					return finalDimensions;
				}
			}

			if (options.useClientDimensions) {
				validateAndSetDimensions(clientDimensions);

				if (finalDimensions.width > 0 && finalDimensions.height > 0) {
					return clientDimensions;
				}
			}

			if (options.useBBox) {
				validateAndSetDimensions(bboxDimensions);

				if (finalDimensions.width > 0 && finalDimensions.height > 0) {
					return bboxDimensions;
				}
			}

			if (options.useBoundingRect) {
				validateAndSetDimensions(boundingRectDimensions);

				if (finalDimensions.width > 0 && finalDimensions.height > 0) {
					return boundingRectDimensions;
				}
			}
		}

		try {
			const nativeDimensions = {
				width: Tools.getProperty(
					svgSelector.node(),
					"width",
					"baseVal",
					"value"
				),
				height: Tools.getProperty(
					svgSelector.node(),
					"height",
					"baseVal",
					"value"
				)
			};

			validateAndSetDimensions(nativeDimensions);
		} catch (e) {
			validateAndSetDimensions(clientDimensions);
			validateAndSetDimensions(bboxDimensions);
			validateAndSetDimensions(attrDimensions);
		}

		return finalDimensions;
	}

	static appendOrSelect(parent, query) {
		const querySections = query.split(".");
		const elementToAppend = querySections[0];

		const selection = parent.select(query);
		if (selection.empty()) {
			return parent
				.append(elementToAppend)
				.attr("class", querySections.slice(1).join(" "));
		}

		return selection;
	}

	protected svg: Element;
	protected width: string;
	protected height: string;

	init() {
		// Add width & height to the chart holder if necessary, and add a classname
		this.styleHolderElement();

		// Add main SVG
		this.addSVGElement();

		if (this.model.getOptions().resizable) {
			this.addResizeListener();
		}

		this.addHolderListeners();
	}

	update() {
		this.styleHolderElement();
	}

	styleHolderElement() {
		const holderElement = this.getHolder() as HTMLElement;

		// Add class to chart holder
		select(this.getHolder()).classed(
			`${settings.prefix}--chart-holder`,
			true
		);

		// In order for resize events to not clash with these updates
		// We'll check if the width & height values passed in options
		// Have changed, before setting them to the holder
		const { width, height } = this.model.getOptions();
		if (width !== this.width) {
			// Apply formatted width attribute to chart
			holderElement.style.width = width;

			this.width = width;
		}

		if (height !== this.height) {
			// Apply formatted width attribute to chart
			holderElement.style.height = height;

			this.height = height;
		}
	}

	getHolder() {
		return this.model.get("holder");
	}

	addSVGElement() {
		const chartsprefix = Tools.getProperty(
			this.model.getOptions(),
			"style",
			"prefix"
		);
		const svg = select(this.getHolder())
			.append("svg")
			.classed(`${settings.prefix}--${chartsprefix}--chart-svg`, true)
			.attr("height", "100%")
			.attr("width", "100%");

		this.svg = svg.node();
	}

	getMainSVG() {
		return this.svg;
	}

	addHolderListeners() {
		const holder = this.getHolder();

		if (!holder) {
			return;
		}

		select(holder)
			.on("mouseover", () => {
				// Dispatch event
				this.services.events.dispatchEvent(Events.Chart.MOUSEOVER);
			})
			.on("mouseout", () => {
				// Dispatch event
				this.services.events.dispatchEvent(Events.Chart.MOUSEOUT);
			});
	}

	addResizeListener() {
		const holder = this.getHolder();

		if (!holder) {
			return;
		}

		// Grab current dimensions of the chart holder
		let containerWidth = holder.clientWidth;
		let containerHeight = holder.clientHeight;

		// The resize callback function
		const resizeCallback = Tools.debounce((entries, observer) => {
			if (!holder) {
				return;
			}

			if (
				Math.abs(containerWidth - holder.clientWidth) > 1 ||
				Math.abs(containerHeight - holder.clientHeight) > 1
			) {
				containerWidth = holder.clientWidth;
				containerHeight = holder.clientHeight;

				this.services.events.dispatchEvent(Events.Chart.RESIZE);
			}
		}, 12.5);

		// Observe the behaviour of resizing on the holder
		const resizeObserver = new ResizeObserver(resizeCallback);
		resizeObserver.observe(holder);
	}
}
