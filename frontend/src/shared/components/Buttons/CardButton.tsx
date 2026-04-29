import { LucideIcon, Play } from "lucide-react-native";
import { ColorValue, StyleSheet, TouchableOpacity, View } from "react-native";

type CardButtonProps = {
  onPressed: () => void;
  backgroundColor: ColorValue,
  Icon: React.ComponentType<{color: string, size: number}>;
};

export function CardyButton({ onPressed, backgroundColor, Icon }: CardButtonProps) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={{
          backgroundColor: backgroundColor,
          padding: 13,
          borderRadius: 100,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,

          elevation: 5,
        }}
        onPress={onPressed}
      >
        <Icon color="#ffffff" size={22}></Icon>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center'
  },
});
