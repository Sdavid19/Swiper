import { Check, X } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

type SwipeButtonProps = {
    over: boolean;
    onPress: () => void;
    side: "left" | "right"
}

export function SwipeButton({ over, onPress, side }: SwipeButtonProps) {
    return (
        <TouchableOpacity
            disabled={over}
            style={styles.button}
            onPress={onPress}
        >
            {side == "left" && <X size={35} color="red" />}
            {side == "right" && <Check size={35} color="green" />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    button: {
        width: 80,
        height: 80,
        backgroundColor: "white",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,

        elevation: 5,
    },
});
