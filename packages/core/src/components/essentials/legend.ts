// Internal Imports
import { Component } from "../component";
import { Tools } from "../../tools";
import {
	LegendOrientations,
	Roles,
	Events,
	TruncationTypes
} from "../../interfaces";
import { DOMUtils } from "../../services";

// D3 Imports
import { select } from "d3-selection";

export class Legend extends Component {
	type = "legend";

	render() {
		const svg = this.getContainerSVG().attr(
			"role",
			`${Roles.GRAPHICS_DOCUMENT} ${Roles.DOCUMENT}`
		);
		const options = this.model.getOptions();
		const legendOptions = Tools.getProperty(options, "legend");
		const dataGroups = this.model.getDataGroups();
		const legendItems = svg
			.selectAll("g.legend-item")
			.data(dataGroups, (dataGroup) => dataGroup.name);

		const addedLegendItems = legendItems
			.enter()
			.append("g")
			.classed("legend-item", true)
			.classed("active", function (d, i) {
				return d.status === options.legend.items.status.ACTIVE;
			});

		// Configs
		const checkboxRadius = options.legend.checkbox.radius;

		// Truncation
		// get user provided custom values for truncation
		const truncationType = Tools.getProperty(
			legendOptions,
			"truncation",
			"type"
		);
		const truncationThreshold = Tools.getProperty(
			legendOptions,
			"truncation",
			"threshold"
		);
		const truncationNumCharacter = Tools.getProperty(
			legendOptions,
			"truncation",
			"numCharacter"
		);

		addedLegendItems
			.append("rect")
			.classed("checkbox", true)
			.merge(legendItems.select("rect.checkbox"))
			.attr("width", checkboxRadius * 2)
			.attr("height", checkboxRadius * 2)
			.attr("rx", 1)
			.attr("ry", 1)
			.style("fill", (d) => {
				return d.status === options.legend.items.status.ACTIVE
					? this.model.getStrokeColor(d.name)
					: null;
			})
			.classed("active", function (d, i) {
				return d.status === options.legend.items.status.ACTIVE;
			});
		const addedLegendItemsText = addedLegendItems
			.append("text")
			.merge(legendItems.select("text"));

		// truncate the legend label if it's too long
		if (truncationType !== TruncationTypes.NONE) {
			addedLegendItemsText.html(function (d) {
				if (d.name.length > truncationThreshold) {
					return Tools.truncateLabel(
						d.name,
						truncationType,
						truncationNumCharacter
					);
				} else {
					return d.name;
				}
			});
		} else {
			addedLegendItemsText.html((d) => d.name);
		}

		const radiusLabel = Tools.getProperty(
			options,
			"bubble",
			"radiusLabel"
		);

		// Add radius label for bubble chart when dataGroups is not empty
		if (radiusLabel && dataGroups.length) {
			const radiusLabelItem = svg.selectAll("g.radius-label")
			.data([radiusLabel]);

			const addedRadiusLabelItem = radiusLabelItem
				.enter()
				.append("g")
				.classed("radius-label", true);

			addedRadiusLabelItem
				.append("g")
				.classed("icon", true)
				.html(`
					<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						<title>Artboard</title>
						<g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<circle id="Oval-Copy-33" stroke="#8C8C8C" cx="7" cy="7" r="6.5"></circle>
							<circle id="Oval-Copy-33" stroke="#8C8C8C" cx="7" cy="10" r="3.5"></circle>
						</g>
					</svg>
				`);

			addedRadiusLabelItem
				.append("text")
				.merge(radiusLabelItem.select("text"))
				.html(radiusLabel);
			
			this.breakItemsIntoLines(
				addedLegendItems,
				addedRadiusLabelItem
			);
		} else {
			this.breakItemsIntoLines(addedLegendItems);
		}

		// Remove old elements as needed.
		legendItems
			.exit()
			.on("mouseover", null)
			.on("click", null)
			.on("mouseout", null)
			.remove();

		const legendClickable = Tools.getProperty(
			this.model.getOptions(),
			"legend",
			"clickable"
		);
		svg.classed("clickable", legendClickable);

		if (legendClickable && addedLegendItems.size() > 0) {
			this.addEventListeners();
		}

		// Set alignment for legend
		const alignment = Tools.getProperty(legendOptions,"alignment");

		const alignmentOffset = DOMUtils.getAlignmentOffset(alignment, svg, this.getParent());
		svg.attr("transform", `translate(${alignmentOffset}, 0)`);
	}

