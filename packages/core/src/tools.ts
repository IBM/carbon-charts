// Internal imports
import {
	AxisChartOptions,
	CartesianOrientations,
	ScaleTypes,
	TruncationTypes,
	LegendItemTypes,
} from './interfaces';

import { defaultLegendAdditionalItems } from './configuration-non-customizable';

import {
	debounce as lodashDebounce,
	merge as lodashMerge,
	cloneDeep as lodashCloneDeep,
	unionBy as lodashUnionBy,
	uniq as lodashUnique,
	clamp as lodashClamp,
	flatten as lodashFlatten,
	groupBy as lodashGroupBy,
	camelCase as lodashCamelCase,
	isEmpty as lodashIsEmpty,
	isEqual as lodashIsEqual,
	flatMapDeep as lodashFlatMapDeep,
	kebabCase as lodashKebabCase,
	fromPairs as lodashFromPairs,
	some as lodashSome,
	// the imports below are needed because of typescript bug (error TS4029)
	Cancelable,
	DebounceSettings,
} from 'lodash-es';

import { mouse } from 'd3-selection';
import { Numeric } from 'd3';

// Functions
export namespace Tools {
	// Export these functions from lodash
	export const debounce = lodashDebounce;
	export const clone = lodashCloneDeep;
	export const merge = lodashMerge;
	export const unionBy = lodashUnionBy;
	export const removeArrayDuplicates = lodashUnique;
	export const clamp = lodashClamp;
	export const flatten = lodashFlatten;
	export const groupBy = lodashGroupBy;
	export const camelCase = lodashCamelCase;
	export const isEmpty = lodashIsEmpty;
	export const isEqual = lodashIsEqual;
	export const flatMapDeep = lodashFlatMapDeep;
	export const kebabCase = lodashKebabCase;
	export const fromPairs = lodashFromPairs;
	export const some = lodashSome;

	export function debounceWithD3MousePosition(fn, delay, element) {
		var timer = null;
		return function () {
			const context = this;
			const args = arguments;

			//we get the D3 event here
			context.mousePosition = mouse(element);

			clearTimeout(timer);

			timer = setTimeout(function () {
				// and use the reference here
				fn.apply(context, args);
			}, delay);
		};
	}

	/**
	 * Returns default chart options merged with provided options,
	 * with special cases for axes.
	 * Axes object will not merge the not provided axes.
	 *
	 * @export
	 * @param {AxisChartOptions} defaultOptions Configuration.options[chartType]
	 * @param {AxisChartOptions} providedOptions user provided options
	 * @returns merged options
	 */
	export function mergeDefaultChartOptions(
		defaultOptions: any,
		providedOptions: any
	) {
		defaultOptions = Tools.clone(defaultOptions);
		const providedAxesNames = Object.keys(providedOptions.axes || {});

		if (providedAxesNames.length === 0) {
			delete defaultOptions.axes;
		}

		// Update deprecated options to work with the tabular data format
		// Similar to the functionality in model.transformToTabularData()
		for (const axisName in defaultOptions.axes) {
			if (providedAxesNames.includes(axisName)) {
				const providedAxisOptions = providedOptions.axes[axisName];

				if (
					providedAxisOptions['primary'] ||
					providedAxisOptions['secondary']
				) {
					console.warn(
						'`primary` & `secondary` are no longer needed for axis configurations. Read more here https://carbon-design-system.github.io/carbon-charts/?path=/story/docs-tutorials--tabular-data-format'
					);
				}

				const identifier = providedAxisOptions['mapsTo'];
				if (identifier === undefined || identifier === null) {
					const scaleType = providedAxisOptions['scaleType'];

					if (scaleType === undefined || scaleType === null) {
						providedAxisOptions['mapsTo'] = 'value';
					} else if (scaleType === ScaleTypes.TIME) {
						providedAxisOptions['mapsTo'] = 'date';
					} else if (scaleType === ScaleTypes.LABELS) {
						providedAxisOptions['mapsTo'] = 'key';
					}
				}
			} else {
				delete defaultOptions.axes[axisName];
			}
		}

		updateLegendAdditionalItems(defaultOptions, providedOptions);

		return Tools.merge(defaultOptions, providedOptions);
	}

	/**************************************
	 *  DOM-related operations            *
	 *************************************/

