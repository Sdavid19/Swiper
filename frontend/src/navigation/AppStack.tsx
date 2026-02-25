import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AppTabs } from './AppTabs'
import { EditProfileScreen } from '../features/user/screens/EditProfileScreen'
import { AppStackParamList } from './types'

const Stack = createNativeStackNavigator<AppStackParamList>()

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="Tabs" component={AppTabs} options={{headerShown: false}} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{headerTitle: 'Edit profile'}} />
    </Stack.Navigator>
  )
}
