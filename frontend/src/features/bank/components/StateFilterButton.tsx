import { Book, BookLock, BookText } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

type StateFilterButtonProps = {
    state?: "OPEN" | "LOCKED" | "ALL"
    setState: React.Dispatch<React.SetStateAction<"OPEN" | "LOCKED" | "ALL" | undefined>>
}

export function StateFilterButton({ state, setState }: StateFilterButtonProps) {

    const onPress = () => {
        if (state == "ALL") {
            setState("OPEN");
        } else if (state == "OPEN") {
            setState("LOCKED")
        } else if (state == "LOCKED") {
            setState(undefined);
        }
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ padding: 10 }}
        >
            {state == undefined && <Book size={28} color="black" />}
            {state == "OPEN" && <BookText size={28} color="#007AFF" />}
            {state == "LOCKED" && <BookLock size={28} color="red" />}
        </TouchableOpacity>
    );
}