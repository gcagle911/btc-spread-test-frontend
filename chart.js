document.addEventListener('DOMContentLoaded', function () {
  const chartContainer = document.getElementById('chart');
  const statusDiv = document.getElementById('status');
  function setStatus(msg, isError = false) {
    if (statusDiv) {
      statusDiv.textContent = msg;
      statusDiv.style.color = isError ? 'red' : '#fff';
    }
  }
  setStatus('Loading chart…');

  if (!chartContainer) {
    setStatus('Chart container not found!', true);
    console.error('Chart container not found!');
    return;
  }

  // Create chart
  const chart = LightweightCharts.createChart(chartContainer, {
    layout: {
      background: { color: 'black' },
      textColor: 'white'
    },
    width: window.innerWidth,
    height: chartContainer.offsetHeight,
    timeScale: { timeVisible: true, secondsVisible: false },
    rightPriceScale: { visible: true },
    leftPriceScale: { visible: true, borderVisible: true },
    crosshair: { mode: 0 }
  });

  // Series
  const priceSeries = chart.addLineSeries({
    color: 'aqua',
    lineWidth: 2,
    priceScaleId: 'right',
    title: 'BTC Price'
  });

  const ma50 = chart.addLineSeries({
    color: 'white',
    lineWidth: 1,
    priceScaleId: 'left',
    title: 'MA 50'
  });
  const ma100 = chart.addLineSeries({
    color: 'gold',
    lineWidth: 1,
    priceScaleId: 'left',
    title: 'MA 100'
  });
  const ma200 = chart.addLineSeries({
    color: 'pink',
    lineWidth: 1,
    priceScaleId: 'left',
    title: 'MA 200'
  });

  // Helper: ISO to UNIX (seconds)
  const toUnixTime = iso => Math.floor(new Date(iso).getTime() / 1000);

  setStatus('Fetching BTC and MA data…');
  fetch('https://btc-spread-test-pipeline.onrender.com/output-latest.json')
    .then(res => {
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Fetched data:', data);
      if (!Array.isArray(data) || data.length === 0) {
        setStatus('No data returned from API.', true);
        return;
      }

      // Filter and validate
      const filtered = data.filter(d =>
        d.time && d.price != null && d.ma_50 != null && d.ma_100 != null && d.ma_200 != null
      );

      if (filtered.length === 0) {
        setStatus('No valid data points with all required fields.', true);
        return;
      }

      // Prepare series data
      const priceData = filtered.map(d => ({ time: toUnixTime(d.time), value: d.price }));
      const ma50Data = filtered.map(d => ({ time: toUnixTime(d.time), value: d.ma_50 }));
      const ma100Data = filtered.map(d => ({ time: toUnixTime(d.time), value: d.ma_100 }));
      const ma200Data = filtered.map(d => ({ time: toUnixTime(d.time), value: d.ma_200 }));

      priceSeries.setData(priceData);
      ma50.setData(ma50Data);
      ma100.setData(ma100Data);
      ma200.setData(ma200Data);

      setStatus(`Loaded ${filtered.length} data points.`);
    })
    .catch(err => {
      setStatus('Chart error: ' + err.message, true);
      console.error('Chart error:', err);
    });

  // Responsive
  window.addEventListener('resize', () => {
    chart.applyOptions({ width: window.innerWidth, height: chartContainer.offsetHeight });
  });
});
