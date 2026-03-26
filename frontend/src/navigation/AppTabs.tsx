import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ProfileScreen } from '../features/user/screens/ProfileScreen'
import { HomeScreen } from '../features/bank/screens/HomeScreen'
import { BankScreen } from '../features/bank/screens/BanksScreen'
import { EditBankStack } from './EditBankStack';
import { ProfileStack } from './ProfileStack';

const Tab = createBottomTabNavigator();


export function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="BankStack" options={{ headerShown: false }} component={EditBankStack} />
      <Tab.Screen name="ProfileStack" options={{ headerShown: false }} component={ProfileStack} />
    </Tab.Navigator>
  )
}
