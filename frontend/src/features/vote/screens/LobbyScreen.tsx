import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppNavigation, VoteStackParamList } from "../../../navigation";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { getSocket } from "../../../socket/socket";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { PrimaryButton } from "../../../shared/components";
import { LobbyUserDto } from "../../../shared/types/lobby-user.dto";
import { BankDto } from "../../../shared/types/generated";
import { getBankById } from "../../bank/services/bank.service";
import { LeaveRoomButton } from "@/src/shared/components/LeaveRoomButton";
import { RoomCode } from "../components/lobby/RoomCode";
import { Lobby } from "../components/lobby/Lobby";

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

    getSocket()?.emit("toggleReady", {
      roomId,
      ready: newReady,
    });
  };

  const handleLeaveRoom = () => {
    if (!user) return;

    getSocket()?.emit("leaveRoom", { roomId });
    navigation.replace("Tabs", {
      screen: "VoteStack",
      params: { screen: "JoinLobby" },
    });
  };

  useEffect(() => {

    getBankById(bankId)
      .then((b) => setBank(b))
      .catch((err) => console.log(err));


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

    const handleLeftRoom = ({
      userId: leftUserId,
      roomId: leftRoomId,
    }: {userId: number, roomId: number}) => {
      if (leftRoomId === roomId && leftUserId !== user?.id) {
        setUsers((prev) => prev.filter((u) => u.id !== leftUserId));
      }
    };

    const handleGameStart = ({ roomId }: { roomId: number }) => {
      navigation.navigate("Vote", {
        roomId,
        bankId: bankId,
      });
    };

    getSocket()?.on("roomUsers", handleRoomUsers);
    getSocket()?.on("countdownStart", handleCountdownStart);
    getSocket()?.on("countdownTick", handleCountdownTick);
    getSocket()?.on("countdownCanceled", handleCountdownCanceled);
    getSocket()?.on("leftRoom", handleLeftRoom);
    getSocket()?.on("gameStart", handleGameStart);

    return () => {
      getSocket()?.off("roomUsers", handleRoomUsers);
      getSocket()?.off("countdownStart", handleCountdownStart);
      getSocket()?.off("countdownTick", handleCountdownTick);
      getSocket()?.off("countdownCanceled", handleCountdownCanceled);
      getSocket()?.off("leftRoom", handleLeftRoom);
      getSocket()?.off("gameStart", handleGameStart);
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LeaveRoomButton onPress={handleLeaveRoom} />,
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
          ready ? (allReady ? `Ready - ${countDown}` : "Ready") : "Not ready"
        }
        style={{
          backgroundColor: ready ? "#22c55e" : "#b8b8b8",
          marginTop: 20,
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
