import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthStack } from './AuthStack'
import { useSelector } from 'react-redux'
import { RootStackParamList } from './types'
import type { RootState } from '../redux/store' 
import { AppStack } from './AppStack'

const Root = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  const token = useSelector((state: RootState) => state.auth.token)
  const isLoggedIn = !!token

  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Root.Screen name="AppStack" component={AppStack} />
        ) : (
          <Root.Screen name="AuthStack" component={AuthStack} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  )
}