	/**
	 * Get width & height of an element
	 *
	 * @export
	 * @param {any} el element to get dimensions from
	 * @returns an object containing the width and height of el
	 */
	export function getDimensions(el) {
		return {
			width: parseFloat(
				el.style.width.replace('px', '') || el.offsetWidth
			),
			height: parseFloat(
				el.style.height.replace('px', '') || el.offsetHeight
			),
		};
	}

	/**
	 * Gets elements's x and y translations from transform attribute or returns null
	 *
	 * @param {HTMLElement} element
	 * @returns an object containing the translated x and y values or null
	 */
	export function getTranslationValues(elementRef: HTMLElement) {
		if (!elementRef) {
			return;
		}

		// regex to ONLY get values for translate (instead of all rotate, translate, skew, etc)
		const translateRegex = /translate\([0-9]+\.?[0-9]*,[0-9]+\.?[0-9]*\)/;

		const transformStr = elementRef
			.getAttribute('transform')
			.match(translateRegex);
		if (!transformStr) {
			return null;
		}

		// check for the match
		if (transformStr[0]) {
			const transforms = transformStr[0]
				.replace(/translate\(/, '')
				.replace(/\)/, '')
				.split(',');

			return {
				tx: transforms[0],
				ty: transforms[1],
			};
		}
		return null;
	}

	/**************************************
	 *  Formatting & calculations         *
	 *************************************/

	/**
	 * Gets x and y coordinates from HTML transform attribute
	 *
	 * @export
	 * @param {any} string the transform attribute string ie. transform(x,y)
	 * @returns Returns an object with x and y offsets of the transform
	 */
	export function getTranformOffsets(string) {
		const regExp = /\(([^)]+)\)/;
		const match = regExp.exec(string)[1];
		const xyString = match.split(',');

