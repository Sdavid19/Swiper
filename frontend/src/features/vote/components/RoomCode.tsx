import { Copy } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Clipboard from 'expo-clipboard';
import { showSuccess } from "../../../shared/utils/toast.service";

type RoomCodeProps = {
    roomCode: number
}

export function RoomCode({roomCode}: RoomCodeProps){

    const copyRoomCodeToClipboard = async () => {
        await Clipboard.setStringAsync(roomCode.toString());
        showSuccess("Room code copied to clipboard!");
    };

    return (
        <TouchableOpacity onPress={copyRoomCodeToClipboard} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10}}>
             <Text style={styles.roomCode}>{roomCode}</Text>
             <Copy size={25} style={{marginBottom: 5, marginLeft: 5}} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  roomCode: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: 'underline'
  }
});