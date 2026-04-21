import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";

interface PrimaryButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  title,
  disabled = false,
  onPress,
  style,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#22c55e",
    //backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    opacity: 1,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});
