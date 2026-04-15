import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { VoteStatStackParamList } from "@/src/navigation";
import { getVotesByUserParticipatedIn } from "../../services/vote.service";
import { VoteDto } from "@/src/shared/types/generated";
import { BankFilterList } from "../../../bank/components/bank/list/BankFilterList";
import { VoteFilterList } from "../../components/VoteStat/VoteFilterList";

type VoteScreenProps = NativeStackScreenProps<VoteStatStackParamList, "ShowVotes">;

export function VotesScreen({ route }: VoteScreenProps) {
    const [votes, setVotes] = useState<VoteDto[]>([]);

    useEffect(() => {
      getVotesByUserParticipatedIn()
      .then(res => setVotes(res))
      .catch(err => console.log(err));
    }, []);

  return (
    <View style={styles.container}>

      <VoteFilterList votes={votes} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5"
  },
  addButton: {
    width: "100%",
    marginTop: 15
  }
});