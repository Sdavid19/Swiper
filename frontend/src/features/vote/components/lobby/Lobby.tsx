import { View, Text, Image, StyleSheet } from "react-native";
import { getImage } from "../../../../shared/utils/image.service";
import { User } from "lucide-react-native";
import { LobbyUserDto } from "../../../../shared/types/lobby-user.dto";
import { StatusBadge } from "./StatusBadge";

interface LobbyProps {
  users: LobbyUserDto[];
}

export function Lobby({ users }: LobbyProps) {
  return (
    <View>
      <Text style={styles.title}>Participants ({users.length})</Text>

      <View style={styles.grid}>
        {users.map((user) => (
          <View key={user.id} style={styles.userBox}>
            <StatusBadge ready={user.ready} />
            {user.imageUrl ? (
              <Image
                source={{
                  uri: getImage(user.imageUrl),
                }}
                style={styles.userImage}
              />
            ) : (
              <User size={80} style={styles.userImage} color="black"></User>
            )}

            <Text style={styles.userName}>{user.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  roomCode: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  userBox: {
    width: "30%",
    alignItems: "center",
    marginBottom: 15,
    marginRight: "3.333%",
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: "#ccc",
  },
  userName: {
    fontSize: 15,
    textAlign: "center",
  },
});
