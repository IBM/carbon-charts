import { Chart } from "./chart";
import { ChartModelCartesian } from "./model-cartesian-charts";
import {
	LayoutDirection,
	LayoutGrowth,
	LegendOrientations,
	LegendPositions,
	ChartConfig,
	AxisChartOptions,
	AxisPositions,
	ScaleTypes
} from "./interfaces";
import {
	ChartBrush,
	ChartClip,
	LayoutComponent,
	Legend,
	Modal,
	Title,
	AxisChartsTooltip,
	Spacer,
	Toolbar,
	ZoomBar
} from "./components";
import { Tools } from "./tools";

import { CartesianScales, Curves, Zoom } from "./services";

export class AxisChart extends Chart {
	services: any = Object.assign(this.services, {
		cartesianScales: CartesianScales,
		curves: Curves,
		zoom: Zoom
	});
	model: ChartModelCartesian = new ChartModelCartesian(this.services);

	constructor(holder: Element, chartConfigs: ChartConfig<AxisChartOptions>) {
		super(holder, chartConfigs);
	}

	protected getAxisChartComponents(graphFrameComponents: any[]) {
		const isZoomBarEnabled = Tools.getProperty(
			this.model.getOptions(),
			"zoomBar",
			AxisPositions.TOP,
			"enabled"
		);
		const toolbarEnabled = Tools.getProperty(
			this.model.getOptions(),
			"toolbar",
			"enabled"
		);

		this.services.cartesianScales.findDomainAndRangeAxes(); // need to do this before getMainXAxisPosition()
		const mainXAxisPosition = this.services.cartesianScales.getMainXAxisPosition();
		const mainXScaleType = Tools.getProperty(
			this.model.getOptions(),
			"axes",
			mainXAxisPosition,
			"scaleType"
		);
		// @todo - Zoom Bar only supports main axis at BOTTOM axis and time scale for now
		const zoomBarEnabled =
			isZoomBarEnabled &&
			mainXAxisPosition === AxisPositions.BOTTOM &&
			mainXScaleType === ScaleTypes.TIME;

		// @todo - should check if zoom bar in all axes are locked
		const isZoomBarLocked = this.services.zoom.isZoomBarLocked(
			AxisPositions.TOP
		);

		const titleAvailable = !!this.model.getOptions().title;
		const titleComponent = {
			id: "title",
			components: [new Title(this.model, this.services)],
			growth: {
				x: LayoutGrowth.STRETCH,
				y: LayoutGrowth.FIXED
			}
		};

		const toolbarComponent = {
			id: "toolbar",
			components: [new Toolbar(this.model, this.services)],
			growth: {
				x: LayoutGrowth.PREFERRED,
				y: LayoutGrowth.FIXED
			}
		};

		const headerComponent = {
			id: "header",
			components: [
				new LayoutComponent(
					this.model,
					this.services,
					[
						// always add title to keep layout correct
						titleComponent,
						...(toolbarEnabled ? [toolbarComponent] : [])
					],
					{
						direction: LayoutDirection.ROW
					}
				)
			],
			growth: {
				x: LayoutGrowth.PREFERRED,
				y: LayoutGrowth.FIXED
			}
		};

		const legendComponent = {
			id: "legend",
			components: [new Legend(this.model, this.services)],
			growth: {
				x: LayoutGrowth.PREFERRED,
				y: LayoutGrowth.FIXED
			}
		};

		// if all zoom bars are locked, no need to add chart brush
		if (zoomBarEnabled && !isZoomBarLocked) {
			graphFrameComponents.push(
				new ChartClip(this.model, this.services),
				new ChartBrush(this.model, this.services)
			);
		}

		const graphFrameComponent = {
			id: "graph-frame",
			components: graphFrameComponents,
			growth: {
				x: LayoutGrowth.STRETCH,
				y: LayoutGrowth.FIXED
			}
		};

		const isLegendEnabled =
			this.model.getOptions().legend.enabled !== false;

		// Decide the position of the legend in reference to the chart
		let fullFrameComponentDirection = LayoutDirection.COLUMN;
		if (isLegendEnabled) {
			const legendPosition = Tools.getProperty(
				this.model.getOptions(),
				"legend",
				"position"
			);
			if (legendPosition === LegendPositions.LEFT) {
				fullFrameComponentDirection = LayoutDirection.ROW;

				if (!this.model.getOptions().legend.orientation) {
					this.model.getOptions().legend.orientation =
						LegendOrientations.VERTICAL;
				}
			} else if (legendPosition === LegendPositions.RIGHT) {
				fullFrameComponentDirection = LayoutDirection.ROW_REVERSE;

				if (!this.model.getOptions().legend.orientation) {
					this.model.getOptions().legend.orientation =
						LegendOrientations.VERTICAL;
				}
			} else if (legendPosition === LegendPositions.BOTTOM) {
				fullFrameComponentDirection = LayoutDirection.COLUMN_REVERSE;
			}
		}

		const legendSpacerComponent = {
			id: "spacer",
			components: [new Spacer(this.model, this.services)],
			growth: {
				x: LayoutGrowth.PREFERRED,
				y: LayoutGrowth.FIXED
			}
		};

		const fullFrameComponent = {
			id: "full-frame",
			components: [
				new LayoutComponent(
					this.model,
					this.services,
					[
						...(isLegendEnabled ? [legendComponent] : []),
						...(isLegendEnabled ? [legendSpacerComponent] : []),
						graphFrameComponent
					],
					{
						direction: fullFrameComponentDirection
					}
				)
			],
			growth: {
				x: LayoutGrowth.STRETCH,
				y: LayoutGrowth.FIXED
			}
		};

		const zoomBarComponent = {
			id: "zoom-bar",
			components: [new ZoomBar(this.model, this.services)],
			growth: {
				x: LayoutGrowth.PREFERRED,
				y: LayoutGrowth.FIXED
			}
		};

		const topLevelLayoutComponents = [];
		// header component is required for either title or toolbar
		if (titleAvailable || toolbarEnabled) {
			topLevelLayoutComponents.push(headerComponent);

			const titleSpacerComponent = {
				id: "spacer",
				components: [
					new Spacer(
						this.model,
						this.services,
						toolbarEnabled ? { size: 15 } : undefined
					)
				],
				growth: {
					x: LayoutGrowth.PREFERRED,
					y: LayoutGrowth.FIXED
				}
			};

			topLevelLayoutComponents.push(titleSpacerComponent);
		}
		if (zoomBarEnabled) {
			topLevelLayoutComponents.push(zoomBarComponent);
		}
		topLevelLayoutComponents.push(fullFrameComponent);

		return [
			new AxisChartsTooltip(this.model, this.services),
			new Modal(this.model, this.services),
			new LayoutComponent(
				this.model,
				this.services,
				topLevelLayoutComponents,
				{
					direction: LayoutDirection.COLUMN
				}
			)
		];
	}
}
