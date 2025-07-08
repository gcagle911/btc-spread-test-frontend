const chartContainer = document.createElement('div');
chartContainer.style.position = 'absolute';
chartContainer.style.top = '0';
chartContainer.style.left = '0';
chartContainer.style.right = '0';
chartContainer.style.bottom = '0';
document.body.style.margin = '0';
document.body.appendChild(chartContainer);

const chart = LightweightCharts.createChart(chartContainer, {
  layout: {
    background: { color: 'black' },
    textColor: 'white',
  },
  rightPriceScale: {
    visible: true,
  },
  leftPriceScale: {
    visible: true,
    borderColor: 'gray',
    scaleMargins: { top: 0.2, bottom: 0.2 },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
  width: window.innerWidth,
  height: window.innerHeight,
});

// BTC Price Line (aqua, right axis)
const btcLine = chart.addLineSeries({
  color: 'aqua',
  lineWidth: 2,
  priceScaleId: 'right',
});

// Spread MAs (left axis)
const ma50 = chart.addLineSeries({ color: 'white', lineWidth: 2, priceScaleId: 'left' });
const ma100 = chart.addLineSeries({ color: 'gold', lineWidth: 2, priceScaleId: 'left' });
const ma200 = chart.addLineSeries({ color: 'pink', lineWidth: 2, priceScaleId: 'left' });

// Debug overlay
const debugDiv = document.createElement('div');
debugDiv.style.position = 'absolute';
debugDiv.style.top = '10px';
debugDiv.style.left = '10px';
debugDiv.style.color = 'white';
debugDiv.style.fontSize = '14px';
document.body.appendChild(debugDiv);

// Load data
fetch('https://btc-spread-test-pipeline.onrender.com/output-latest.json')
  .then(response => response.json())
  .then(data => {
    const cleaned = data.filter(d =>
      d.time && d.price != null && d.ma_50 != null && d.ma_100 != null && d.ma_200 != null
    );

    const toTimestamp = d => Math.floor(new Date(d.time).getTime() / 1000);

    btcLine.setData(cleaned.map(d => ({ time: toTimestamp(d), value: d.price })));
    ma50.setData(cleaned.map(d => ({ time: toTimestamp(d), value: d.ma_50 })));
    ma100.setData(cleaned.map(d => ({ time: toTimestamp(d), value: d.ma_100 })));
    ma200.setData(cleaned.map(d => ({ time: toTimestamp(d), value: d.ma_200 })));

    debugDiv.innerText = `Loaded ${cleaned.length} points`;
  });
