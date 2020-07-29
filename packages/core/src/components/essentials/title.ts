// Internal Imports
import { Component } from "../component";
import { DOMUtils } from "../../services";
import { Events } from "./../../interfaces";

export class Title extends Component {
	type = "title";

	render() {
		const svg = this.getContainerSVG();

		const text = svg
			.selectAll("text.title")
			.data([this.model.getOptions().title]);

		text.enter()
			.append("text")
			.classed("title", true)
			.merge(text)
			.attr("x", 0)
			.attr("y", "1em")
			.html((d) => d);

		// check the max space the title has to render
		const maxWidth = this.getMaxTitleWidth();
		const title = DOMUtils.appendOrSelect(svg, "text.title");

		// check if title needs truncation (and tooltip support)
		if (title.node().getComputedTextLength() > maxWidth && maxWidth > 0) {
			this.truncateTitle(title, maxWidth);
		}
		text.exit().remove();
	}

	/**
	 * Truncates title creating ellipses and attaching tooltip for exposing full title.
	 */
	truncateTitle(title, maxWidth) {
		// sanity check to prevent stack overflow on binary search
		if (maxWidth <= 0) {
			return;
		}

		const untruncatedTitle = title.text();
		// check if the title is too big for the containing svg
		if (title.node().getComputedTextLength() > maxWidth) {
			// append the ellipses to their own tspan to calculate the text length
			title.append("tspan").text("...");

			// get the bounding width including the elipses '...'
			const tspanLength = DOMUtils.appendOrSelect(title, "tspan")
				.node()
				.getComputedTextLength();

			// with elipses
			const titleString = title.text();

			// get the index for creating the max length substring that fit within the svg
			// use one less than the index to avoid crowding (the elipsis)
			const substringIndex = this.getSubstringIndex(
				title.node(),
				0,
				titleString.length - 1,
				maxWidth - tspanLength
			);

			// use the substring as the title
			title
				.html(titleString.substring(0, substringIndex - 1))
				.append("tspan")
				.text("...");

			// add events for displaying the tooltip with the title
			const self = this;
			title
				.on("mouseover", function () {
					self.services.events.dispatchEvent(Events.Tooltip.SHOW, {
						hoveredElement: title,
						content: untruncatedTitle
					});
				})
				.on("mousemove", function () {
					self.services.events.dispatchEvent(Events.Tooltip.MOVE);
				})
				.on("mouseout", function () {
					self.services.events.dispatchEvent(Events.Tooltip.HIDE);
				});
		}
	}

	// computes the maximum space a title can take
	protected getMaxTitleWidth() {
		const containerWidth = DOMUtils.getSVGElementSize(
			this.services.domUtils.getMainSVG(),
			{ useAttr: true }
		).width;
		return containerWidth;
	}

	/**
	 * Returns the index for a maximum length substring that is less than the width parameter.
	 * @param title the title node used for getting the text lengths of substrings
	 * @param start the start index for the binary search
	 * @param end the end index for the binary search
	 * @param width the width of the svg container that holds the title
	 */
	protected getSubstringIndex(title, start, end, width) {
		const mid = Math.floor((end + start) / 2);
		if (title.getSubStringLength(0, mid) > width) {
			return this.getSubstringIndex(title, start, mid, width);
		} else if (title.getSubStringLength(0, mid) < width) {
			if (title.getSubStringLength(0, mid + 1) > width) {
				return mid;
			}
			return this.getSubstringIndex(title, mid, end, width);
		} else {
			return mid;
		}
	}
}
