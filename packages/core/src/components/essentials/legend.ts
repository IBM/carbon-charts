// Internal Imports
import * as Configuration from "../../configuration";
import { Component } from "../component";
import { Tools } from "../../tools";
import { LegendOrientations, Roles, Events } from "../../interfaces";
import { DOMUtils } from "../../services";

// D3 Imports
import { select } from "d3-selection";

export class Legend extends Component {
	type = "legend";

	render() {
		const svg = this.getContainerSVG().attr(
			"role",
			Roles.GRAPHICS_DOCUMENT
		);
		const options = this.model.getOptions();
		const legendItems = svg
			.selectAll("g.legend-item")
			.data(this.model.getDataGroups(), (dataGroup) => dataGroup.name);

		// this.getLegendItemArray()

		const addedLegendItems = legendItems
			.enter()
			.append("g")
			.classed("legend-item", true);

		// Configs
		const checkboxRadius = options.legend.checkbox.radius;

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

		addedLegendItems
			.append("text")
			.merge(legendItems.select("text"))
			.html((d) => d.name)
			.attr("alignment-baseline", "middle");

		this.breakItemsIntoLines(addedLegendItems);

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
	}

	breakItemsIntoLines(addedLegendItems) {
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
		let lastYPosition;
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
					.attr("y", yOffset + yPosition);

				lastYPosition = yPosition;

				// Render checkbox check icon
				if (
					hasDeactivatedItems &&
					legendItem.select("g.check").empty()
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
	}

	addEventListeners() {
		const self = this;
		const svg = this.getContainerSVG();
		const options = this.model.getOptions();

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

				self.services.events.dispatchEvent(
					Events.Legend.ITEM_MOUSEOUT,
					{
						hoveredElement: hoveredItem
					}
				);
			});
	}
}
