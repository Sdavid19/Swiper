import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { CategoryDto } from "../../../../../shared/types/generated";

interface ToggleButtonProps {
    isSelected: boolean
    item: CategoryDto,
    toggleCategory: (id: number) => void
}

export function ToggleButton({isSelected, item, toggleCategory}:ToggleButtonProps){

    return(
          <TouchableOpacity
            style={[ styles.item, isSelected && styles.itemSelected]}
            onPress={() => toggleCategory(item.id)}
        >
            <Text style={[ styles.itemText, isSelected && styles.itemTextSelected ]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    item: {
        flex: 1,
        margin: 5,
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
    },

  itemSelected: {
    backgroundColor: "#333",
  },

  itemText: {
    color: "#333",
  },

  itemTextSelected: {
    color: "white",
    fontWeight: "600",
  },
});