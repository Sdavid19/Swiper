import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { EditBankStackParamList } from "./types"
import { BankScreen } from "../features/bank/screens/BanksScreen"
import { EditBankScreen } from "../features/bank/screens/EditBankScreen"
import { DeleteBank } from "../features/bank/components/DeleteBank"

const Stack = createNativeStackNavigator<EditBankStackParamList>()

export function EditBankStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="ShowBanks">
      <Stack.Screen name="ShowBanks" component={BankScreen} />
      <Stack.Screen name="EditBank" component={EditBankScreen} />
    </Stack.Navigator>
  )
}
