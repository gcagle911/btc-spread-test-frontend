const chart = LightweightCharts.createChart(document.body, {
  layout: { background: { color: 'black' }, textColor: 'white' },
  rightPriceScale: { visible: true },
  leftPriceScale: { visible: true },
  timeScale: { timeVisible: true, secondsVisible: false },
  width: window.innerWidth,
  height: window.innerHeight,
});

// BTC Price line on right Y-axis
const priceLine = chart.addLineSeries({
  color: 'aqua',
  lineWidth: 2,
  priceScaleId: 'right',
});

// Spread MAs on left Y-axis
const ma50 = chart.addLineSeries({
  color: 'white',
  lineWidth: 2,
  priceScaleId: 'left',
});
const ma100 = chart.addLineSeries({
  color: 'gold',
  lineWidth: 2,
  priceScaleId: 'left',
});
const ma200 = chart.addLineSeries({
  color: 'pink',
  lineWidth: 2,
  priceScaleId: 'left',
});

// Convert time to Unix timestamp (in seconds)
const toUnixTime = timeStr => Math.floor(new Date(timeStr).getTime() / 1000);

fetch('https://btc-spread-test-pipeline.onrender.com/output-latest.json')
  .then(response => response.json())
  .then(data => {
    const cleanData = data.filter(d =>
      d.time && d.price && d.ma_50 && d.ma_100 && d.ma_200
    );

    priceLine.setData(cleanData.map(d => ({
      time: toUnixTime(d.time),
      value: d.price,
    })));
    ma50.setData(cleanData.map(d => ({
      time: toUnixTime(d.time),
      value: d.ma_50,
    })));
    ma100.setData(cleanData.map(d => ({
      time: toUnixTime(d.time),
      value: d.ma_100,
    })));
    ma200.setData(cleanData.map(d => ({
      time: toUnixTime(d.time),
      value: d.ma_200,
    })));
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });
