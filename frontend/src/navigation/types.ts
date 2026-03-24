import { NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { BankDto } from "../shared/types/generated"

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<AppTabParamList>
}

export type AuthStackParamList = {
  Login: undefined
  Signup: undefined
}

export type EditBankStackParamList = {
  ShowBanks: undefined
  EditBank: { bankId?: number, refresh?: () => void }
  BankQuestions: { bankId: number }
  EditQuestion: { questionId?: number }
}

export type ProfileStackParamList = {
  Profile: undefined,
  EditProfile: undefined
}


export type AppTabParamList = {
  Home: undefined
  ProfileStack: NavigatorScreenParams<ProfileNavigation>
  BankStack: NavigatorScreenParams<EditBankStackParamList>
}

export type RootStackParamList = {
  AuthStack: undefined
  AppStack: undefined
}

export type AuthNavigation =
  NativeStackNavigationProp<AuthStackParamList>

export type AppNavigation =
  NativeStackNavigationProp<AppStackParamList>

export type EditBankNavigation =
  NativeStackNavigationProp<EditBankStackParamList>

export type ProfileNavigation = 
   NativeStackNavigationProp<ProfileStackParamList>