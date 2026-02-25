import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text } from 'react-native'
import { AppTabParamList } from './types'
import { ProfileScreen } from '../features/user/screens/ProfileScreen'

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
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
