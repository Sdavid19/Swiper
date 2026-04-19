import "react-native-gesture-handler";
import "react-native-reanimated";

import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { RootNavigator } from "./src/navigation/RootNavigator";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { AppState } from "react-native";
import { socket } from "./src/socket/socket";

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        const token = store.getState().auth.token;

        if (token) {
          if (socket.connected) {
            socket.disconnect();
          }

          socket.auth = { token };
          socket.connect();
        }
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <RootNavigator />
        <Toast />
      </Provider>
    </GestureHandlerRootView>
  );
}
