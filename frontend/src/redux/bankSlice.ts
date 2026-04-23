import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BankDto, BankFilterDto } from "../shared/types/generated";

interface UpdateBankImagePayload {
  id: number;
  imageUrl: string;
}

interface BanksState {
  banks: BankDto[];
  filter: BankFilterDto;
}

const initialState: BanksState = {
  banks: [],
  filter: {
    locked: false,
    categoryIds: [],
  },
};

const banksSlice = createSlice({
  name: "banks",
  initialState,
  reducers: {
    setBanks: (state, action: PayloadAction<BankDto[]>) => {
      state.banks = action.payload;
    },

    setFilterAction: (state, action: PayloadAction<BankFilterDto>) => {
      state.filter = action.payload;
    },

    addBankAction: (state, action: PayloadAction<BankDto>) => {
      const bank = action.payload;
      if (matchesFilter(bank, state.filter)) {
        state.banks.unshift(action.payload);
      }
    },

    removeBankAction: (state, action: PayloadAction<number>) => {
      state.banks = state.banks.filter(b => b.id !== action.payload);
    },

    updateBankAction: (state, action: PayloadAction<BankDto>) => {
      const index = state.banks.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.banks[index] = action.payload;
      }
    },

    updateBankImageAction: (
      state,
      action: PayloadAction<UpdateBankImagePayload>
    ) => {
      const bank = state.banks.find(b => b.id === action.payload.id);
      if (bank) {
        bank.imageUrl = action.payload.imageUrl;
      }
    },
  },
});

export default banksSlice.reducer;

export const {
  setBanks,
  setFilterAction,
  addBankAction,
  removeBankAction,
  updateBankAction,
  updateBankImageAction,
} = banksSlice.actions;


function matchesFilter(bank: BankDto, filter: BankFilterDto) {
  if (filter.locked) return false;

  if (
    filter.categoryIds?.length &&
    !filter.categoryIds.includes(bank.category.id)
  ) {
    return false;
  }

  return true;
}