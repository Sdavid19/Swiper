import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import bankReducer from './bankSlice'
import questionReducer from './questionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bank: bankReducer,
    question: questionReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
