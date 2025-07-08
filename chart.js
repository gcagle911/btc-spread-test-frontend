const chart = LightweightCharts.createChart(document.body, {
  layout: {
    background: { color: 'black' },
    textColor: 'white',
  },
  rightPriceScale: {
    visible: true,
  },
  leftPriceScale: {
    visible: true,
    scaleMargins: {
      top: 0.2,
      bottom: 0.2,
    },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
  width: window.innerWidth,
  height: window.innerHeight,
});

// Price candles
const candleSeries = chart.addCandlestickSeries({ priceScaleId: 'right' });

// Spread MA lines (on left axis)
const ma50 = chart.addLineSeries({ color: 'white', lineWidth: 2, priceScaleId: 'left' });
const ma100 = chart.addLineSeries({ color: 'gold', lineWidth: 2, priceScaleId: 'left' });
const ma200 = chart.addLineSeries({ color: 'pink', lineWidth: 2, priceScaleId: 'left' });

// Debug label
const debugDiv = document.createElement('div');
debugDiv.style.position = 'absolute';
debugDiv.style.top = '10px';
debugDiv.style.left = '10px';
debugDiv.style.color = 'white';
debugDiv.style.fontSize = '14px';
document.body.appendChild(debugDiv);

// Fetch data from latest JSON
fetch('https://btc-spread-test-pipeline.onrender.com/output-latest.json')
  .then(response => response.json())
  .then(data => {
    const candles = data.map(d => ({
      time: Math.floor(new Date(d.time).getTime() / 1000),
      open: d.price,
      high: d.price,
      low: d.price,
      close: d.price,
    }));

    const line50 = data
      .filter(d => d.ma_50 !== null)
      .map(d => ({
        time: Math.floor(new Date(d.time).getTime() / 1000),
        value: d.ma_50,
      }));

    const line100 = data
      .filter(d => d.ma_100 !== null)
      .map(d => ({
        time: Math.floor(new Date(d.time).getTime() / 1000),
        value: d.ma_100,
      }));

    const line200 = data
      .filter(d => d.ma_200 !== null)
      .map(d => ({
        time: Math.floor(new Date(d.time).getTime() / 1000),
        value: d.ma_200,
      }));

    candleSeries.setData(candles);
    ma50.setData(line50);
    ma100.setData(line100);
    ma200.setData(line200);

    debugDiv.innerText = `Loaded: ${data.length} points`;
  });
