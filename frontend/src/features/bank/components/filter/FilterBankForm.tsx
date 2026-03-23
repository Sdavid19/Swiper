import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton } from "../../../../shared/components";
import { CategoryDto } from "../../../../shared/types/generated";
import { ToggleButton } from "./ToggleButton";

interface FilterBankFormProps {
     categories: CategoryDto[],
     selected: number[],
     setSelected: React.Dispatch<React.SetStateAction<number[]>>,
     setVisible: () => void;
}

export function FilterBankForm({categories, selected, setSelected, setVisible}: FilterBankFormProps){

    const toggleCategory = (id: number) => {
        setSelected((prev) =>
        prev.includes(id)
            ? prev.filter((i) => i !== id)
            : [...prev, id] 
        );
    };

    return (
        <>
            <Text style={styles.title}>Categories</Text>
            <FlatList
                data={categories}
                numColumns={3}
                keyExtractor={(item) => item.name}
                contentContainerStyle={{ paddingTop: 10 }}
                renderItem={({ item }) => 
                    <ToggleButton 
                        item={item}
                        isSelected={selected.includes(item.id)}
                        toggleCategory={toggleCategory} 
                    />}
                />
            
            <PrimaryButton onPress={setVisible} style={{marginBottom: 30}} title="Apply filter" />
        </>
    );
}

const styles = StyleSheet.create({
    title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  }
});