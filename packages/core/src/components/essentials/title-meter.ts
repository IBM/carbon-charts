// Internal Imports
import { Title } from "./title";
import { DOMUtils } from "../../services";
import { Tools } from "../../tools";
import { MeterRanges } from "./../../interfaces/enums";

export class MeterTitle extends Title {
	type = "meter-title";

	render() {
		const dataset = this.model.getDisplayData();
		const options = this.model.getOptions();
		const svg = this.getContainerSVG();
		const { groupMapsTo } = options.data;

		// the title for a meter, is the label for that dataset
		const title = svg.selectAll("text.meter-title")
			.data([dataset[groupMapsTo]]);

		title.enter()
			.append("text")
			.classed("meter-title", true)
			.merge(title)
			.attr("x", 0)
			.attr("y", "1em")
			.text(d => d);

		title.exit().remove();

		// appends the associated percentage after title
		this.appendPercentage();

		// if status ranges are provided (custom or default), display indicator
		this.displayStatus();

		// get the max width of a title (with consideration for the status/percentage)
		const maxWidth = this.getMaxTitleWidth();
		const titleElement = DOMUtils.appendOrSelect(svg, "text.meter-title");

		if (maxWidth > 0 && titleElement.node().getComputedTextLength() > maxWidth) {
			this.truncateTitle(titleElement, maxWidth);
		}
	}

	/**
	 * Appends the corresponding status based on the value and the peak.
	 */
	displayStatus() {
		const value = this.model.getDisplayData().value;
		const svg = this.getContainerSVG();
		const options = this.model.getOptions();

		const containerBounds = DOMUtils.getSVGElementSize(this.parent, { useAttr: true });
		// need to check if the width is 0, and try to use the parent attribute
		// this can happen if the chart is toggled on/off and the height is 0 for the parent, it wont validateDimensions
		const containerWidth = containerBounds.width ? containerBounds.width : this.parent.node().getAttribute("width");

		// size of the status indicator
		const circleSize = Tools.getProperty(options, "meter", "status", "indicatorSize");
		const status = this.model.getStatus();

		// create a group for the icon
		const statusGroup = DOMUtils.appendOrSelect(svg, `g.status-indicator`)
			.classed(`status--${status}`, true)
			.attr("width", circleSize)
			.attr("transform", `translate(${containerWidth - circleSize},  1)`);

		const self = this;
		const icon = statusGroup.selectAll("circle.status")
			.data(status);

		icon
			.enter()
			.append("circle")
			.merge(icon)
			.attr("class", "status")
			.attr("r", circleSize / 2)
			.attr("cx", circleSize / 2)
			.attr("cy", circleSize / 2);

		const innerFillData = status ? [status] : [];
		const innerIcon = statusGroup.selectAll("path.innerFill")
			.data(innerFillData);

		innerIcon.enter()
			.append("path")
			.merge(innerIcon)
			.attr("d", self.getStatusIcon(status))
			.attr("transform", () => status === MeterRanges.DANGER ? "translate(7.703125, 8.484375) rotate(-45.000000) translate(-7.703125, -8.484375)" : null)
			.attr("class", `innerFill`);

		innerIcon.exit().remove();
		icon.exit().remove();
	}

	/**
	 * Appends the associated percentage to the end of the title
	 */
	appendPercentage() {
		const dataValue = this.model.getDisplayData().value;

		// use the title's position to append the percentage to the end
		const svg = this.getContainerSVG();
		const title = DOMUtils.appendOrSelect(svg, "text.meter-title");

		// check if it is enabled
		const data = Tools.getProperty(this.model.getOptions(), "meter", "title", "percentageIndicator", "enabled") === true ?
			[dataValue] : [];

		// append a percentage if it is enabled, update it
		const percentage = svg.selectAll("text.percent-value")
			.data(data);

		// the horizontal offset of the percentage value from the title
		const offset = Tools.getProperty(this.model.getOptions(), "meter", "title", "paddingRight");

		percentage.enter()
			.append("text")
			.classed("percent-value", true)
			.merge(percentage)
			.text(d => `${d}%`)
			.attr("x", +title.attr("x") + title.node().getComputedTextLength() + offset) // set the position to after the title
			.attr("y", title.attr("y"));

		percentage.exit().remove();
	}

	/**
	 * Uses the parent class truncate logic
	 * @param title d3 selection of title element that will be truncated
	 * @param titlestring the original string that needs truncation
	 * @param maxWidth the max width the title can take
	 */
	truncateTitle(title, maxWidth) {
		super.truncateTitle(title, maxWidth);

		// update the position on the percentage to be inline with the title
		const tspan = DOMUtils.appendOrSelect(this.parent, "tspan");
		const offset = this.model.getOptions().meter.title.paddingRight; // horizontal offset of percent from title
		const tspanLength = Math.ceil(tspan.node().getComputedTextLength());

		const percentage = DOMUtils.appendOrSelect(this.parent, "text.percent-value");
		percentage.attr("x", +title.attr("x") + title.node().getComputedTextLength() + tspanLength + offset);
	}

	// computes the maximum space a title can take
	protected getMaxTitleWidth() {
		// get a reference to the title elements to calculate the size the title can be
		const containerBounds = DOMUtils.getSVGElementSize(this.parent, { useAttr: true });


		// need to check if the width is 0, and try to use the parent attribute
		const containerWidth = containerBounds.width ? containerBounds.width : this.parent.node().getAttribute("width");

		const percentage = DOMUtils.appendOrSelect(this.parent, "text.percent-value");
		// the title needs to fit the width of the container without crowding the status, and percentage value
		const offset = Tools.getProperty(this.model.getOptions(), "meter", "title", "paddingRight"); // horizontal offset of percent from title
		const percentageWidth = percentage.node().getComputedTextLength();

		const statusGroup = DOMUtils.appendOrSelect(this.parent, "g.status-indicator").node();
		const statusWidth = DOMUtils.getSVGElementSize(statusGroup, { useBBox: true }).width + Tools.getProperty(this.model.getOptions(), "meter", "status", "paddingLeft");

		return containerWidth - percentageWidth - offset - statusWidth;
	}

	/**
	 * Get the associated status icon for the data
	 * @param status the active status for the meter chart
	 */
	protected getStatusIcon(status) {
		switch (status) {
			case MeterRanges.SUCCESS:
				return "M6.875 11.3125 3.75 8.1875 4.74375 7.25 6.875 9.34375 11.50625 4.75 12.5 5.7375 Z";
			case MeterRanges.DANGER:
				return "M7 3 8.40625 3 8.40625 13.96875 7 13.96875 Z";
			case MeterRanges.WARNING:
				return "M7.9375,11.125 C7.41973305,11.125 7,11.544733 7,12.0625 C7,12.580267 7.41973305,13 7.9375,13 C8.45526695,13 8.875,12.580267 8.875,12.0625 C8.875,11.544733 8.45526695,11.125 7.9375,11.125 M7.3125, 3 8.5625, 3 8.5625, 9.875 7.3125, 9.875, 7.3125, 3 Z";
		}
	}
}
