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
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(d =>
      d.time && d.price && d.ma_50 && d.ma_100 && d.ma_200
    );

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
  .catch(err => console.error('Chart error:', err));
