import { createSlice, PayloadAction } from "@reduxjs/toolkit"


type AuthState = {
  user: UserState | null
  token: string | null
}

type UserState = {
  id: number,
  email: string,
  name: string,
  imageUrl?: string | null
}


const initialState: AuthState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<{ user: UserState; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logoutAction: (state: AuthState) => {
      state.user = null
      state.token = null
    },
    updateUserData: (state: AuthState, action: PayloadAction<Partial<UserState>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    }
  }
})

export default authSlice.reducer
export const { setCredentials, logoutAction, updateUserData } = authSlice.actions

