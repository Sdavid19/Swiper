import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { VoteStackParamList } from "./types"
import { JoinLobbyScreen } from "../features/vote/screens/JoinLobbyScreen"

const Stack = createNativeStackNavigator<VoteStackParamList>()

export function VoteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="JoinLobby" options={{ title: 'Join room' }} component={ JoinLobbyScreen } />
    </Stack.Navigator>
  )
}
