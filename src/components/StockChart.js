import React from 'react';
import Chart from 'react-apexcharts';

const StockChart = ({ chartData, stockData, symbol }) => {
  // Basic validation - API layer now guarantees good data structure but values may be empty
  if (!chartData || !chartData.t || chartData.t.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        No chart data available for {symbol}.
      </div>
    );
  }

  // Create candlestick chart data series from the prepared data
  const seriesData = chartData.t.map((time, index) => ({
    x: new Date(time * 1000),
    y: [
      chartData.o[index], // open
      chartData.h[index], // high
      chartData.l[index], // low
      chartData.c[index]  // close
    ]
  }));

  // Volume data for volume chart
  const volumeData = chartData.t.map((time, index) => ({
    x: new Date(time * 1000),
    y: chartData.v[index]
  }));

  // Chart options
  const options = {
    chart: {
      type: 'candlestick',
      height: 350,
      id: 'candles',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: false
      }
    },
    title: {
      text: `${symbol} Stock Price History`,
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'MMM dd'
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        formatter: function (value) {
          return '$' + value.toFixed(2);
        }
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#26a69a',
          downward: '#ef5350'
        },
        wick: {
          useFillColor: true,
        }
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      x: {
        format: 'MMM dd, yyyy'
      },
      y: {
        formatter: function(value) {
          return '$' + value.toFixed(2);
        }
      }
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  // Chart series data
  const series = [
    {
      name: 'Stock Price',
      data: seriesData
    }
  ];

  // Volume chart options
  const volumeOptions = {
    chart: {
      height: 160,
      type: 'bar',
      brush: {
        enabled: true,
        target: 'candles'
      },
      selection: {
        enabled: true
      },
      animations: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        columnWidth: '80%',
        colors: {
          ranges: [{
            from: -1000,
            to: 0,
            color: '#F15B46'
          }, {
            from: 1,
            to: 100000000,
            color: '#3fb68b'
          }]
        }
      }
    },
    stroke: {
      width: 0
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'MMM dd'
      }
    },
    yaxis: {
      labels: {
        show: true,
        formatter: function(val) {
          return val.toLocaleString();
        }
      }
    },
    title: {
      text: 'Volume',
      align: 'left',
      style: {
        fontSize: '14px'
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      x: {
        format: 'MMM dd, yyyy'
      },
      y: {
        formatter: function(val) {
          return val.toLocaleString();
        }
      }
    }
  };

  const volumeSeries = [
    {
      name: 'Volume',
      data: volumeData
    }
  ];

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-6">
      <div className="main-chart">
        <Chart 
          options={options} 
          series={series} 
          type="candlestick" 
          height={350} 
        />
      </div>
      
      <div className="mt-4">
        <Chart 
          options={volumeOptions} 
          series={volumeSeries} 
          type="bar" 
          height={160} 
        />
      </div>

      {stockData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-700">Change</h3>
            <p className={`text-xl font-bold ${stockData.d > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stockData.d.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-700">Change %</h3>
            <p className={`text-xl font-bold ${stockData.dp > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stockData.dp.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-700">Previous Close</h3>
            <p className="text-xl font-bold text-gray-900">${stockData.pc.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;
