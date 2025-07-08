const chart = LightweightCharts.createChart(document.body, {
    width: window.innerWidth,
    height: window.innerHeight,
    layout: {
        background: { color: 'black' },
        textColor: 'white',
    },
});

const spreadLine = chart.addLineSeries({
    color: 'aqua',
    lineWidth: 2,
});

// Add this debug label to the screen
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
        const spreadData = data
            .filter(d => d.spread_avg_L20_pct !== null)
            .map(d => ({
                time: Math.floor(new Date(d.time).getTime() / 1000),
                value: d.spread_avg_L20_pct,
            }));

        spreadLine.setData(spreadData);

        // DEBUG: Show how many points were loaded
        debugDiv.innerText = `Loaded: ${spreadData.length} points`;
    })
    .catch(err => {
        debugDiv.innerText = `Error loading data`;
        console.error(err);
    });
