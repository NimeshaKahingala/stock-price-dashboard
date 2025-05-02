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


function getFakeStockCandle(symbol, count = 30) {
  // Safety check for invalid input
  if (!symbol) {
    console.error('Invalid symbol provided to getFakeStockCandle');
    return generateEmptyCandles();
  }

  try {
    // Simple seed: average char code of the symbol
    let price = Array.from(symbol)
                     .reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
                 / symbol.length;

    // Set a minimum base price
    price = Math.max(price, 50);

    const t = [], o = [], h = [], l = [], c = [], v = [];
    
    // Generate candles for the last 'count' days
    for (let i = 0; i < count; i++) {
      // Generate open/close around last price ±3%
      const open  = price * (0.97 + Math.random() * 0.06);
      const close = price * (0.97 + Math.random() * 0.06);

      // high/low swing ±2% around the max/min of open/close
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low  = Math.min(open, close) * (1 - Math.random() * 0.02);

      // volume between 50k and 500k
      const vol = Math.floor(50_000 + Math.random() * 450_000);

      // Generate timestamp for last 30 days
      const date = new Date();
      date.setDate(date.getDate() - (count - i - 1));
      t.push(Math.floor(date.getTime() / 1000)); // unix timestamp in seconds

      o.push(+open.toFixed(2));
      h.push(+high.toFixed(2));
      l.push(+low.toFixed(2));
      c.push(+close.toFixed(2));
      v.push(vol);

      price = close;          // next candle seeds off this close
    }

    // Ensure all arrays have the same length
    const validDataLength = Math.min(t.length, o.length, h.length, l.length, c.length, v.length);
    
    // Return properly formatted data
    return {
      t: t.slice(0, validDataLength),
      o: o.slice(0, validDataLength),
      h: h.slice(0, validDataLength),
      l: l.slice(0, validDataLength),
      c: c.slice(0, validDataLength),
      v: v.slice(0, validDataLength),
      s: "ok"
    };
  } catch (error) {
    console.error('Error generating candle data:', error);
    return generateEmptyCandles();
  }
}

// Fallback function that returns a valid but empty dataset
function generateEmptyCandles() {
  // Return a minimal valid structure that won't cause rendering errors
  return {
    t: [],
    o: [],
    h: [],
    l: [],
    c: [],
    v: [],
    s: "no_data"
  };
}

/**
 * Fetch mock candle data for a stock symbol
 * Always returns properly formatted data suitable for charting
 */
export const fetchStockCandles = async (symbol) => {
  try {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!symbol) {
      console.warn('Fetch stock candles called with invalid symbol');
      return generateEmptyCandles();
    }
    
    // Generate and validate the candle data
    const data = getFakeStockCandle(symbol);
    
    // Final validation check
    if (!data || !data.t || data.t.length === 0) {
      console.warn('Generated candle data is incomplete');
      return generateEmptyCandles();
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching stock candles:', error);
    return generateEmptyCandles(); // Return valid empty structure instead of throwing
  }
};