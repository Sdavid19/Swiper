import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppTabs } from "./AppTabs";
import { AppStackParamList } from "./types";
import { CreateLobbyScreen } from "../features/vote/screens/CreateLobbyScreen";
import { CreateMediaBankScreen } from "../features/bank/screens/CreateMediaBankScreen";
import { VoteScreen } from "../features/vote/screens/VoteScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={AppTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateLobby"
        options={{ title: "Create lobby" }}
        component={CreateLobbyScreen}
      />
      <Stack.Screen
        name="CreateMediaBank"
        options={{ title: "Create bank" }}
        component={CreateMediaBankScreen}
      />
      <Stack.Screen
        name="Vote"
        options={{ title: "Vote", headerBackVisible: false }}
        component={VoteScreen}
      />
    </Stack.Navigator>
  );
}
