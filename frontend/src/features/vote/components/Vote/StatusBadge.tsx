import { Check, Hourglass } from "lucide-react-native";
import { BackHandler, StyleSheet, View } from "react-native";

type StatusBadgeProps = {
  ready: boolean;
};

export function StatusBadge({ ready }: StatusBadgeProps) {
  return (
    <>
      {ready ? (
        <View style={[styles.statusBadge, { backgroundColor: "#00cc00" }]}>
          <Check size={14} color="white" />
        </View>
      ) : (
        <View style={[styles.statusBadge, { backgroundColor: "#b8b8b8" }]}>
          <Hourglass size={14} color="white" />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    position: "absolute",
    top: -6,
    right: 6,
    borderRadius: 100,
    zIndex: 99,
    padding: 4,
  },
});
