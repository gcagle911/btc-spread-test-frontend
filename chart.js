const chart = LightweightCharts.createChart(document.getElementById('chart'), {
  layout: { background: { color: '#000' }, textColor: '#ccc' },
  grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } },
  timeScale: { timeVisible: true },
  rightPriceScale: { visible: true },
});

const btcLine = chart.addLineSeries({
  color: 'cyan',
  lineWidth: 2,
  priceScaleId: 'right',
});

const ma50 = chart.addLineSeries({ color: 'white', lineWidth: 2, priceScaleId: 'right' });
const ma100 = chart.addLineSeries({ color: 'gold', lineWidth: 2, priceScaleId: 'right' });
const ma200 = chart.addLineSeries({ color: 'pink', lineWidth: 2, priceScaleId: 'right' });

// Fake timestamps are in UNIX seconds (UTC)
const fakeTimestamps = [
  1720454400, // 2025-07-08T00:00:00Z
  1720458000, // +1h
  1720461600, // +2h
  1720465200, // +3h
];

btcLine.setData([
  { time: fakeTimestamps[0], value: 58200 },
  { time: fakeTimestamps[1], value: 58350 },
  { time: fakeTimestamps[2], value: 58400 },
  { time: fakeTimestamps[3], value: 58300 },
]);

ma50.setData([
  { time: fakeTimestamps[0], value: 0.021 },
  { time: fakeTimestamps[1], value: 0.022 },
  { time: fakeTimestamps[2], value: 0.023 },
  { time: fakeTimestamps[3], value: 0.0225 },
]);

ma100.setData([
  { time: fakeTimestamps[0], value: 0.0205 },
  { time: fakeTimestamps[1], value: 0.0212 },
  { time: fakeTimestamps[2], value: 0.0218 },
  { time: fakeTimestamps[3], value: 0.0213 },
]);

ma200.setData([
  { time: fakeTimestamps[0], value: 0.0201 },
  { time: fakeTimestamps[1], value: 0.0203 },
  { time: fakeTimestamps[2], value: 0.0206 },
  { time: fakeTimestamps[3], value: 0.0204 },
]);
