import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../shared/api/client";
import {
  SigninDto,
  SigninResponseDto,
  SignupDto,
  UserDto,
} from "../../../shared/types/generated";
import { store } from "../../../redux/store";
import { setCredentials, logoutAction } from "../../../redux/authSlice";
import { connectSocket, disconnectSocket } from "@/src/shared/socket/socket";


export const login = async (data: SigninDto): Promise<void> => {
  const response = await api.post<SigninResponseDto>("/auth/login", data);

  await AsyncStorage.setItem(
    "auth",
    JSON.stringify({ token: response.data.access_token }),
  );

  store.dispatch(
    setCredentials({
      user: response.data.user,
      token: response.data.access_token,
    }),
  );

  connectSocket(response.data.access_token);
};


export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem("auth");
  store.dispatch(logoutAction());

  disconnectSocket();
};
export const signup = async (data: SignupDto): Promise<void> => {
  await api.post<UserDto>("/auth/signup", data);
};
