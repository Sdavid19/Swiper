
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../core/api/client';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { SignupDto } from '../dtos/signup.dto';


export const login = async (data: LoginDto): Promise<LoginResponseDto> => {
  try {
    const response = await api.post<LoginResponseDto>('/auth/login', data);
    await AsyncStorage.setItem('token', response.data.access_token);
    
    return response.data;
  } catch (error: any) {
    console.log('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log('Logout error:', error);
  }
};

export const signup = async (data: SignupDto): Promise<SignupDto> => {
   try {
    const response = await api.post<SignupDto>('/auth/signup', data);
    
    return response.data;
  } catch (error: any) {
    console.log('Signup failed:', error.response?.data || error.message);
    throw error;
  }
}