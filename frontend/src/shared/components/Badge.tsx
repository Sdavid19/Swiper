import { StyleSheet, Text, View } from "react-native";

type BadgeProps = {
  text: string;
  color: string;
};

export function Badge({ text, color }: BadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 12,
  },
});
