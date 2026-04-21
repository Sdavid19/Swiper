import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BankDto } from "../shared/types/generated";

interface UpdateBankImagePayload {
  id: number;
  imageUrl: string;
}

const banksSlice = createSlice({
  name: 'banks',
  initialState: [] as BankDto[],
  reducers: {
    setBanks: (_, action: PayloadAction<BankDto[]>) => action.payload,

    addBankAction: (state, action: PayloadAction<BankDto>) => {
      state.unshift(action.payload);
    },

    removeBankAction: (state, action: PayloadAction<number>) => {
      return state.filter(b => b.id !== action.payload);
    },

    updateBankAction: (state, action: PayloadAction<BankDto>) => {
      const index = state.findIndex(b => b.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },

    updateBankImageAction: (state, action: PayloadAction<UpdateBankImagePayload>) => {
      const bank = state.find(b => b.id === action.payload.id);
      if (bank) {
        bank.imageUrl = action.payload.imageUrl;
      }
    }
  }
});

export default banksSlice.reducer;
export const { setBanks, addBankAction, removeBankAction, updateBankAction, updateBankImageAction } = banksSlice.actions;