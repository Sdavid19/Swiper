import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { VoteStatStackParamList } from "./types";
import { VoteStatScreen } from "../features/voteStat/screens/VoteStatScreen";
import { VotesScreen } from "../features/voteStat/screens/VotesScreens";

const Stack = createNativeStackNavigator<VoteStatStackParamList>();

export function VoteStatStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true }}
      initialRouteName="ShowVotes"
    >
      <Stack.Screen
        name="ShowVotes"
        options={{ title: "Votes" }}
        component={VotesScreen}
      />
      <Stack.Screen
        name="VoteStat"
        options={{ title: "Vote stat" }}
        component={VoteStatScreen}
      />
    </Stack.Navigator>
  );
}
