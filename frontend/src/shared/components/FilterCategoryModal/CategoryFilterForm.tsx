import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton } from "..";
import { CategoryDto } from "../../types/generated";
import { CategoryToggleButton } from "./CategoryToggleButton";

export function CategoryFilterForm({
  categories,
  selected,
  setSelected,
  onApply,
  onClear
}: {
  categories: CategoryDto[];
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  onApply: () => void;
  onClear: () => void;
}) {
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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => (
          <CategoryToggleButton
            item={item}
            isSelected={selected.includes(item.id)}
            toggleCategory={toggleCategory}
          />
        )}
      />

      <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, marginHorizontal: 5 }}>
        <PrimaryButton title="Clear filter"
          onPress={onClear}
          style={{ width: '47%' }}></PrimaryButton>
        <PrimaryButton
          title="Apply filter"
          onPress={onApply}
          style={{ width: "47%", }}
        />
      </View>
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