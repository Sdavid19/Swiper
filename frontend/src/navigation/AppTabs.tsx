import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ProfileScreen } from '../features/auth/screens/ProfileScreen'
import { View, Text } from 'react-native'
import { AppTabParamList } from './types'

const Tab = createBottomTabNavigator<AppTabParamList>()

function HomeScreen() {
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

export function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
