import { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { X } from "lucide-react-native";
import { FilterBankForm } from "./FilterBankForm";
import { CategoryDto } from "../../../../../shared/types/generated";
import { getCategories } from "../../../services/category.service";

interface FilterBankModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export function FilterBankModal({
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

          <FilterBankForm
            categories={categories}
            selected={tempSelected}
            setSelected={setTempSelected}
            onApply={applyFilter}
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