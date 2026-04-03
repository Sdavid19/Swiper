import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { VoteStackParamList } from "./types"
import { CreateLobbyScreen } from "../features/vote/screens/CreateLobbyScreen"
import { JoinLobbyScreen } from "../features/vote/screens/JoinLobbyScreen"
import { LobbyScreen } from "../features/vote/screens/LobbyScreen"

const Stack = createNativeStackNavigator<VoteStackParamList>()

export function VoteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="JoinLobby" options={{ title: 'Join lobby' }} component={ JoinLobbyScreen } />
      <Stack.Screen name="Lobby" options={{ title: 'Lobby' }} component={ LobbyScreen } />
    </Stack.Navigator>
  )
}