	breakItemsIntoLines(addedLegendItems, addedRadiusLabelItem = null) {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.model.getOptions();

		// Configs
		const checkboxRadius = options.legend.checkbox.radius;
		const legendItemsHorizontalSpacing =
			options.legend.items.horizontalSpace;
		const legendItemsVerticalSpacing = options.legend.items.verticalSpace;
		const legendTextYOffset = options.legend.items.textYOffset;
		const spaceNeededForCheckbox =
			checkboxRadius * 2 + options.legend.checkbox.spaceAfter;

		// Check if there are disabled legend items
		const { DISABLED } = options.legend.items.status;
		const dataGroups = this.model.getDataGroups();
		const hasDeactivatedItems = dataGroups.some(
			(dataGroup) => dataGroup.status === DISABLED
		);

		const legendOrientation = Tools.getProperty(
			options,
			"legend",
			"orientation"
		);

		// Keep track of line numbers and positions
		let startingPoint = 0;
		let lineNumber = 0;
		let itemIndexInLine = 0;
		let radiusLabelXPosition = 0;
		addedLegendItems
			.merge(svg.selectAll("g.legend-item"))
			.each(function (d, i) {
				const legendItem = select(this);
				const previousLegendItem = select(
					svg.selectAll("g.legend-item").nodes()[i - 1]
				);

				if (
					itemIndexInLine === 0 ||
					previousLegendItem.empty() ||
					legendOrientation === LegendOrientations.VERTICAL
				) {
					if (
						legendOrientation === LegendOrientations.VERTICAL &&
						i !== 0
					) {
						lineNumber++;
					}
				} else {
					const svgDimensions = DOMUtils.getSVGElementSize(
						self.parent,
						{ useAttr: true }
					);
					const legendItemTextDimensions = DOMUtils.getSVGElementSize(
						select(this).select("text"),
						{ useBBox: true }
					);
					const lastLegendItemTextDimensions = DOMUtils.getSVGElementSize(
						previousLegendItem.select("text"),
						{ useBBox: true }
					);
					startingPoint =
						startingPoint +
						lastLegendItemTextDimensions.width +
						spaceNeededForCheckbox +
						legendItemsHorizontalSpacing;

					// Place legends in a new line if space is not enough
					if (
						startingPoint +
							spaceNeededForCheckbox +
							legendItemTextDimensions.width >
						svgDimensions.width
					) {
						lineNumber++;
						startingPoint = 0;
						itemIndexInLine = 0;
					}
				}

				const yOffset = 0;

				// Position checkbox
				// TODO - Replace with layout component margins
				legendItem
					.select("rect.checkbox")
					.attr("x", startingPoint)
					.attr(
						"y",
						yOffset + lineNumber * legendItemsVerticalSpacing
					);

				// Position text
				// TODO - Replace with layout component margins
				const yPosition =
					legendTextYOffset + lineNumber * legendItemsVerticalSpacing;
				legendItem
					.select("text")
					.attr("x", startingPoint + spaceNeededForCheckbox)
					.attr("y", yOffset + yPosition + 3);

				// Calculate x position for radius label
				if (addedRadiusLabelItem && legendOrientation !== LegendOrientations.VERTICAL) {
					const legendItemTextDimensions = DOMUtils.getSVGElementSize(
						select(this).select("text"),
						{ useBBox: true }
					);

					radiusLabelXPosition =
						startingPoint +
						legendItemTextDimensions.width +
						spaceNeededForCheckbox +
						legendItemsHorizontalSpacing;
				}

				// Test if legendItems are placed in the correct direction
				const testHorizontal =
					(!legendOrientation ||
						legendOrientation === LegendOrientations.HORIZONTAL) &&
					legendItem.select("rect.checkbox").attr("y") === "0";

				const testVertical =
					legendOrientation === LegendOrientations.VERTICAL &&
					legendItem.select("rect.checkbox").attr("x") === "0";

				const hasCorrectLegendDirection =
					testHorizontal || testVertical;

				// Render checkbox check icon
				if (
					hasDeactivatedItems &&
					legendItem.select("g.check").empty() &&
					hasCorrectLegendDirection
				) {
					legendItem.append("g").classed("check", true).html(`
							<svg focusable="false" preserveAspectRatio="xMidYMid meet"
								xmlns="http://www.w3.org/2000/svg" width="32" height="32"
								viewBox="0 0 32 32" aria-hidden="true"
								style="will-change: transform;">
								<path d="M13 21.2l-7.1-7.1-1.4 1.4 7.1 7.1L13 24 27.1 9.9l-1.4-1.5z"></path>
								<title>Checkmark</title>
							</svg>
						`);

					legendItem
						.select("g.check svg")
						.attr("width", checkboxRadius * 2 - 1)
						.attr("height", checkboxRadius * 2 - 1)
						.attr(
							"x",
							parseFloat(
								legendItem.select("rect.checkbox").attr("x")
							) + 0.5
						)
						.attr(
							"y",
							parseFloat(
								legendItem.select("rect.checkbox").attr("y")
							) + 0.5
						);
				} else if (
					!hasDeactivatedItems &&
					!legendItem.select("g.check").empty()
				) {
					legendItem.select("g.check").remove();
				}

				itemIndexInLine++;
			});

		if (addedRadiusLabelItem) {
			addedRadiusLabelItem
				.merge(svg.selectAll("g.radius-label"))
				.each(function(d) {
					const radiusLabelItem = select(this);
					if (legendOrientation === LegendOrientations.VERTICAL) {
						lineNumber++;
					} else {
						const svgDimensions = DOMUtils.getSVGElementSize(
							self.parent,
							{ useAttr: true }
						);
						const labelItemTextDimensions = DOMUtils.getSVGElementSize(
							select(this).select("text"),
							{ useBBox: true }
						);
						if (
							radiusLabelXPosition +
							spaceNeededForCheckbox +
							labelItemTextDimensions.width > 
							svgDimensions.width
						) {
							lineNumber++;
							radiusLabelXPosition = 0;
						}
					}

					radiusLabelItem
						.select("g.icon svg")
						.attr("x", radiusLabelXPosition)
						.attr("y", lineNumber * legendItemsVerticalSpacing);

					radiusLabelItem
						.select("text")
						.attr("x", radiusLabelXPosition + spaceNeededForCheckbox)
						.attr(
							"y",
							legendTextYOffset +
							lineNumber *
							legendItemsVerticalSpacing + 3
						);
				});
		}
	}

