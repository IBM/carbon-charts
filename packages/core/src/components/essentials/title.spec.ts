import { TestEnvironment } from "../../tests/index";

// import the settings for the css prefixes
import settings from "carbon-components/src/globals/js/settings";
import { options } from "./../../configuration";

import { select, selectAll } from "d3-selection";

describe("title component", () => {
	beforeEach(function() {
		const testEnvironment = new TestEnvironment();
		testEnvironment.render();

		this.chart = testEnvironment.getChartReference();
		this.testEnvironment = testEnvironment;
	});

	describe("content", () => {
		it("should match text provided in options", async function(done) {
			const sampleTitle = "My chart";

			const chartEventsService = this.chart.services.events;
			const renderCb = () => {
				const title = select(`g.${settings.prefix}--${options.chart.style.prefix}--title`);

				// Remove event listener for when chart render is finished
				chartEventsService.removeEventListener("render-finished", renderCb);

				expect(title.select("text").html()).toEqual(sampleTitle);

				done();
			};

			// Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});

		it("should set 'x' attribute of text to 0 and 'y' attribute to 20", async function(done) {
			const chartEventsService = this.chart.services.events;

			const renderCb = () => {
				// Remove event listener for when chart render is finished
				chartEventsService.removeEventListener("render-finished", renderCb);

				const titleText = select(`g.${settings.prefix}--${options.chart.style.prefix}--title`).select("text.title");

				expect(titleText.attr("x")).toBe("0");
				expect(titleText.attr("y")).toBe("20");

				done();
			};

			// Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});
	});

	describe("events", () => {
		it("should emit the correct events on mouseenter and mouseout", async function(done) {
			const chartEventsService = this.chart.services.events;

			// Used to capture title events
			const titleEventCatcher = {
				onMouseEnter: () => {},
				onMouseOut: () => {}
			}

			spyOn(titleEventCatcher, "onMouseEnter");
			spyOn(titleEventCatcher, "onMouseOut");

			const renderCb = () => {
				// Remove event listener for when chart render is finished
				chartEventsService.removeEventListener("render-finished", renderCb);

				chartEventsService.addEventListener("show-tooltip", titleEventCatcher.onMouseEnter());
				chartEventsService.addEventListener("hide-tooltip", titleEventCatcher.onMouseOut());

				const title = select(`g.${settings.prefix}--${options.chart.style.prefix}--title`);

				title.dispatch("mouseenter");
				expect(titleEventCatcher.onMouseEnter).toHaveBeenCalled();
				title.dispatch("mouseout");
				expect(titleEventCatcher.onMouseOut).toHaveBeenCalled();

				chartEventsService.removeEventListener("show-tooltip", titleEventCatcher.onMouseEnter());
				chartEventsService.removeEventListener("hide-tooltip", titleEventCatcher.onMouseOut());

				done();
			};

			// Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});
	});

	afterEach(function() {
		this.testEnvironment.destroy();
	});
});
