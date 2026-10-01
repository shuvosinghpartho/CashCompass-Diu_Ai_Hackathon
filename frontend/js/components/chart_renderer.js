let chartInstance = null;
let chartRangeDays = 30;
let latestChartData = null;

const getVisibleData = (chartData) => ({
  labels: chartData.labels.slice(0, chartRangeDays),
  historical: chartData.historical.slice(0, chartRangeDays),
  p50: chartData.p50.slice(0, chartRangeDays),
  p10: chartData.p10.slice(0, chartRangeDays),
  p90: chartData.p90.slice(0, chartRangeDays)
});

const ChartRenderer = {
  init: (chartData) => {
    const ctx = document.getElementById('cashFlowForecastChart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    latestChartData = chartData;
    const { labels, historical, p50, p10, p90 } = getVisibleData(chartData);

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Actual Balance',
            data: historical,
            borderColor: '#007da0',
            backgroundColor: 'rgba(0, 125, 160, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#007da0',
            fill: false
          },
          {
            label: 'Predicted Median (p50)',
            data: p50,
            borderColor: '#bd8500',
            borderWidth: 2.5,
            borderDash: [5, 5],
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: '#bd8500',
            fill: false
          },
          {
            label: 'Worst-Case Floor (p10)',
            data: p10,
            borderColor: '#ef4444',
            borderWidth: 1.5,
            borderDash: [2, 2],
            tension: 0.35,
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Optimistic Bound (p90)',
            data: p90,
            borderColor: '#10b981',
            borderWidth: 1.5,
            borderDash: [2, 2],
            tension: 0.35,
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Zero Deficit Line',
            data: Array(labels.length).fill(0),
            borderColor: 'rgba(23, 50, 60, 0.3)',
            borderWidth: 1,
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: CONFIG.ANIMATION_DURATION,
          easing: 'easeOutQuart'
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#17323c',
            titleColor: '#fff',
            bodyColor: '#e3eeef',
            borderColor: 'rgba(23, 50, 60, 0.18)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                if (context.raw === null) return null;
                return ` ${context.dataset.label}: ৳${Number(context.raw).toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(23, 50, 60, 0.07)' },
            ticks: { color: '#64748b', font: { size: 11, family: 'Plus Jakarta Sans' } }
          },
          y: {
            grid: { color: 'rgba(23, 50, 60, 0.08)' },
            ticks: {
              color: '#64748b',
              font: { size: 11, family: 'Plus Jakarta Sans' },
              callback: (val) => `৳${Number(val) / 1000}k`
            }
          }
        }
      }
    });
  },

  update: (chartData) => {
    latestChartData = chartData;
    if (!chartInstance) {
      ChartRenderer.init(chartData);
      return;
    }
    const visibleData = getVisibleData(chartData);
    chartInstance.data.labels = visibleData.labels;
    chartInstance.data.datasets[0].data = visibleData.historical;
    chartInstance.data.datasets[1].data = visibleData.p50;
    chartInstance.data.datasets[2].data = visibleData.p10;
    chartInstance.data.datasets[3].data = visibleData.p90;
    chartInstance.data.datasets[4].data = Array(visibleData.labels.length).fill(0);
    chartInstance.update();
  },

  setRange: (days) => {
    chartRangeDays = Math.max(1, Math.min(30, Number(days) || 30));
    if (latestChartData) ChartRenderer.update(latestChartData);
  },

  resize: () => {
    if (chartInstance) chartInstance.resize();
  },

  setTheme: (theme) => {
    if (!chartInstance) return;
    const dark = theme === 'dark';
    const tickColor = dark ? '#aebbb3' : '#74858a';
    const gridColor = dark ? 'rgba(224, 237, 228, 0.08)' : 'rgba(23, 50, 60, 0.08)';
    chartInstance.options.plugins.tooltip.backgroundColor = dark ? '#26332d' : '#17323c';
    chartInstance.options.scales.x.grid.color = gridColor;
    chartInstance.options.scales.y.grid.color = gridColor;
    chartInstance.options.scales.x.ticks.color = tickColor;
    chartInstance.options.scales.y.ticks.color = tickColor;
    chartInstance.update('none');
  }
};