import { Text, View, StyleSheet, Image } from "react-native"
import { NavigateCard } from "../components/NavigateCard"
import { CircleUser } from "lucide-react-native"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../../../redux"
import { logoutAction } from "../../../redux/authSlice"
import { useNavigation } from "@react-navigation/native"
import { AppNavigation, ProfileNavigation } from "../../../navigation"
import { getImage } from "../../../api/services/image.service"
import { showSuccess } from "../../../shared/utils/toast.service"


export function ProfileScreen() {
  const dispatch: AppDispatch = useDispatch();

  const navigation = useNavigation<ProfileNavigation>();

  const user = useSelector((state: RootState) => state.auth.user);

  console.log(user?.imageUrl)

  const handleLogout = () => {
    dispatch(logoutAction());
    showSuccess('Successfully logged out!');
  }

  return (
    <View style={{ display: 'flex', justifyContent: 'center', paddingVertical: 30 }}>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginVertical: 0 }}>
        {user?.imageUrl ?
          (<Image src={getImage(user.imageUrl)} style={{ width: 200, height: 200, borderRadius: 100, borderWidth: 3 }}></Image>)
          :
          (<CircleUser size={180} />)}
      </View>

      <View style={styles.infoContainer}>
        <Text style={{ fontSize: 30, fontWeight: '400' }}>{user?.name}</Text>
        <Text style={{ marginTop: 5 }}>{user?.email}</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <NavigateCard text="My banks" onPressed={() => console.log('My banks')} />
        <NavigateCard text="My votes" onPressed={() => console.log('My votes')} />
        <NavigateCard text="Edit profile" onPressed={() => navigation.navigate('EditProfile')} />
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
    marginTop: 10,
    marginBottom: 30
  }
})
