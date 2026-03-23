import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { EditBankStackParamList, ProfileStackParamList } from "./types"
import { BankScreen } from "../features/bank/screens/BanksScreen"
import { EditBankScreen } from "../features/bank/screens/EditBankScreen"
import { ProfileScreen } from "../features/user/screens/ProfileScreen"
import { EditProfileScreen } from "../features/user/screens/EditProfileScreen"

const Stack = createNativeStackNavigator<ProfileStackParamList>()

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  )
}
