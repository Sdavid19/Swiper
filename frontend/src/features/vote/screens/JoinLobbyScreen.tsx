import { View, Text } from "react-native";
import { InputField, PrimaryButton } from "../../../shared/components";
import { KeySquare, UserRoundPlus } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect, useState } from "react";
import { getSocket } from "../../../socket/socket";
import { ConnectRoomDto } from "../../../socket/types";
import { showError } from "../../../shared/utils/toast.service";
import { useNavigation } from "@react-navigation/native";
import { AppNavigation, VoteNavigation } from "../../../navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

export function JoinLobbyScreen() {
  const [roomId, setRoomId] = useState("");
  const appNavigation = useNavigation<AppNavigation>();
  const user = useSelector((state: RootState) => state.auth.user);

  const buttonDisabled = () => {
    return roomId.length != 6;
  };

  const handleJoinRoom = () => {
    if (!roomId || !user) return;

    getSocket()?.emit("checkRoom",
      { roomId: Number(roomId) },
      (data: ConnectRoomDto) => {
        if (data.ok) {
          getSocket()?.emit("joinRoom", {
            roomId: data.roomId,
          });
        } else {
          showError(`Room with the given code doesn't exists`);
        }
      },
    );
  };

  useEffect(() => {
    getSocket()?.on("joinedRoom", ({ roomId, bankId }) => {
      appNavigation.replace("Lobby", { roomId: roomId, bankId: bankId })
    });

    getSocket()?.on("joinError", (err) => {
      showError(err);
    });

    return () => {
      getSocket()?.off("connect");
      getSocket()?.off("joinedRoom");
      getSocket()?.off("joinError");
    };
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 15,
        paddingBottom: 20,
      }}
      enableOnAndroid={true}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        Write the code down below
      </Text>

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View>
          <InputField
            label="Room code"
            placeholder="000000"
            Icon={KeySquare}
            value={roomId}
            onChangeText={setRoomId}
          />

          <PrimaryButton
            icon={<UserRoundPlus size={18} color="white" />}
            title="Join room"
            disabled={buttonDisabled()}
            onPress={handleJoinRoom}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
