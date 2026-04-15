import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { VoteStackParamList } from "./types"
import { CreateLobbyScreen } from "../features/vote/screens/Vote/CreateLobbyScreen"
import { JoinLobbyScreen } from "../features/vote/screens/Vote/JoinLobbyScreen"
import { LobbyScreen } from "../features/vote/screens/Vote/LobbyScreen"
import { VoteScreen } from "../features/vote/screens/Vote/VoteScreen"

const Stack = createNativeStackNavigator<VoteStackParamList>()

export function VoteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="JoinLobby" options={{ title: 'Join lobby' }} component={ JoinLobbyScreen } />
      <Stack.Screen name="Lobby" options={{ title: 'Lobby', headerBackButtonDisplayMode: 'minimal' }} component={ LobbyScreen } />
    </Stack.Navigator>
  )
}
