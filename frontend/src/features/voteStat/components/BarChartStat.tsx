import { AnswerStatDto } from "@/src/shared/types/generated";
import { Users } from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";

type BarChartStatProps = {
  stat: AnswerStatDto[];
  handleSelect: (x: number) => void;
  selectedQuestion: AnswerStatDto | undefined;
  userCount: number;
};

export function BarChartStat({
  stat,
  handleSelect,
  selectedQuestion,
  userCount,
}: BarChartStatProps) {
  const max = useMemo(() => {
    return Math.max(...stat.map((stat) => stat.yes), 0);
  }, [stat]);

  const sectionCount = () => {
    if (max < 5) return max;
    if (max >= 5) return 5;
  };

  const barItemdata: barDataItem[] = useMemo(() => {
    return stat.map(
      (x) =>
        ({
          value: x.yes,
          frontColor:
            x.question.id == selectedQuestion?.question.id
              ? "#005BBB"
              : "#007AFF",
          label: x.question.text,
          autoCenterTooltip: true,
          labelTextStyle: {
            fontWeight:
              x.question.id == selectedQuestion?.question.id
                ? "bold"
                : "normal",
          },
          onPress: () => handleSelect(x.question.id),
        }) as barDataItem,
    );
  }, [stat, handleSelect]);

  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>Vote Results</Text>
          <View style={styles.userCount}>
            <Users size={20} color={"black"} />
            <Text>{userCount}</Text>
          </View>
        </View>
        <BarChart
          data={barItemdata}
          height={200}
          spacing={45}
          initialSpacing={30}
          noOfSections={sectionCount()}
          maxValue={max}
          overScrollMode="always"
          stepValue={1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },

  shadowWrapper: {
    shadowColor: "#3a3a3a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    borderRadius: 8,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    padding: 10,
    paddingLeft: 0,
  },

  title: {
    marginVertical: 10,
    marginBottom: 20,
    marginLeft: 20,
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  userCount: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 0,
    right: 0,
  },
});
