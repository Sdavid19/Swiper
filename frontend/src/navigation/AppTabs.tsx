import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '../features/bank/screens/HomeScreen'
import { EditBankStack } from './EditBankStack';
import { ProfileStack } from './ProfileStack';
import { BookCheck, BookSearch, GalleryVerticalEnd, House, Key, Plus, QrCode, User, UserKey } from 'lucide-react-native';
import { VotesScreen } from '../features/vote/screens/VoteStat/VotesScreens';
import { View } from 'react-native';
import { JoinLobbyScreen } from '../features/vote/screens/Vote/JoinLobbyScreen';
import { VoteStack } from './VoteStack';
import { VoteStatScreen } from '../features/vote/screens/VoteStat/VoteStatScreen';
import { VoteStatStack } from './VoteStatStack';

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
      name="VoteStack" 
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
            <Plus
              color={color}
              size={size+10}
            />
          
          )
      }}
      component={VoteStack} 
      />

      <Tab.Screen
        name="VoteStatStack"
        options={{
           headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <BookCheck color={color} size={size} />
          )
        }}
        component={VoteStatStack}
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
