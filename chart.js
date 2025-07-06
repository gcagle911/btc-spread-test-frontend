// This URL should be your Render app's output.json endpoint
const DATA_URL = 'https://btc-spread-test-pipeline.onrender.com'; // Replace this

async function fetchData() {
  try {
    const res = await fetch(DATA_URL);
    const data = await res.json();

    if (data.bug_detector) {
      console.log("✅ Backend loaded successfully");
    }

    return [
      {
        time: Math.floor(new Date(data.timestamp).getTime() / 1000),
        value: data.spread,
      },
    ];
  } catch (err) {
    console.error("❌ Error loading data", err);
    return [];
  }
}

async function drawChart() {
  const chart = LightweightCharts.createChart(document.getElementById('chart'), {
    layout: {
      background: { color: '#111' },
      textColor: '#eee'
    },
    grid: {
      vertLines: { color: '#444' },
      horzLines: { color: '#444' }
    }
  });

  const lineSeries = chart.addLineSeries({
    color: '#ffcc00',
    lineWidth: 2,
  });

  const seriesData = await fetchData();
  lineSeries.setData(seriesData);
}

drawChart();
