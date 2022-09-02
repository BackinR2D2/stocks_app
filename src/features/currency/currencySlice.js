import { createSlice } from '@reduxjs/toolkit';
import currencies from '../../helpers/currencies';

// const convert = await axios.get("https://api.apilayer.com/fixer/convert?to={to}&from={from}&amount={amount}", {
//   headers: {
//     'apikey': process.env.REACT_APP_CURRENCY_API_KEY
//   }
// });

// const symbols = await axios.get("https://api.apilayer.com/fixer/symbols", {
//   headers: {
//     'apikey': process.env.REACT_APP_CURRENCY_API_KEY
//   }
// });

export const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    to: "",
    from: "",
    amount: 0,
    prevUserCurrency: "USD",
    userCurrency: "USD",
    currencyList: currencies.sort((a, b) => {
      return a.name < b.name
    }),
    loading: false
  },
  reducers: {
    setUserCurrency: (state, action) => {
      state.prevUserCurrency = state.userCurrency;
      state.userCurrency = action.payload.chosenCurrency ? action.payload.chosenCurrency : "USD";
    }
  },
});

export const {setUserCurrency} = currencySlice.actions;

export default currencySlice.reducer;