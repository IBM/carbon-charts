import { TestEnvironment } from "../../tests/index";

// import the settings for the css prefixes
import settings from "carbon-components/src/globals/js/settings";
import { options, legend } from "./../../configuration";

import { select, selectAll } from "d3-selection";
import { color } from "d3";
import * as colorPalettes from "../../services/colorPalettes";

describe("legend component", () => {
	beforeEach(function() {
		const testEnvironment = new TestEnvironment();
		testEnvironment.render();

		this.chart = testEnvironment.getChartReference();
		this.testEnvironment = testEnvironment;
	});

	describe("content", () => {
		it("should have same amount of datasets", async function(done) {
			const data = this.testEnvironment.chartData;
			const numberOfDatasets = data.datasets.length;

			const chartEventsService = this.chart.services.events;

			const renderCb = () => {
				// Remove render event listener
				chartEventsService.removeEventListener("render-finished", renderCb);

				const numberOfLegendItems = select(`g.${settings.prefix}--${options.chart.style.prefix}--legend`).selectAll("g.legend-item").size();
				expect(numberOfLegendItems).toEqual(numberOfDatasets);

				done();
			};

			// Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});

		it("should set the correct legend titles", async function(done) {
			const data = this.testEnvironment.chartData;
			const chartEventsService = this.chart.services.events;

			const renderCb = () => {
				// Remove render event listener
				chartEventsService.removeEventListener("render-finished", renderCb);

				const legendItems = select(`g.${settings.prefix}--${options.chart.style.prefix}--legend`).selectAll("g.legend-item");

				const legendLabels = data.datasets.map(dataset => dataset.label);

				legendItems.each(function(d, i) {
					expect(select(this).text()).toEqual(legendLabels[i]);
				});

				done();
			}

			// Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});

		it("should set the correct colors", async function(done) {
			const data = this.testEnvironment.chartData;
			const chartEventsService = this.chart.services.events;

			const renderCb = () => {
				// Remove render event listener
				chartEventsService.removeEventListener("render-finished", renderCb);

				const legendCheckBoxes = select(`g.${settings.prefix}--${options.chart.style.prefix}--legend`).selectAll("g.legend-item").select("rect");

				const checkBoxColors= colorPalettes.DEFAULT.map(defaultColor => color(defaultColor) + "");

				legendCheckBoxes.each(function(d, i) {
					expect(select(this).style("fill")).toEqual(checkBoxColors[i]);
				});

				done();
			}

			// Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});

		it("should set the correct width and height for the legend checkboxes", async function(done) {
			const chartEventsService = this.chart.services.events;

			const renderCb = () => {
				// Remove render event listener
				chartEventsService.removeEventListener("render-finished", renderCb);

				const legendCheckBoxes = select(`g.${settings.prefix}--${options.chart.style.prefix}--legend`).selectAll("g.legend-item").select("rect");

				legendCheckBoxes.each(function() {
					expect(select(this).style("width")).toEqual(`${+legend.checkbox.radius * 2}px`);
					expect(select(this).style("height")).toEqual(`${+legend.checkbox.radius * 2}px`);
				});

				done();
			}

			// Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});
	});

	describe("events", () => {
		it("should emit the correct events on mouseover, mouseclick and mouseout", async function(done) {
			const chartEventsService = this.chart.services.events;

			// Used to capture legend events.
			const legendEventCatcher = {
				onItemHover: () => {},
				onMouseOut: () => {},
				onMouseClick: () => {}
			};

			spyOn(legendEventCatcher, "onItemHover");
			spyOn(legendEventCatcher, "onMouseOut");
			spyOn(legendEventCatcher, "onMouseClick");

            const renderCb = () => {
				// Remove render event listener
				chartEventsService.removeEventListener("render-finished", renderCb);

				// Add listeners for legend events
				chartEventsService.addEventListener("legend-item-onhover", legendEventCatcher.onItemHover());
				chartEventsService.addEventListener("legend-item-onmouseout", legendEventCatcher.onMouseOut());
				chartEventsService.addEventListener("legend-item-onclick", legendEventCatcher.onMouseClick());

                const chartLegendItem = select(`g.${settings.prefix}--${options.chart.style.prefix}--legend`).select("g.legend-item");

				chartLegendItem.dispatch("mouseover");
				expect(legendEventCatcher.onItemHover).toHaveBeenCalled();
				chartLegendItem.dispatch("mouseclick");
				expect(legendEventCatcher.onMouseClick).toHaveBeenCalled();
				chartLegendItem.dispatch("mouseout");
				expect(legendEventCatcher.onMouseOut).toHaveBeenCalled();

				// Remove onhover, onmouseout, and onclick event listeners
				chartEventsService.removeEventListener("legend-item-onhover", legendEventCatcher.onItemHover());
				chartEventsService.removeEventListener("legend-item-onmouseout", legendEventCatcher.onMouseOut());
				chartEventsService.removeEventListener("legend-item-onclick", legendEventCatcher.onMouseClick());

				done();
            }

            // Add event listener for when chart render is finished
            chartEventsService.addEventListener("render-finished", renderCb);
        });
	});

	describe("functionality", () => {
		it("should show only one group of dots when legend item is clicked", async function(done) {
			const chartEventsService = this.chart.services.events;

			const renderCb = () => {
				// Remove render event listener
				chartEventsService.removeEventListener("render-finished", renderCb);

				// Need to used dispatchEvent on an HTMLElement in order for the click
				// to trigger the expected changes
				const chartLegendItem: HTMLElement = document
					.querySelector(`g.${settings.prefix}--${options.chart.style.prefix}--legend`)
					.querySelector("g.legend-item") as HTMLElement;

				chartLegendItem.dispatchEvent(new Event("click"));

				setTimeout(() => {
					const scatterDotGroup = select(`g.${settings.prefix}--${options.chart.style.prefix}--scatter`).selectAll("g.dots");
					expect(scatterDotGroup.size()).toBe(1);
					done();
				}, 1000);
			}

            // Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});

		it("should set all but the selected legend rectangle to have no fill", async function(done) {
			const chartEventsService = this.chart.services.events;

			const renderCb = () => {
				// Remove render event listener
				chartEventsService.removeEventListener("render-finished", renderCb);

				// Need to used dispatchEvent on an HTMLElement in order for the click
				// to trigger the expected changes
				const chartLegendItem: HTMLElement = document
					.querySelector(`g.${settings.prefix}--${options.chart.style.prefix}--legend`)
					.querySelector("g.legend-item") as HTMLElement;

				chartLegendItem.dispatchEvent(new Event("click"));

				setTimeout(() => {
					const legendCheckBoxes = select(`g.${settings.prefix}--${options.chart.style.prefix}--legend`).selectAll("g.legend-item").select("rect");
					legendCheckBoxes.each(function(d, i) {
						if (i > 0) {
							expect(select(this).style("fill") === "rgb(0, 0, 0)" || select(this).style("fill") === "").toBe(true);
						}
						done();
					});
				}, 1000);
			}

            // Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});

		it("should change opacity of all dots on mouseover of a legend item except the corresponding dots to the hovered item", async function(done) {
			const data = this.testEnvironment.chartData;
			const chartEventsService = this.chart.services.events;

			const renderCb = () => {
				// Remove render event listener
				chartEventsService.removeEventListener("render-finished", renderCb);

				// Need to used dispatchEvent on an HTMLElement in order for the click
				// to trigger the expected changes
				const chartLegendItem: HTMLElement = document
					.querySelector(`g.${settings.prefix}--${options.chart.style.prefix}--legend`)
					.querySelector("g.legend-item") as HTMLElement;

				chartLegendItem.dispatchEvent(new Event("mouseover"));

				setTimeout(() => {
					const scatterDotGroup = select(`g.${settings.prefix}--${options.chart.style.prefix}--scatter`).selectAll("g.dots");

					scatterDotGroup.each(function() {
						select(this).selectAll("circle.dot").each(function() {
							// Only check the opacity of the dots which are not the same color as the hovered legend item.
							if(!(select(this).style("fill") === color(colorPalettes.DEFAULT[0]) + "")) {
								expect(select(this).style("opacity")).not.toBe("1");
							}
						});
					});

					done();
				}, 1000);
			}

            // Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});
	});

	afterEach(function() {
		this.testEnvironment.destroy();
	});
});
