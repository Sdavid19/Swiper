import { Text, View, StyleSheet } from "react-native"
import { NavigateCard } from "../components/NavigateCard"
import { CircleUser } from "lucide-react-native"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../../../redux"
import { logoutAction } from "../../../redux/authSlice"
import { useNavigation } from "@react-navigation/native"
import { AppNavigation } from "../../../navigation"
import { showSuccess } from "../../../core/services"


export function ProfileScreen() {
  const dispatch: AppDispatch = useDispatch();

  const navigation = useNavigation<AppNavigation>();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
     dispatch(logoutAction());
     showSuccess('Successfully logged out!');
  }

  return (
    <View style={{ display: 'flex', justifyContent: 'center', paddingVertical: 100 }}>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircleUser size={180} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={{ fontSize: 30 }}>{user?.name}</Text>
        <Text>{user?.email}</Text>
      </View>

      <View>
        <NavigateCard text="My banks" onPressed={() => console.log('My banks')} />
        <NavigateCard text="My votes" onPressed={() => console.log('My votes')} />
        <NavigateCard text="Edit profile"onPressed={() => navigation.navigate('EditProfile')}  />
        <NavigateCard text="Log out" onPressed={handleLogout} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  }
})
