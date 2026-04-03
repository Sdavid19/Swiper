import { NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { BankDto } from "../shared/types/generated"

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<AppTabParamList>
  CreateLobby: { bankId: number }
}

export type AuthStackParamList = {
  Login: undefined
  Signup: undefined
}

export type EditBankStackParamList = {
  ShowBanks: undefined
  EditBank: { bankId?: number }
  BankQuestions: { bankId: number }
  EditQuestion: { bankId: number, questionId?: number }
}

export type VoteStackParamList = {
  JoinLobby: undefined,
  Lobby: { roomId: number }
}

export type ProfileStackParamList = {
  Profile: undefined,
  EditProfile: undefined
}


export type AppTabParamList = {
  Home: undefined
  ProfileStack: NavigatorScreenParams<ProfileNavigation>
  BankStack: NavigatorScreenParams<EditBankStackParamList>
  VoteStack: NavigatorScreenParams<VoteStackParamList>
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

export type VoteNavigation = 
  NativeStackNavigationProp<VoteStackParamList>