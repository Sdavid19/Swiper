import { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { X } from "lucide-react-native";
import { CategoryFilterForm } from "./CategoryFilterForm";
import { CategoryDto } from "../../types/generated";
import { getCategories } from "../../../features/bank/services/category.service";

interface FilterBankModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export function CategoryFilterModal({
  visible,
  setVisible,
  selected,
  setSelected,
}: FilterBankModalProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [tempSelected, setTempSelected] = useState<number[]>([]);


  useEffect(() => {
    if (visible) {
      setTempSelected(selected);
    }
  }, [visible, selected]);

  const applyFilter = () => { 
    setSelected(tempSelected);
    setVisible(false);
  };

  const clearFilter = () => { 
    setSelected([]);
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 175,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.log);
  }, []);

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />

        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <X size={25} />
          </TouchableOpacity>

          <CategoryFilterForm
            categories={categories}
            selected={tempSelected}
            setSelected={setTempSelected}
            onApply={applyFilter}
            onClear={clearFilter}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalContent: {
    height:"45%",
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    zIndex: 1
  }
});