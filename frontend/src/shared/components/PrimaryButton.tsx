import { Icon } from "lucide-react-native";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ColorValue,
  View,
} from "react-native";

interface PrimaryButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  style?: StyleProp<ViewStyle>;
  color?: ColorValue;
  icon?: React.ReactNode;
}

export function PrimaryButton({
  title,
  disabled = false,
  color = "#22c55e",
  onPress,
  style,
  icon,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, { backgroundColor: color }, style]}
    >
      {icon && <View style={title ? styles.iconWithText : styles.icon}>{icon}</View>}
      {title && <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    //backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    opacity: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  icon: {
    marginHorizontal: 0
  },
  iconWithText: {
    marginHorizontal: 5
  }
});
