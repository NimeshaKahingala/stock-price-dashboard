import React from 'react';

const StockTable = ({ stocks, error, onRowClick, selectedSymbol }) => {
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        No stock data available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Symbol</th>
            <th className="py-3 px-4 text-left">Current Price</th>
            <th className="py-3 px-4 text-left">Change</th>
            <th className="py-3 px-4 text-left">Change %</th>
            <th className="py-3 px-4 text-left">High</th>
            <th className="py-3 px-4 text-left">Low</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {stocks.map((stock) => (
            <tr 
              key={stock.symbol} 
              className={`hover:bg-gray-100 cursor-pointer ${selectedSymbol === stock.symbol ? 'bg-blue-50' : ''}`}
              onClick={() => onRowClick(stock.symbol, stock)}
            >
              <td className="py-2 px-4 font-semibold">{stock.symbol}</td>
              <td className="py-2 px-4">${stock.c.toFixed(2)}</td>
              <td className={`py-2 px-4 ${stock.d > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${stock.d.toFixed(2)}
              </td>
              <td className={`py-2 px-4 ${stock.dp > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.dp.toFixed(2)}%
              </td>
              <td className="py-2 px-4">${stock.h.toFixed(2)}</td>
              <td className="py-2 px-4">${stock.l.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-center text-gray-500 mt-4">
        Click on any row to view the stock price history chart
      </p>
    </div>
  );
};

export default StockTable;
