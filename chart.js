const chart = LightweightCharts.createChart(document.getElementById('chart'), {
  layout: {
    background: { color: '#000000' },
    textColor: '#cccccc',
  },
  grid: {
    vertLines: { color: '#222' },
    horzLines: { color: '#222' },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
  rightPriceScale: {
    visible: true,
    borderColor: '#555',
  },
  leftPriceScale: {
    visible: true,
    borderColor: '#555',
  },
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Normal,
  },
});

const candleSeries = chart.addCandlestickSeries({ priceScaleId: 'right' });

const ma50 = chart.addLineSeries({
  priceScaleId: 'left',
  color: 'white',
  lineWidth: 2,
});

const ma100 = chart.addLineSeries({
  priceScaleId: 'left',
  color: 'gold',
  lineWidth: 2,
});

const ma200 = chart.addLineSeries({
  priceScaleId: 'left',
  color: 'pink',
  lineWidth: 2,
});

async function loadChartData() {
  try {
    // Fetch candlestick data
    const res = await fetch('https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=60');
    const rawCandles = await res.json();

    const candles = rawCandles.map(c => ({
      time: c[0],
      open: c[3],
      high: c[2],
      low: c[1],
      close: c[4],
    })).reverse();

    candleSeries.setData(candles);
  } catch (err) {
    console.error('❌ Failed to load candlestick data:', err);
  }

  try {
    // Fetch your spread MA data
    const maRes = await fetch('https://btc-spread-test-pipeline.onrender.com/output-latest.json');
    const maJson = await maRes.json();

    const ma50Data = [];
    const ma100Data = [];
    const ma200Data = [];

    maJson.forEach(entry => {
      const timestamp = Math.floor(new Date(entry.time).getTime() / 1000);

      if (entry.ma_50 !== null) {
        ma50Data.push({ time: timestamp, value: entry.ma_50 });
      }
      if (entry.ma_100 !== null) {
        ma100Data.push({ time: timestamp, value: entry.ma_100 });
      }
      if (entry.ma_200 !== null) {
        ma200Data.push({ time: timestamp, value: entry.ma_200 });
      }
    });

    ma50.setData(ma50Data);
    ma100.setData(ma100Data);
    ma200.setData(ma200Data);
  } catch (err) {
    console.error('❌ Failed to load MA data:', err);
  }
}

loadChartData();
