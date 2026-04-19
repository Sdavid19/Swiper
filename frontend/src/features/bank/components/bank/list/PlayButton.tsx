import { Play } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type PlayButtonProps = {
  onPressed: () => void;
};

export function PlayButton({ onPressed }: PlayButtonProps) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={{
          backgroundColor: "#22c55e",
          padding: 13,
          marginRight: 5,
          borderRadius: 100,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,

          elevation: 5,
        }}
        onPress={onPressed}
      >
        <Play color="#ffffff" size={22}></Play>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
  },
});
