import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '../features/bank/screens/HomeScreen'
import { EditBankStack } from './EditBankStack';
import { ProfileStack } from './ProfileStack';
import { BookSearch, House, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} />
          )
        }}
      />

      <Tab.Screen
        name="BankStack"
        options={{
          headerShown: false,
          tabBarLabel: "Banks",
          tabBarIcon: ({ color, size }) => (
            <BookSearch color={color} size={size} />
          )
        }}
        component={EditBankStack}
      />

      <Tab.Screen
        name="ProfileStack"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          )
        }}
        component={ProfileStack}
      />
    </Tab.Navigator>
  )
}
