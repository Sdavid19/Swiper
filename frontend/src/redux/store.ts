import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import bankReducer from './bankSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bank: bankReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
