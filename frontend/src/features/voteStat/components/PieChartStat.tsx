import { AnswerStatDto } from "@/src/shared/types/generated";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { pieDataItem, PieChart } from "react-native-gifted-charts";

type PieChartProps = {
    selectedQuestion: AnswerStatDto,
    colors: string[],
    selectedColors: string[],
    selectedPieData: "yes" | "no" | undefined,
    setSelectedPieData: React.Dispatch<React.SetStateAction<"yes" | "no" | undefined>>
}

export function PieChartStat({selectedQuestion, colors, selectedColors, selectedPieData,  setSelectedPieData}: PieChartProps) {
 
    const pieItemData = useMemo<pieDataItem[]>(() => {
  if (!selectedQuestion) return [];

  const total = selectedQuestion.yes + selectedQuestion.no;

  return [
    {
      value: selectedQuestion.no,
      color: selectedPieData == "no" ? selectedColors[1] : colors[1],
      text: `${selectedQuestion.no}`,
      onPress: () => setSelectedPieData("no")
    },
    {
      value: selectedQuestion.yes,
      color: selectedPieData == "yes" ? selectedColors[0] : colors[0],
      text: ` ${selectedQuestion.yes}`,
      onPress: () => setSelectedPieData("yes")
    },
  ];
}, [selectedQuestion, selectedPieData]);


    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    {selectedQuestion.question.text}
                </Text>
                <View style={{ display: 'flex', alignItems: 'center' }}>
                    <PieChart data={pieItemData} showText />
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: colors[0], marginRight: 5 }}></View>
                            <Text>Yes</Text>
                        </View>
                        <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: colors[1], marginRight: 5 }}></View>
                            <Text>No</Text>
                        </View>
                    </View>
                </View>
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
    textAlign: 'center'
  },
});