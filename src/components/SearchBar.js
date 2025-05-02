import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Update search when input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm === '') {
        onSearch('');
      } else if (searchTerm.trim()) {
        onSearch(searchTerm.trim().toUpperCase());
      }
    }, 500);

    // Cleanup timeout on each change
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);

  // Handle form submission (still useful for immediate search)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim().toUpperCase());
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL, MSFT, AMZN)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md transition duration-300"
        >
          Search
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-2">Start typing to search automatically</p>
    </div>
  );
};

export default SearchBar;
