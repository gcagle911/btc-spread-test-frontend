const chart = LightweightCharts.createChart(document.getElementById('chart'), {
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
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then(data => {
    console.log('Fetched data:', data);

    if (!Array.isArray(data) || data.length === 0) {
      document.getElementById('chart').innerHTML = '<div style="color:white;text-align:center;padding-top:20vh;">No data available</div>';
      return;
    }

    const filtered = data.filter(d =>
      d.time && d.price && d.ma_50 && d.ma_100 && d.ma_200
    );

    if (filtered.length === 0) {
      document.getElementById('chart').innerHTML = '<div style="color:white;text-align:center;padding-top:20vh;">No valid data to display</div>';
      return;
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
    document.getElementById('chart').innerHTML = `<div style="color:white;text-align:center;padding-top:20vh;">Chart error: ${err.message}</div>`;
    console.error('Chart error:', err);
  });
