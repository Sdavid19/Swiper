import { Text, View } from "react-native";
import { PrimaryButton } from "../../../shared/components";
import { use, useEffect } from "react";
import { socket } from "../../../socket/socket";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppNavigation, AppStackParamList, VoteNavigation, VoteStackParamList } from "../../../navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { useNavigation } from "@react-navigation/native";

type CreateLobbyScreenProps = NativeStackScreenProps<AppStackParamList, "CreateLobby">;

export function CreateLobbyScreen({route}: CreateLobbyScreenProps) {

  const bankId = route.params.bankId;
    const user = useSelector((state: RootState) => state.auth.user);
    const navigation = useNavigation<AppNavigation>();

  const handleCreateLobby = () => {
    if(!user || !bankId) return;
    socket.emit("createRoom", {
      bankId: bankId,
      userId: user.id
    });

  };

  useEffect(() => {
    if (!socket.connected) socket.connect();

   socket.on("roomCreated", ({ roomId, bankId }) => {
      console.log("Room létrehozva:", roomId, bankId);

      navigation.navigate("Tabs", {
        screen: "VoteStack",
        params: {
          screen: "Lobby",
          params: { roomId } 
        }
      });
    });


    return () => {
      socket.off("roomCreated");
      socket.disconnect();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <PrimaryButton
        title="Create a lobby"
        style={{marginBottom: 20}}
        onPress={handleCreateLobby}
      />
    </View>
  );
}