import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

type NavigateCardProps = {
    text: string
    onPressed: () => void
}

export function NavigateCard({text, onPressed}: NavigateCardProps){
    return (
        <Pressable onPress={onPressed} style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 60, marginVertical: 12}}>
            <Text style={{fontSize: 22}}>{text}</Text>
            <ChevronRight />
        </Pressable>
    );
}

