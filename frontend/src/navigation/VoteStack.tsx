import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { VoteStackParamList } from "./types"
import { CreateLobbyScreen } from "../features/vote/screens/CreateLobbyScreen"
import { JoinLobbyScreen } from "../features/vote/screens/JoinLobbyScreen"
import { LobbyScreen } from "../features/vote/screens/LobbyScreen"
import { VoteScreen } from "../features/vote/screens/VoteScreen"

const Stack = createNativeStackNavigator<VoteStackParamList>()

export function VoteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="JoinLobby" options={{ title: 'Join lobby' }} component={ JoinLobbyScreen } />
      <Stack.Screen name="Lobby" options={{ title: 'Lobby', headerBackButtonDisplayMode: 'minimal' }} component={ LobbyScreen } />
    </Stack.Navigator>
  )
}
