// Internal Imports
import { Component } from "../component";
import * as Configuration from "../../configuration";
import { DOMUtils } from "../../services";

export class Spacer extends Component {
	type = "spacer";

	render() {
		DOMUtils.appendOrSelect(this.getContainerSVG(), "rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr(
				"width",
				this.configs.size || Configuration.spacers.default.size
			)
			.attr(
				"height",
				this.configs.size || Configuration.spacers.default.size
			)
			.attr("opacity", 0);
	}
}
