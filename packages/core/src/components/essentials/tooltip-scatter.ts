import { Tooltip } from "./tooltip";
import { Tools } from "../../tools";
import { TooltipTypes } from "./../../interfaces";

export class TooltipScatter extends Tooltip {
	getTooltipHTML(datum: any, type: TooltipTypes) {
		if (type === TooltipTypes.TITLE) {
			// the main tooltip component handles title styles
			return super.getTooltipHTML(datum, type);
		} else if (type === TooltipTypes.LEGEND) {
			return `<div class="legend-tooltip"><p class="label">${datum.name}</p></div>`;
		} else if (type === TooltipTypes.AXISLABEL) {
			return `<div class="axis-tooltip"><p class="label">${datum}</p></div>`;
		}

		const { groupMapsTo } = this.model.getOptions().data;
		const rangeIdentifier = this.services.cartesianScales.getRangeIdentifier();

		const userProvidedValueFormatter = Tools.getProperty(
			this.model.getOptions(),
			"tooltip",
			"valueFormatter"
		);
		const formattedValue = userProvidedValueFormatter
			? userProvidedValueFormatter(datum[rangeIdentifier])
			: datum[rangeIdentifier].toLocaleString("en");

		// For the tooltip color, we always want the normal stroke color, not dynamically determined by data value.
		const indicatorColor = this.model.getStrokeColor(datum[groupMapsTo]);

		return `
			<div class="datapoint-tooltip">
				<a style="background-color:${indicatorColor}" class="tooltip-color"></a>
				<p class="label">${datum[groupMapsTo]}</p>
				<p class="value">${formattedValue}</p>
			</div>`;
	}
}
