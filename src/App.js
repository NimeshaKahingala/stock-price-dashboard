import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchStockQuote } from './services/api';
import StockTable from './components/StockTable';
import SearchBar from './components/SearchBar';
import Spinner from './components/Spinner';

function App() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default stocks to display using useMemo to avoid recreation on every render
  const defaultStocks = useMemo(() => ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META'], []);

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

  const handleSearch = useCallback(async (searchTerm) => {
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
            />
            
            
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
