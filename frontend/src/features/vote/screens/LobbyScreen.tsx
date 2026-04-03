import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Lobby } from "../components/Lobby";
import { VoteNavigation, VoteStackParamList } from "../../../navigation";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { socket } from "../../../socket/socket";
import { UserDto } from "../../../shared/types/generated";
import { useNavigation } from "@react-navigation/native";
import { LogOut } from "lucide-react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { PrimaryButton } from "../../../shared/components";
import { LobbyUserDto } from "../../../shared/types/lobby-user.dto";


type LobbySreenProps = NativeStackScreenProps<VoteStackParamList, "Lobby">;
export function LobbyScreen({route}: LobbySreenProps){
    const roomId = route.params.roomId;
    const [users, setUsers] = useState<LobbyUserDto[]>([]);
    const [ready, setReady] = useState<boolean>(false);
    const [allReady, setAllReady] = useState<boolean>(false);
    const [countDown, setCountDown] = useState<number>(5);
    const navigation = useNavigation<NativeStackNavigationProp<VoteStackParamList>>();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleRoomUsers = (usersList: LobbyUserDto[]) => {
      setUsers(usersList);
      console.log(usersList)
    };

    const toggleReady = () => {
    if (!user || !roomId) return;

    const newReady = !ready;
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
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Leave",
        style: "destructive",
        onPress: () => {
          socket.emit("leaveRoom", { roomId, userId: user.id });
          navigation.reset({
            index: 0,
            routes: [{ name: 'JoinLobby' }]
        });
        }
      }
    ]
  );
};


  useEffect(() => {
  socket.emit("getRoomUsers", { roomId });

  const handleLeftRoom = ({ userId: leftUserId, roomId: leftRoomId }: any) => {
    if (leftRoomId === roomId && leftUserId !== user?.id) {
      setUsers(prev => prev.filter(u => u.id !== leftUserId));
    }
  };

  const handleCountdownStart = (val: number) => setAllReady(true);
  const handleCountdownTick = (tick: number) => setCountDown(tick);

  socket.on("countdownStart", handleCountdownStart);
  socket.on("countdownTick", handleCountdownTick);
  socket.on("roomUsers", handleRoomUsers);
  socket.on("leftRoom", handleLeftRoom);

  return () => {
    socket.off("roomUsers", handleRoomUsers);
    socket.off("countdownStart", handleCountdownStart);
    socket.off("countdownTick", handleCountdownTick);
    socket.off("leftRoom", handleLeftRoom);
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
          <Text>{ countDown }</Text>
            <View style={{ flex: 1 }}>
                <Lobby users={users} roomCode={roomId} />
            </View>

            <PrimaryButton
              onPress={toggleReady}
              title={ready ? (allReady && countDown !== null ? `Ready - ${countDown}` : 'Ready') : 'Not ready'}
              style={{ backgroundColor: ready ? '#00cc00' : '#b8b8b8' }}
            />
        </View>
    );
   
}