import { NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<AppTabParamList>
  EditProfile: undefined
}

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
  AppStack: undefined
}


export type AuthNavigation =
  NativeStackNavigationProp<AuthStackParamList>

  export type AppNavigation =
  NativeStackNavigationProp<AppStackParamList>
