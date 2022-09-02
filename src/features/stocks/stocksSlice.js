import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// https://financialmodelingprep.com/api/v3/available-traded/list?apikey=${process.env.REACT_APP_STOCKS_API_KEY} stock list
// https://financialmodelingprep.com/api/v3/etf/list?apikey=${process.env.REACT_APP_STOCKS_API_KEY} etf list
// https://financialmodelingprep.com/api/v3/quote-short/AAPL?apikey=${process.env.REACT_APP_STOCKS_API_KEY} stock price
// https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?serietype=line&apikey=${process.env.REACT_APP_STOCKS_API_KEY} daily stock price
// https://financialmodelingprep.com/api/v3/search?query=AA&limit=10&apikey=${process.env.REACT_APP_STOCKS_API_KEY} search for stock
// https://financialmodelingprep.com/api/v4/historical/employee_count?symbol=AAPL&apikey=${process.env.REACT_APP_STOCKS_API_KEY} number of employees
// https://financialmodelingprep.com/api/v3/sector-performance?apikey=${process.env.REACT_APP_STOCKS_API_KEY} sector performance
// https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=${process.env.REACT_APP_STOCKS_API_KEY} company information

const chunkArray = (arr, size) =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];

export const getStocksList = createAsyncThunk(
  '/stocks/getStocksList',
  async (_, thunkAPI) => {
    const stocks = await axios.get(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${process.env.REACT_APP_STOCKS_API_KEY}`);
    return (stocks.data).filter(stock => stock.type === 'stock');
  }
)

export const stocksSlice = createSlice({
  name: 'stocks',
  initialState: {
    stocksList: [],
    unmodifiedStocksList: [],
    tempStocksList: [],
    searchStocksList: [],
    isSearching: false,
    listIndex: 0,
    loading: false,
    etfList: [],
    viewedStocks: [],
    favouriteStocks: [],
    favouriteETFs: []
  },
  reducers: {
    getMoreStocks: (state, action) => {
      state.listIndex = action.payload.listIndex;
      if(state.searchStocksList.length < 60 && state.isSearching) {
        return;
      } else {
        state.tempStocksList = [...state.tempStocksList, ...(chunkArray(state.isSearching ? state.searchStocksList : state.stocksList, 60))[state.listIndex]];
      }
    },
    searchStock: (state, action) => {
      if(action.payload) {
        state.isSearching = true;
        const searchStocksList = state.stocksList.map((stock) => {
          const stockObj = JSON.parse(JSON.stringify(stock));
          const search = (action.payload).toLowerCase().trim();
          const stockSymbol = (stockObj.symbol) && (stockObj.symbol).toLowerCase();
          const stockCompanyName = (stockObj.symbol) && (stockObj.name).toLowerCase();
          if(stockSymbol.indexOf(search) !== -1 || stockCompanyName.indexOf(search) !== -1) {
            return stockObj;
          }
        }).filter((element) => element !== undefined);
        state.searchStocksList = searchStocksList;
        state.tempStocksList = chunkArray(searchStocksList, 60)[0];
        state.listIndex = 0;
      } else {
        state.isSearching = false;
        state.stocksList = state.unmodifiedStocksList;
        state.tempStocksList = chunkArray(state.stocksList, 60)[0];
        state.listIndex = 0;
      }
    },
    addStock: (state, action) => {
      console.log(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getStocksList.pending, (state, action) => {
      state.loading = true;
    })
    builder.addCase(getStocksList.fulfilled, (state, action) => {
      state.stocksList = action.payload;
      state.unmodifiedStocksList = action.payload;
      state.tempStocksList = (chunkArray(action.payload, 60))[0];
      state.loading = false;
    })
    builder.addCase(getStocksList.rejected, (state, action) => {
      state.stocksList = [];
    })
  }
});

export const { getMoreStocks, searchStock, addStock } = stocksSlice.actions;

export default stocksSlice.reducer;