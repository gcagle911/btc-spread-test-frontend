const chart = LightweightCharts.createChart(document.body, {
    width: window.innerWidth,
    height: window.innerHeight,
    layout: {
        background: { color: 'black' },
        textColor: 'white',
    },
    grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    },
});

const spreadLine = chart.addLineSeries({
    color: 'aqua',
    lineWidth: 2,
});

fetch('https://btc-spread-test-pipeline.onrender.com/output.json')
    .then(response => response.json())
    .then(data => {
        const spreadData = data
            .filter(d => d.spread_avg_L20_pct !== null)
            .map(d => ({
                time: Math.floor(new Date(d.time).getTime() / 1000),
                value: d.spread_avg_L20_pct,
            }));

        spreadLine.setData(spreadData);
    });
