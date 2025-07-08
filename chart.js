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
    borderColor: 'gray',
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
  width: window.innerWidth,
  height: window.innerHeight,
});

// Line for BTC price
const btcLine = chart.addLineSeries({
  color: 'aqua',
  lineWidth: 2,
  priceScaleId: 'right',
});

// Spread MA Lines (white, gold, pink)
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

// Debug label
const debugDiv = document.createElement('div');
debugDiv.style.position = 'absolute';
debugDiv.style.top = '10px';
debugDiv.style.left = '10px';
debugDiv.style.color = 'white';
debugDiv.style.fontSize = '14px';
document.body.appendChild(debugDiv);

fetch('https://btc-spread-test-pipeline.onrender.com/output-latest.json')
  .then(response => response.json())
  .then(data => {
    const cleaned = data.filter(d =>
      d.time && d.spread_avg_L20_pct != null && d.ma_50 != null && d.ma_100 != null && d.ma_200 != null && d.price != null
    );

    const timestamps = cleaned.map(d => ({
      time: Math.floor(new Date(d.time).getTime() / 1000),
    }));

    const btcData = cleaned.map((d, i) => ({
      time: timestamps[i].time,
      value: d.price,
    }));
    const ma50Data = cleaned.map((d, i) => ({
      time: timestamps[i].time,
      value: d.ma_50,
    }));
    const ma100Data = cleaned.map((d, i) => ({
      time: timestamps[i].time,
      value: d.ma_100,
    }));
    const ma200Data = cleaned.map((d, i) => ({
      time: timestamps[i].time,
      value: d.ma_200,
    }));

    btcLine.setData(btcData);
    ma50.setData(ma50Data);
    ma100.setData(ma100Data);
    ma200.setData(ma200Data);

    debugDiv.innerText = `Loaded: ${btcData.length} points`;
  });
