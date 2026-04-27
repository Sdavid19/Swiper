import { useEffect, useMemo, useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { getTopVoteStats } from "../../vote/services/vote.service";
import { AnswerStatDto } from "@/src/shared/types/generated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { VoteStatStackParamList } from "@/src/navigation";
import { ScrollView } from "react-native-gesture-handler";
import { PieChartStat } from "../components/PieChartStat";
import { BarChartStat } from "../components/BarChartStat";
import { UserStat } from "../components/userStat/UserStat";

type VoteStatScreenProps = NativeStackScreenProps<VoteStatStackParamList, "VoteStat">;

export function VoteStatScreen({ route }: VoteStatScreenProps) {
  const voteId = route.params.voteId;

  const [stat, setStat] = useState<AnswerStatDto[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [selected, setSelected] = useState<number>();
  const [selectedPieData, setSelectedPieData] = useState<"yes" | "no">();

  const colors = ["#007AFF", "#FFA500"];
  const selectedColors = ["#005BBB", "#C77700"];

  const handleSelect = useCallback((id: number) => {
    setSelected(id);
    setSelectedPieData(undefined);
  }, [selected]);

  const selectedQuestion = useMemo(() => {
    return stat.find((x) => x.question.id === selected);
  }, [stat, selected]);


  const users = useMemo(() => {
    if (!selectedQuestion || !selectedPieData) return [];

    return selectedQuestion.answers
      .filter(x => x.answer === (selectedPieData === "yes"))
      .map(x => x.user).flat();
  }, [selectedQuestion, selectedPieData]);

  useEffect(() => {
    getTopVoteStats(voteId)
      .then((res) => {
        setStat(res.stats);
        setUserCount(res.userCount);
        if (res.stats.length > 0) {
          setSelected(res.stats[0].question.id);
        }
      })
      .catch((err) => console.log(err));
  }, [voteId]);


  return (
    <ScrollView style={styles.container}>

      <BarChartStat stat={stat} handleSelect={handleSelect} selectedQuestion={selectedQuestion} userCount={userCount} />

      {selectedQuestion &&
        <PieChartStat
          colors={colors}
          selectedColors={selectedColors}
          selectedPieData={selectedPieData}
          selectedQuestion={selectedQuestion}
          setSelectedPieData={setSelectedPieData}
        />
      }

      {selectedPieData && <UserStat users={users} selectedPieData={selectedPieData} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  }
});