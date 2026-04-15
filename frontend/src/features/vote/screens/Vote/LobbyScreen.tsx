import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Lobby } from "../../components/Vote/Lobby";
import { AppNavigation, AppStackParamList, VoteStackParamList } from "../../../../navigation";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { socket } from "../../../../socket/socket";
import { useNavigation } from "@react-navigation/native";
import { LogOut } from "lucide-react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux";
import { PrimaryButton } from "../../../../shared/components";
import { LobbyUserDto } from "../../../../shared/types/lobby-user.dto";
import { BankDto } from "../../../../shared/types/generated";
import { getBankById } from "../../../bank/services/bank.service";
import { RoomCode } from "../../components/Vote/RoomCode";

type LobbySreenProps = NativeStackScreenProps<VoteStackParamList, "Lobby">;

export function LobbyScreen({ route }: LobbySreenProps) {
  const roomId = route.params.roomId;
  const bankId = route.params.bankId;

  const [users, setUsers] = useState<LobbyUserDto[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [allReady, setAllReady] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(5);
  const [bank, setBank] = useState<BankDto>();
  const navigation = useNavigation<AppNavigation>();
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleReady = () => {
    if (!user || !roomId) return;

    const newReady = !ready;
    if (newReady) setCountDown(5);

    setReady(newReady);

    socket.emit("toggleReady", {
      roomId,
      userId: user.id,
      ready: newReady
    });
  };

  const handleLeaveRoom = () => {
    if (!user) return;

    Alert.alert(
      "Confirm Leave",
      "Are you sure you want to leave the room?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            socket.emit("leaveRoom", { roomId, userId: user.id });
            navigation.replace("Tabs", { screen: "VoteStack", params: { screen: "JoinLobby" } });
          }
        }
      ]
    );
  };

  useEffect(() => {

    const handleRoomUsers = (usersList: LobbyUserDto[]) => {
      setUsers(usersList);
    };

    const handleCountdownStart = () => {
      setAllReady(true);
    };

    const handleCountdownTick = (tick: number) => {
      setCountDown(tick);
    };

    const handleCountdownCanceled = () => {
      setAllReady(false);
      setCountDown(5);
    };

    const handleLeftRoom = ({ userId: leftUserId, roomId: leftRoomId }: any) => {
      if (leftRoomId === roomId && leftUserId !== user?.id) {
        setUsers(prev => prev.filter(u => u.id !== leftUserId));
      }
    };

    const handleGameStart = ({ roomId }: { roomId: number }) => {
      navigation.navigate("Vote", {
        roomId,
        bankId: bankId
      });
    };

    socket.on("roomUsers", handleRoomUsers);
    socket.on("countdownStart", handleCountdownStart);
    socket.on("countdownTick", handleCountdownTick);
    socket.on("countdownCanceled", handleCountdownCanceled);
    socket.on("leftRoom", handleLeftRoom);
    socket.on("gameStart", handleGameStart);

    getBankById(bankId)
      .then(b => setBank(b))
      .catch(err => console.log(err));

    return () => {
      socket.off("roomUsers", handleRoomUsers);
      socket.off("countdownStart", handleCountdownStart);
      socket.off("countdownTick", handleCountdownTick);
      socket.off("countdownCanceled", handleCountdownCanceled);
      socket.off("leftRoom", handleLeftRoom);
      socket.off("gameStart", handleGameStart)
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLeaveRoom}>
          <LogOut size={30} color="red" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 15 }}>

      <View style={{ flex: 1 }}>
        <RoomCode roomCode={roomId} />

        {bank && (
          <View style={styles.header}>
            <Text style={styles.title}>{bank.title}</Text>
            {bank.description && (
              <Text style={styles.description}>{bank.description}</Text>
            )}
          </View>
        )}

        <Lobby users={users} />
      </View>

      <PrimaryButton
        onPress={toggleReady}
        title={
          ready
            ? allReady
              ? `Ready - ${countDown}`
              : "Ready"
            : "Not ready"
        }
        style={{
          backgroundColor: ready ? "#00cc00" : "#b8b8b8",
          marginTop: 20
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
});