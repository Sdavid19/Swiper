import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { EditBankStackParamList } from "./types"
import { BankScreen } from "../features/bank/screens/BanksScreen"
import { EditBankScreen } from "../features/bank/screens/EditBankScreen"
import { QuestionsScreen } from "../features/question/screens/QuestionsScreen"
import { EditQuestionScreen } from "../features/question/screens/EditQuestionScreen"

const Stack = createNativeStackNavigator<EditBankStackParamList>()

export function EditBankStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="ShowBanks">
      <Stack.Screen name="ShowBanks" options={{ title: 'My banks' }} component={BankScreen} />
      <Stack.Screen name="EditBank" options={{ title: 'Edit bank' }} component={EditBankScreen} />
      <Stack.Screen name="BankQuestions" options={{ title: 'Questions' }} component={QuestionsScreen} />
      <Stack.Screen name="EditQuestion" options={{ title: 'Edit question' }} component={EditQuestionScreen} />
    </Stack.Navigator>
  )
}
