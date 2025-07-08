document.addEventListener('DOMContentLoaded', function () {
  const chartContainer = document.getElementById('chart');
  const errorDiv = document.getElementById('error');
  if (!chartContainer) {
    console.error('Chart container not found!');
    if (errorDiv) {
      errorDiv.style.display = '';
      errorDiv.textContent = 'Chart container not found!';
    }
    return;
  }

  const chart = LightweightCharts.createChart(chartContainer, {
    layout: {
      background: { color: 'black' },
      textColor: 'white'
    },
    width: window.innerWidth,
    height: window.innerHeight,
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: { visible: true },
    leftPriceScale: {
      visible: true,
      borderVisible: true,
    },
  });

  // Price line
  const priceSeries = chart.addLineSeries({
    color: 'aqua',
    lineWidth: 2,
    priceScaleId: 'right',
  });

  // MA series
  const ma50 = chart.addLineSeries({
    color: 'white',
    lineWidth: 1,
    priceScaleId: 'left',
  });
  const ma100 = chart.addLineSeries({
    color: 'gold',
    lineWidth: 1,
    priceScaleId: 'left',
  });
  const ma200 = chart.addLineSeries({
    color: 'pink',
    lineWidth: 1,
    priceScaleId: 'left',
  });

  // Convert ISO to UNIX timestamp (seconds)
  const toUnixTime = iso => Math.floor(new Date(iso).getTime() / 1000);

  fetch('https://btc-spread-test-pipeline.onrender.com/output-latest.json')
    .then(res => {
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      // CORS check: If CORS is the problem, this will not even resolve
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data or wrong format from API!');
      }
      const filtered = data.filter(d =>
        d.time && d.price != null && d.ma_50 != null && d.ma_100 != null && d.ma_200 != null
      );
      if (filtered.length === 0) {
        throw new Error('No data points with all required fields!');
      }

      priceSeries.setData(filtered.map(d => ({
        time: toUnixTime(d.time),
        value: d.price,
      })));

      ma50.setData(filtered.map(d => ({
        time: toUnixTime(d.time),
        value: d.ma_50,
      })));

      ma100.setData(filtered.map(d => ({
        time: toUnixTime(d.time),
        value: d.ma_100,
      })));

      ma200.setData(filtered.map(d => ({
        time: toUnixTime(d.time),
        value: d.ma_200,
      })));
    })
    .catch(err => {
      console.error('Chart error:', err);
      if (errorDiv) {
        errorDiv.style.display = '';
        errorDiv.textContent = 'Chart error: ' + err.message;
      }
    });

  // Responsive chart
  window.addEventListener('resize', () => {
    chart.applyOptions({ width: window.innerWidth, height: window.innerHeight });
  });
});
