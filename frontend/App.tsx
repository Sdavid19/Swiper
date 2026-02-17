import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoginScreen } from './src/features/auth/screens/LoginScreen';
import { SignupScreen } from './src/features/auth/screens/SignupScreen';

export const screens = ['Login', 'Signup'] as const;
export type Screen = (typeof screens)[number];
export type RootStackParamList = Record<Screen, undefined>;
export type StackNavigation = NativeStackNavigationProp< RootStackParamList, Screen >;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
