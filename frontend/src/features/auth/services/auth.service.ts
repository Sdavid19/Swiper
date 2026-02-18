import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../../core/api/client'
import { LoginDto } from '../dtos/login.dto'
import { LoginResponseDto } from '../dtos/login-response.dto'
import { SignupDto } from '../dtos/signup.dto'
import { store } from '../../../redux/store'
import { setCredentials, logoutAction } from '../../../redux/authSlice'


export const login = async (data: LoginDto): Promise<LoginResponseDto> => {
  try {
    const response = await api.post<LoginResponseDto>('/auth/login', data)

    await AsyncStorage.setItem(
      'auth',
      JSON.stringify({ token: response.data.access_token })
    )
    store.dispatch(setCredentials({user:response.data.user, token: response.data.access_token }))

    return response.data;
  } catch (error: unknown) {
    console.log('Login failed:', error instanceof Error ? error.message : error)
    throw error;
  }
}

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('auth')
    store.dispatch(logoutAction());
  } catch (error) {
    console.log('Logout error:', error);
  }
}

export const signup = async (data: SignupDto): Promise<SignupDto> => {
  try {
    const response = await api.post<SignupDto>('/auth/signup', data);
    return response.data;
  } catch (error: unknown) {
    console.log('Signup failed:', error instanceof Error ? error.message : error)
    throw error;
  }
}
