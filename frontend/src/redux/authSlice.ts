import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../shared/types/user.type"


type AuthState = {
  user: User | null
  token: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logoutAction: (state: AuthState) => {
      state.user = null
      state.token = null
    },
    updateUserData: (state: AuthState, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    }
  }
})

export default authSlice.reducer
export const { setCredentials, logoutAction, updateUserData } = authSlice.actions

