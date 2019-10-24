import { TestEnvironment } from "../../tests/index";

import { select } from "d3-selection";

describe("legend component", () => {
	beforeEach(function() {
		const testEnvironment = new TestEnvironment();
		testEnvironment.render();

		this._chart = testEnvironment.getChartReference();
		this._testEnvironment = testEnvironment;
	});

	describe("content", () => {
		it("should have same amount of datasets", async function(done) {
			const data = this._testEnvironment.chartData;
			const numberOfDatasets = data.datasets.length;

			const chartEventsService= this._chart.services.events;

			const renderCb = () => {
				// Remove render event listener
				chartEventsService.removeEventListener("render-finished", renderCb);

				const numberOfLegendItems = select("g.bx--cc--legend").selectAll("g.legend-item").size();
				expect(numberOfLegendItems).toEqual(numberOfDatasets);

				done();
			};

			// Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
		});
	});

	afterEach(function() {
		this._testEnvironment.destroy();
	});
});
