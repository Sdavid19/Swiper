import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../../api/client'
import { SigninDto, SigninResponseDto, SignupDto, SignupResponseDto } from '../../../shared/types/generated'
import { store } from '../../../redux/store'
import { setCredentials, logoutAction } from '../../../redux/authSlice'

export const login = async (data: SigninDto): Promise<SigninResponseDto> => {

  const response = await api.post<SigninResponseDto>('/auth/login', data)

  await AsyncStorage.setItem(
    'auth',
    JSON.stringify({ token: response.data.access_token })
  )

  store.dispatch(
    setCredentials({
      user: response.data.user,
      token: response.data.access_token
    })
  )

  return response.data
}

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('auth')
  store.dispatch(logoutAction())
}

export const signup = async (data: SignupDto): Promise<SignupResponseDto> => {
  const response = await api.post<SignupResponseDto>('/auth/signup', data)
  return response.data
}