		return {
			x: parseFloat(xyString[0]),
			y: parseFloat(xyString[1]),
		};
	}

	/**
	 * Returns string value for height/width using pixels if there isn't a specified unit of measure
	 *
	 * @param value string or number value to be checked for unit of measure
	 */
	export function formatWidthHeightValues(value) {
		const stringValue = value.toString();

		// If the value provided contains any letters
		// Return it the same way
		if (stringValue.match(/[a-z]/i)) {
			return stringValue;
		}

		return stringValue + 'px';
	}

	/**
	 * Capitalizes first letter of a string
	 *
	 * @export
	 * @param {any} string the input string to perform first letter capitalization with
	 * @returns The transformed string after first letter is capitalized
	 */
	export function capitalizeFirstLetter(string) {
		return string[0].toUpperCase() + string.slice(1);
	}

	/**
	 * Get the percentage of a datapoint compared to the entire dataset.
	 * @export
	 * @param {any} item
	 * @param {any} fullData
	 * @returns The percentage in the form of a number (1 significant digit if necessary)
	 */
	export function convertValueToPercentage(item, fullData) {
		const percentage =
			(item / fullData.reduce((accum, val) => accum + val.value, 0)) *
			100;
		// if the value has any significant figures, keep 1
		return percentage % 1 !== 0
			? parseFloat(percentage.toFixed(1))
			: percentage;
	}

	/**
	 * Truncate the labels
	 * @export
	 * @param {any} fullText
	 * @param {any} truncationType
	 * @param {any} numCharacter
	 * @returns Truncated text
	 */
	export function truncateLabel(fullText, truncationType, numCharacter) {
		if (numCharacter > fullText.length) {
			return fullText;
		}
		if (truncationType === TruncationTypes.MID_LINE) {
			return (
				fullText.substr(0, numCharacter / 2) +
				'...' +
				fullText.substr(-numCharacter / 2)
			);
		} else if (truncationType === TruncationTypes.FRONT_LINE) {
			return '...' + fullText.substr(-numCharacter);
		} else if (truncationType === TruncationTypes.END_LINE) {
			return fullText.substr(0, numCharacter) + '...';
		}
	}

	/**
	 * Update legend additional items
	 * @param {any} defaultOptions
	 * @param {any} providedOptions
	 */
	export function updateLegendAdditionalItems(
		defaultOptions,
		providedOptions
	) {
		let defaultAdditionalItems = Tools.getProperty(
			defaultOptions,
			'legend',
			'additionalItems'
		);
		const userProvidedAdditionalItems = Tools.getProperty(
			providedOptions,
			'legend',
			'additionalItems'
		);

		// Retain default legend additional items
		if (defaultAdditionalItems && userProvidedAdditionalItems) {
			const providedTypes = userProvidedAdditionalItems.map(
				(item) => item.type
			);
	
			const defaultTypes = defaultAdditionalItems.map(
				(item) => item.type
			)

			// Get default items in default options but not in provided options
			const updatedDefaultItems = defaultLegendAdditionalItems.filter(
				(item) => defaultTypes.includes(item.type) &&
				!providedTypes.includes(item.type)
			)
			
			defaultOptions.legend.additionalItems = updatedDefaultItems;

			providedOptions.legend.additionalItems = Tools.unionBy(
				updatedDefaultItems,
				userProvidedAdditionalItems,
				'name'
			);
		}
	}

	/**************************************
	 *  Object/array related checks       *
	 *************************************/

	/**
	 * Compares two arrays to return the difference between two arrays' items.
	 *
	 * @export
	 * @param {any[]} oldArray the array to check for missing items
	 * @param {any[]} newArray the array to check for newly added items
	 * @returns An object containing items missing (existing in oldArray but not newArray)
	 * and items added (existing in newArray but not in oldArray). Object is of the form { missing: [], added: [] }
	 */
	export function arrayDifferences(oldArray: any[], newArray: any[]) {
		const difference = {
			missing: [],
			added: [],
		};

		oldArray.forEach((element) => {
			if (newArray.indexOf(element) === -1) {
				difference.missing.push(element);
			}
		});

		newArray.forEach((element) => {
			if (oldArray.indexOf(element) === -1) {
				difference.added.push(element);
			}
		});

		return difference;
	}

	/**
	 * Gets the duplicated keys from an array of data
	 *
	 * @export
	 * @param {*} data - array of data
	 * @returns A list of the duplicated keys in data
	 */
	export function getDuplicateValues(arr: any) {
		const values = [];
		const duplicateValues = [];

		arr.forEach((value) => {
			if (
				values.indexOf(value) !== -1 &&
				duplicateValues.indexOf(value) === -1
			) {
				duplicateValues.push(value);
			}

			values.push(value);
		});

		return duplicateValues;
	}

	// ================================================================================
	// D3 Extensions
	// ================================================================================

	/**
	 * In D3, moves an element to the front of the canvas
	 *
	 * @export
	 * @param {any} element input element to moved in front
	 * @returns The function to be used by D3 to push element to the top of the canvas
	 */
	export function moveToFront(element) {
		return element.each(function () {
			this.parentNode.appendChild(this);
		});
	}

	// ================================================================================
	// Style Helpers
	// ================================================================================

	/**
	 * Gets a speicified property from within an object.
	 *
	 * @param object the object containing the property to retrieve
	 * @param propPath nested properties used to extract the final property from within the object
	 * (i.e "style", "color" would retrieve the color property from within an object that has "color" nested within "style")
	 */
	export const getProperty = (object, ...propPath) => {
		let position = object;
		if (position) {
			for (const prop of propPath) {
				if (position[prop] !== null && position[prop] !== undefined) {
					position = position[prop];
				} else {
					return null;
				}
			}
			return position;
		}

		return null;
	};

	interface SVGPathCoordinates {
		x0: number;
		x1: number;
		y0: number;
		y1: number;
	}

	export const flipSVGCoordinatesBasedOnOrientation = (
		verticalCoordinates: SVGPathCoordinates,
		orientation?: CartesianOrientations
	) => {
		if (orientation === CartesianOrientations.HORIZONTAL) {
			return {
				y0: verticalCoordinates.x0,
				y1: verticalCoordinates.x1,
				x0: verticalCoordinates.y0,
				x1: verticalCoordinates.y1,
			};
		}

		return verticalCoordinates;
	};

	export const generateSVGPathString = (
		verticalCoordinates: SVGPathCoordinates,
		orientation?: CartesianOrientations
	) => {
		const { x0, x1, y0, y1 } = flipSVGCoordinatesBasedOnOrientation(
			verticalCoordinates,
			orientation
		);

		return `M${x0},${y0}L${x0},${y1}L${x1},${y1}L${x1},${y0}L${x0},${y0}`;
	};

	export function flipDomainAndRangeBasedOnOrientation<D, R>(
		domain: D,
		range: R,
		orientation?: CartesianOrientations
	): [D, R] | [R, D] {
		return orientation === CartesianOrientations.VERTICAL
			? [domain, range]
			: [range, domain];
	}

	export const compareNumeric = (a: Numeric, b: Numeric) =>
		Number(a) === Number(b);
}
