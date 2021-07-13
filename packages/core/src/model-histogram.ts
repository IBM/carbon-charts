// Internal Imports
import { ChartModelCartesian } from './model-cartesian-charts';

/** The histogram chart model layer */
export class HistogramChartModel extends ChartModelCartesian {
	constructor(services: any) {
		super(services);
	}

	setHistogramBins(bins) {
		this.set({ bins });
	}

	getHistogramBins() {
		return this.get('bins');
	}
}
