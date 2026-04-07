import axios, { AxiosError, AxiosInstance } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { store } from '../redux/store'
import { logoutAction } from '../redux/authSlice'
import { showError } from '../shared/utils/toast.service' 
import { ErrorResponse } from "../shared/types";

export const API_URL = 'http://192.168.1.14:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
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
    const err = error as AxiosError<ErrorResponse<any>>;

    if (err.response) {
      const status = err.response.status;

      if (status === 401) {
        store.dispatch(logoutAction());
        await AsyncStorage.removeItem('auth');
        showError("Session expired");
      }

      else if (status === 400 && err.response.data.error === "Field error") {
        return Promise.reject(err);
      }

      else if (status === 500) {
        showError("Server error, please try again later");
      }

      else {
        showError(err.response.data.message as string || "Unexpected error");
      }

    } else {
      showError("Network error, check your connection");
    }

    return Promise.reject(err);
  }
);

export default api
