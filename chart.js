window.addEventListener('DOMContentLoaded', () => {
  const chart = LightweightCharts.createChart(document.body, {
    width: window.innerWidth,
    height: window.innerHeight,
    layout: {
      background: { color: 'black' },
      textColor: 'white',
    },
    grid: {
      vertLines: { color: '#444' },
      horzLines: { color: '#444' },
    },
  });

  const lineSeries = chart.addLineSeries({
    color: 'aqua',
    lineWidth: 2,
  });

  fetch('https://btc-spread-test-pipeline.onrender.com/output.json')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched data:', data); // ✅ shows what’s being plotted
      const formattedData = data.map(item => ({
        time: Math.floor(new Date(item.time).getTime() / 1000), // UNIX timestamp
        value: item.spread_avg_L20_pct,
      }));
      lineSeries.setData(formattedData);
    })
    .catch(error => {
      console.error('Error loading data:', error);
    });
});
