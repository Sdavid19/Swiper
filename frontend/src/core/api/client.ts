import axios, { AxiosError, AxiosInstance } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { store } from '../../redux/store'
import { logoutAction } from '../../redux/authSlice'
import { showError } from '../services'
import { ErrorResponse } from "../../types";

const api: AxiosInstance = axios.create({
  baseURL: 'http://192.168.0.145:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config) => {
    const stateToken = store.getState().auth.token
    const token = stateToken ?? (await AsyncStorage.getItem('auth').then(item => item ? JSON.parse(item).token : null))

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const err = error as AxiosError<ErrorResponse<string>>;

    if (err.response) {
      const status = err.response.status;
      if(status === 401){
          store.dispatch(logoutAction());
          await AsyncStorage.removeItem('auth');
          showError(err.response.data.message);
      }
      else if(status === 500){
        showError('Server error, please try again later');
      }
    } else {
      showError('Network error, check your connection');
    }

    return Promise.reject(error);
  }
);

export default api
