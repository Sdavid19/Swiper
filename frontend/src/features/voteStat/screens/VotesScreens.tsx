import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { VoteStatStackParamList } from "@/src/navigation";
import { VoteFilterList } from "../components/voteFilterList/VoteFilterList";

type VoteScreenProps = NativeStackScreenProps<VoteStatStackParamList, "ShowVotes">;

export function VotesScreen({ route }: VoteScreenProps) {
  return (
    <View style={styles.container}>
      <VoteFilterList  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5"
  },
  addButton: {
    width: "100%",
    marginTop: 15
  }
});