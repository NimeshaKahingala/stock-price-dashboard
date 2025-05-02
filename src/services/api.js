import axios from 'axios';


const API_KEY = 'd0a5h89r01qus8rgon60d0a5h89r01qus8rgon6g';
const BASE_URL = 'https://finnhub.io/api/v1';

export const fetchStockQuote = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol,
        token: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
};