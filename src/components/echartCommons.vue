<template>
  <div ref="chartDom"></div>
</template>
<script>
import echarts from "echarts";
export default {
  props: ["options", "name"],
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    /**
     * @method getCustomAnalysis() 刷新“潜客分析”图表
     */
    drawChart() {
      this.chart.setOption(this.options);
    },
  },
  mounted() {
    let chart = this.$refs.chartDom;
    this.chart = echarts.init(chart);
    window.echarts = echarts;
    this.drawChart();
    window.addEventListener("resize", this.chart.resize);
  },
};
</script>