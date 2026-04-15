import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { UserDto } from "../../../../shared/types/generated";
import { getImage } from "../../../../api/services/image.service";
import { Copy } from "lucide-react-native";
import * as Clipboard from 'expo-clipboard';
import { showInfo, showSuccess } from "../../../../shared/utils/toast.service";
import { LobbyUserDto } from "../../../../shared/types/lobby-user.dto";

interface LobbyProps {
  users: LobbyUserDto[]
}

export function Lobby({ users }: LobbyProps) {

  return (
    <View>
      <Text style={styles.title}>Participants ({users.length})</Text>

      <View style={styles.grid}>
        {users.map((user) => (
          <View key={user.id} style={styles.userBox}>
            <Image
              source={{
                uri: user.imageUrl ? getImage(user.imageUrl) : 'https://placecats.com/100/100'
              }}
              style={styles.userImage}
            />
            <Text style={styles.userName}>{user.name} - {String(user.ready)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  roomCode: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: 'underline'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  userBox: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
    marginRight: '3.333%',
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: '#ccc',
  },
  userName: {
    fontSize: 15,
    textAlign: 'center',
  },
});