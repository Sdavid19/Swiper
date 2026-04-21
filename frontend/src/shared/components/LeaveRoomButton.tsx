import { LogOut } from "lucide-react-native";
import { Alert, TouchableOpacity } from "react-native";


type LeaveRoomButtonProps = {
    onPress: () => void
}

export function LeaveRoomButton({ onPress }: LeaveRoomButtonProps) {

    const handleLeaveRoom = () => {
        Alert.alert("Confirm Leave", "Are you sure you want to leave the room?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Leave",
                style: "destructive",
                onPress: onPress
            },
        ]);
    }


    return (
        <TouchableOpacity style={{
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        margin: 0,
      }} onPress={handleLeaveRoom}>
            <LogOut size={30} color="red" />
        </TouchableOpacity>
    );
}