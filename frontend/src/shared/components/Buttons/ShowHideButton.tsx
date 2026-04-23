import { Eye, EyeClosed, EyeOff } from "lucide-react-native";
import { Alert, TouchableOpacity } from "react-native";

type ShowHideButton = {
    onPress: () => Promise<void> | void;
    confirmTitle?: string;
    confirmMessage?: string;
    iconSize?: number;
    iconColor?: string;
    hidden: boolean
}

export function ShowHideButton({
    onPress,
    confirmTitle = "Confirm Hide",
    confirmMessage = "Are you sure you want to hide this item?",
    iconSize = 24,
    iconColor = "#007AFF",
    hidden
}: ShowHideButton) {

    const handlePress = () => {
        Alert.alert(confirmTitle, confirmMessage, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Hide",
                style: "default",
                onPress: async () => {
                    await onPress();
                },
            },
        ]);
    };



    return (
        <TouchableOpacity
            style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
            }}
            onPress={handlePress}
        >
            {hidden ? <EyeOff size={iconSize} color={iconColor} />  : <Eye size={iconSize} color={iconColor} /> }
        </TouchableOpacity>
    );
}