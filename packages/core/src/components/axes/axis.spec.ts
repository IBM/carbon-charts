import { TestEnvironment } from "../../tests/index";

import { select } from "d3-selection";

describe("Axis component", () => {
	beforeEach(function() {
		const testEnvironment = new TestEnvironment();
		testEnvironment.render();

		this.chart = testEnvironment.getChartReference();
		this.testEnvironment = testEnvironment;
    });

    describe(("content"), () => {
        it("should set the left axis values within the range domain", async function(done) {
            const chartEventsService = this.chart.services.events;
            const scales = this.chart.services.cartesianScales;

            const renderCb = () => {
                chartEventsService.removeEventListener("render-finished", renderCb);
                const [min, max] = scales.getRangeScale().domain();

                const leftAxisContent = select("g.left").select("g.ticks").selectAll("g.tick").select("text");

                leftAxisContent.each(function() {
                    const leftAxisItem = parseInt(select(this).text().replace(/,/g, ''));
                    expect(leftAxisItem).toBeLessThanOrEqual(max);
                    expect(leftAxisItem).toBeGreaterThanOrEqual(min);
                });

                done();
            }
            // Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
        });

        it("should set the correct labels within the bottom axis", async function(done) {
            const chartEventsService = this.chart.services.events;
            const scales = this.chart.services.cartesianScales;

            const renderCb = () => {
                chartEventsService.removeEventListener("render-finished", renderCb);
                const bottomAxisDomain = scales.getDomainScale().domain();

                const bottomAxisContent = select("g.bottom").select("g.ticks").selectAll("g.tick").select("text");

                bottomAxisContent.each(function() {
                    expect(bottomAxisDomain.includes(select(this).text())).toBe(true);
                });

                done();
            }
            // Add event listener for when chart render is finished
			chartEventsService.addEventListener("render-finished", renderCb);
        });

        afterEach(function() {
            this.testEnvironment.destroy();
        });
    });
});
