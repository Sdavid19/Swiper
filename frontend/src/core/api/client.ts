import axios, { AxiosInstance } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { store } from '../../redux/store'
import { logoutAction } from '../../redux/authSlice'

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
    if (error.response?.status === 401) {
      console.log('Unauthorized, logging out...')
      store.dispatch(logoutAction())
      await AsyncStorage.removeItem('auth')
    }
    return Promise.reject(error)
  }
)

export default api