	addEventListeners() {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.model.getOptions();
		const legendOptions = Tools.getProperty(options, "legend");
		const truncationThreshold = Tools.getProperty(
			legendOptions,
			"truncation",
			"threshold"
		);

		svg.selectAll("g.legend-item")
			.on("mouseover", function () {
				self.services.events.dispatchEvent(Events.Legend.ITEM_HOVER, {
					hoveredElement: select(this)
				});

				// Configs
				const checkboxRadius = options.legend.checkbox.radius;
				const hoveredItem = select(this);
				hoveredItem
					.append("rect")
					.classed("hover-stroke", true)
					.attr(
						"x",
						parseFloat(
							hoveredItem.select("rect.checkbox").attr("x")
						) - 2
					)
					.attr(
						"y",
						parseFloat(
							hoveredItem.select("rect.checkbox").attr("y")
						) - 2
					)
					.attr("width", checkboxRadius * 2 + 4)
					.attr("height", checkboxRadius * 2 + 4)
					.attr("rx", 3)
					.attr("ry", 3)
					.lower();

				const hoveredItemData = hoveredItem.datum() as any;
				if (hoveredItemData.name.length > truncationThreshold) {
					self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
						hoveredElement: hoveredItem,
						content: hoveredItemData.name
					});
				}
			})
			.on("mousemove", function () {
				self.services.events.dispatchEvent(Events.Tooltip.MOVE);
			})
			.on("click", function () {
				self.services.events.dispatchEvent(Events.Legend.ITEM_CLICK, {
					clickedElement: select(this)
				});

				const clickedItem = select(this);
				const clickedItemData = clickedItem.datum() as any;

				self.model.toggleDataLabel(clickedItemData.name);
			})
			.on("mouseout", function () {
				const hoveredItem = select(this);
				hoveredItem.select("rect.hover-stroke").remove();

				self.services.events.dispatchEvent(Events.Tooltip.HIDE);

				self.services.events.dispatchEvent(
					Events.Legend.ITEM_MOUSEOUT,
					{
						hoveredElement: hoveredItem
					}
				);
			});
	}
}
