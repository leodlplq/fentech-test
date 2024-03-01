<script setup lang="ts">
import { CategoryScale, Chart as ChartJS, Colors, Legend, LineElement, LinearScale, PointElement, TimeScale, Title, Tooltip } from 'chart.js';
import 'chartjs-adapter-luxon';
import { nextTick, onMounted, ref } from 'vue';
import { ChartComponentRef, Line } from 'vue-chartjs';
import DescriptionTable from './components/DescriptionTable.vue';
import Modal from './components/Modal.vue';
import IntervalForm from './components/form/IntervalForm.vue';
import UniqueForm from './components/form/UniqueForm.vue';
// import { stockData } from './data';
import { ChartJsPluginRangeSelect } from "./plugins/chartjs-plugin-range-select";
import { useDataStore } from "./stores/data";
import { useDescriptionStore } from "./stores/description";
import { useModalStore } from "./stores/modal";
import { fetchData } from './utils/data';
import { down, skipped } from './utils/function';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Colors, TimeScale, new ChartJsPluginRangeSelect())

const descriptions = useDescriptionStore()
const modal = useModalStore()
const data = useDataStore()

const chart = ref<ChartComponentRef | undefined>();

const chartData = ref({
  labels: ["test"],
  datasets: [
    {
      data: [],
    },
  ],
});

const datasetOption = {
  borderColor: "rgb(192,75,75)",
  segment: {
    borderColor: (ctx) =>
      skipped(ctx, "rgb(0,0,0,0.2)") || down(ctx, "rgb(75, 192, 192)"),
  },
  label: "AAPL",
};

const chartOptions = ref({
  onClick: (e: Event) => {
    if (!descriptions.isInterval) {
      const points = chart.value.chart.getElementsAtEventForMode(
        e,
        "nearest",
        { intersect: true },
        true
      );
      if (points[0]) {
        const index = points[0].index;
        const datasetIndex = points[0].datasetIndex;
        const label = chart.value?.chart?.data.labels[index];
        const value =
          chart.value?.chart?.data.datasets[datasetIndex].data[index];

        descriptions.selectedPoint = { label, value };
        modal.openModal();
      }
    }
  },
  rangeSelect: {
    onSelectionChanged: (result) => {
      if (result[0].length > 0) {
        descriptions.isInterval = true;

        const last = result[0][0];
        const first = result[0][result[0].length - 1];
        descriptions.selectedInterval = { first, last };

        modal.openModal();
      }
    },
  },
  fill: false,
  interaction: {
    intersect: false,
  },
  radius: 0,
  responsive: true,
  scales: {
    x: {
      type: "time",
      time: {
        // Luxon format string
        tooltipFormat: "DD T",
      },
      ticks: {
        callback: function (val, index) {
          // Hide every 2nd tick label
          return index % 5 === 0 ? this.getLabelForValue(val) : "";
        },
        color: "white",
      },
    },
    y: {
      ticks: {
        callback: function (val, index) {
          return "$ " + this.getLabelForValue(val);
        },
        color: "white",
        grace: 10,
        stepSize: 0.5,
      },
    },
  },
  plugins: [ChartJsPluginRangeSelect],
});

onMounted(async () => {
	await nextTick()
  const data = await fetchData(datasetOption)
  chartData.value = data
})

</script>

<template>
  <Modal title="Ajouter une description">
    <UniqueForm v-if="!descriptions.isInterval"/>
    <IntervalForm v-else/>  
  </Modal>
  <div class="container">
    <div class="chart-container">
      <Line
        ref="chart"
        v-if="data.loaded"
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
      />
    </div>
    <div class="table-container">
      <h3>Your data</h3>
      <DescriptionTable :data="descriptions.list"/>
    </div>
  </div>
  
</template>

<style>
  .container{
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 100px;
  }

  .chart-container{
    padding: 20px;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .table-container{
    width: 100%;
    height: 100%;
    padding: 20px;
  }

  .input-container{
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  form{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
