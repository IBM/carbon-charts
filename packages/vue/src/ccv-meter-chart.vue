<template>
	<div class="ccv-meter-chart"></div>
</template>

<script>
import { MeterChart } from '@carbon/charts';
import CcvBaseChart from './ccv-base-chart.vue';

export default {
	name: 'CcvMeterChart',
	extends: CcvBaseChart,
	mounted() {
		this.coreChart = new MeterChart(this.$el, {
			data: this.data,
			options: this.options,
		});
	},
};
</script>
