<template>
	<div class="ccv-histogram-chart"></div>
</template>

<script>
import { HistogramChart } from '@carbon/charts';
import CcvBaseChart from './ccv-base-chart.vue';

export default {
	name: 'CcvHistogramChart',
	extends: CcvBaseChart,
	mounted() {
		this.coreChart = new HistogramChart(this.$el, {
			data: this.data,
			options: this.options,
		});
	},
};
</script>
