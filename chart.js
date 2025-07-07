const chart = LightweightCharts.createChart(document.body, {
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

fetch('https://btc-spread-test-pipeline.onrender.com/output.json')
  .then(response => response.json())
  .then(data => {
    const formattedData = data.map(item => ({
      time: Math.floor(new Date(item.time).getTime() / 1000), // convert ISO to UNIX
      value: item.spread_avg_L20_pct, // plot spread %
    }));
    lineSeries.setData(formattedData);
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });
