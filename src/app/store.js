import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from '../features/currency/currencySlice';
import stocksReducer from '../features/stocks/stocksSlice';

export default configureStore({
  reducer: {
    currency: currencyReducer,
    stocks: stocksReducer
  }
});