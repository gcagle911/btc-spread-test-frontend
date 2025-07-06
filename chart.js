const chart = LightweightCharts.createChart(document.getElementById('tv_chart'), {
  width: window.innerWidth,
  height: window.innerHeight,
  layout: {
    background: { color: 'black' },
    textColor: 'white',
  },
});

const lineSeries = chart.addLineSeries({
  color: 'aqua',
  lineWidth: 2,
});

lineSeries.setData([
  { time: 1650000000, value: 0.01 },
  { time: 1650000060, value: 0.012 },
  { time: 1650000120, value: 0.009 },
  { time: 1650000180, value: 0.011 },
]);
