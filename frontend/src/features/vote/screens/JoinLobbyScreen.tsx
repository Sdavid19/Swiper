import { View, Text, Platform } from "react-native";
import { InputField, PrimaryButton } from "../../../shared/components";
import { KeySquare } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect, useState } from "react";
import { socket } from "../../../socket/socket";
import { ConnectRoomDto } from "../../../socket/types";
import { showError } from "../../../shared/utils/toast.service";
import { useNavigation } from "@react-navigation/native";
import { VoteNavigation, VoteStackParamList } from "../../../navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

export function JoinLobbyScreen() {
  const [roomId, setRoomId] = useState('');
  const navigation = useNavigation<VoteNavigation>();
  const user = useSelector((state: RootState) => state.auth.user);

  const buttonDisabled = () => {
    return roomId.length != 6;
  }

  const handleJoinRoom = () => {
    if (!roomId || !user) return;

    socket.emit("checkRoom", { roomId: Number(roomId) }, (data: ConnectRoomDto) => {
      if (data.ok) {
        socket.emit("joinRoom", {
          roomId: data.roomId,
          userId: user.id
        });
      } else {
        showError(`Room with the given code doesn't exists`);
      }
    });
  };

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("joinedRoom", ({ roomId }) => {
      navigation.navigate("Lobby", {roomId: roomId})
    });

    socket.on("joinError", (err) => {
      showError("Error joining vote!");
    });

    return () => {
      socket.off("connect");
      socket.off("joinedRoom");
      socket.off("joinError");
      socket.disconnect();
    };
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingBottom: 15
      }}
      enableOnAndroid={true}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      
    >
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 20
        }}
      >
        Write the code down below
      </Text>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View>
          <InputField
            label="Room code"
            placeholder="000000"
            Icon={KeySquare}
            value={roomId}
            onChangeText={setRoomId}
          />

          <PrimaryButton
            title="Join vote"
            disabled={buttonDisabled()}
            onPress={handleJoinRoom}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}