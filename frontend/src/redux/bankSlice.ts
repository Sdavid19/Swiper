import { createSlice } from "@reduxjs/toolkit";
import { BankDto } from "../shared/types/generated";

const banksSlice = createSlice({
  name: 'banks',
  initialState: [] as BankDto[],
  reducers: {
    setBanks: (_, action) => action.payload,

    addBankAction: (state, action) => {
      state.unshift(action.payload);
    },

    removeBankAction: (state, action) => {
      return state.filter(b => b.id !== action.payload);
    },

    updateBankAction: (state, action) => {
      const index = state.findIndex(b => b.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    }
  }
});

export default banksSlice.reducer
export const { setBanks, addBankAction, removeBankAction, updateBankAction } = banksSlice.actions