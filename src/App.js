import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchStockQuote, fetchStockCandles } from './services/api';
import StockTable from './components/StockTable';
import StockChart from './components/StockChart';
import SearchBar from './components/SearchBar';
import Spinner from './components/Spinner';

function App() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [selectedStockData, setSelectedStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(false);

  // Default stocks to display using useMemo to avoid recreation on every render
  const defaultStocks = useMemo(() => ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META'], []);

  // Fetch chart data for a stock
  const fetchChartData = useCallback(async (symbol) => {
    try {
      setChartLoading(true);
      const data = await fetchStockCandles(symbol);
      if (data) {
        setChartData(data);
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
    } finally {
      setChartLoading(false);
    }
  }, []);

  // Function to fetch stocks data
  const fetchStocksData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const stockPromises = defaultStocks.map(async (symbol) => {
        const data = await fetchStockQuote(symbol);
        return { ...data, symbol };
      });

      const stocksData = await Promise.all(stockPromises);
      setStocks(stocksData);
      setFilteredStocks(stocksData);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again later.');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  }, [defaultStocks]);

  // Load data on initial component mount
  useEffect(() => {
    fetchStocksData();
  }, [fetchStocksData]);

  // Handle row click in the table
  const handleRowClick = useCallback((symbol, stockData) => {
    // Clear any previous chart data to ensure loading state is shown
    setChartData(null);
    setSelectedStock(symbol);
    setSelectedStockData(stockData);
    setShowChart(true);
    fetchChartData(symbol);
  }, [fetchChartData]);

  const handleSearch = useCallback(async (searchTerm) => {
    // Hide the chart whenever a new search is performed
    setShowChart(false);
    setSelectedStock('');
    setSelectedStockData(null);
    setChartData(null);
    
    if (!searchTerm) {
      setFilteredStocks(stocks);
      return;
    }

    setLoading(true);
    try {
      // If the stock is not in our list, fetch it
      if (!stocks.some(stock => stock.symbol === searchTerm)) {
        const data = await fetchStockQuote(searchTerm);
        if (data && data.c) {
          const newStock = { ...data, symbol: searchTerm };
          setStocks([...stocks, newStock]);
          setFilteredStocks([newStock]);
        } else {
          setFilteredStocks([]);
          setError(`No data found for ${searchTerm}`);
        }
      } else {
        // Filter existing stocks
        const filtered = stocks.filter(stock => 
          stock.symbol.includes(searchTerm)
        );
        setFilteredStocks(filtered);
      }
    } catch (err) {
      setError(`Error searching for ${searchTerm}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [stocks]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Stock Price Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            View real-time stock prices and data
          </p>
        </header>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <Spinner />
        ) : (
          <>
            <StockTable 
              stocks={filteredStocks} 
              loading={loading} 
              error={error}
              onRowClick={handleRowClick}
              selectedSymbol={selectedStock}
            />
            
            {showChart ? (
              chartLoading || !chartData ? (
                <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center">
                  <p className="text-lg text-gray-600">Loading chart data for {selectedStock}...</p>
                  <Spinner />
                </div>
              ) : (
                <StockChart 
                  chartData={chartData}
                  stockData={selectedStockData}
                  symbol={selectedStock}
                />
              )
            ) : (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center">
                <p className="text-lg text-gray-600">
                  Click on any stock in the table above to view its price history chart
                </p>
                <svg className="w-16 h-16 mx-auto mt-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                </svg>
              </div>
            )}
            
            {/* Footer with portfolio link */}
            <footer className="mt-12 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Developed by{' '}
                  <a 
                    href="https://nimesha.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Nimesha Kahingala
                  </a>
                </p>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
