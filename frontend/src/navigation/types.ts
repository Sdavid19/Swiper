export type AuthStackParamList = {
  Login: undefined
  Signup: undefined
}

export type AppTabParamList = {
  Home: undefined
  Profile: undefined
}

export type RootStackParamList = {
  AuthStack: undefined
  AppTabs: undefined
}

export type AuthStackParamList = {
  Login: undefined
  Signup: undefined
}

export type AuthNavigation =
  NativeStackNavigationProp<AuthStackParamList>
