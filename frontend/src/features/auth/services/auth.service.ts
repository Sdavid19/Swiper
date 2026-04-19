import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../api/client";
import {
  SigninDto,
  SigninResponseDto,
  SignupDto,
  UserDto,
} from "../../../shared/types/generated";
import { store } from "../../../redux/store";
import { setCredentials, logoutAction } from "../../../redux/authSlice";
import { socket } from "@/src/socket/socket";

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

  socket.auth = { token: response.data.access_token };
  socket.connect();
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem("auth");
  store.dispatch(logoutAction());
   socket.disconnect();
};

export const signup = async (data: SignupDto): Promise<void> => {
  await api.post<UserDto>("/auth/signup", data);
};
