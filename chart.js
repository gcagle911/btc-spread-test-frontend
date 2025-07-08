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
});

const btcLine = chart.addLineSeries({
  color: 'cyan',
  lineWidth: 2,
  priceScaleId: 'right',
});

const ma50 = chart.addLineSeries({
  color: 'white',
  lineWidth: 2,
  priceScaleId: 'right',
});

const ma100 = chart.addLineSeries({
  color: 'gold',
  lineWidth: 2,
  priceScaleId: 'right',
});

const ma200 = chart.addLineSeries({
  color: 'pink',
  lineWidth: 2,
  priceScaleId: 'right',
});

async function loadData() {
  try {
    const res = await fetch('https://btc-spread-test-pipeline.onrender.com/output-latest.json');
    const data = await res.json();

    const btc = [];
    const ma50Data = [];
    const ma100Data = [];
    const ma200Data = [];

    data.forEach(entry => {
      const t = Math.floor(new Date(entry.time).getTime() / 1000);

      if (entry.price) btc.push({ time: t, value: entry.price });
      if (entry.ma_50 !== null) ma50Data.push({ time: t, value: entry.ma_50 });
      if (entry.ma_100 !== null) ma100Data.push({ time: t, value: entry.ma_100 });
      if (entry.ma_200 !== null) ma200Data.push({ time: t, value: entry.ma_200 });
    });

    btcLine.setData(btc);
    ma50.setData(ma50Data);
    ma100.setData(ma100Data);
    ma200.setData(ma200Data);
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

loadData();
