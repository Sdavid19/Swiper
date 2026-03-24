import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { EditBankStackParamList } from "../../../navigation";
import { useEffect, useState } from "react";
import { QuestionDto } from "../../../shared/types/generated";
import { getQuestionsByBank } from "../services/question.service";
import { ChevronRight, EllipsisVertical } from "lucide-react-native";
import { PrimaryButton } from "../../../shared/components";

type EditBankProps = NativeStackScreenProps<EditBankStackParamList, "BankQuestions">;

export function QuestionsScreen({ route }: EditBankProps) {
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const bankId = route.params.bankId;

  useEffect(() => {
    getQuestionsByBank(bankId).then(setQuestions);
  }, [bankId]);

  const renderItem = ({ item }: { item: QuestionDto }) => (
    <TouchableOpacity style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Image
          style={styles.cardImage}
          source={{ uri: "https://placecats.com/250/400" }}
        />
        <Text style={styles.cardText}>{item.text}</Text>
      </View>
      <ChevronRight style={{marginRight: 6}} size={20}/>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <PrimaryButton
              title="Add new" 
              style={styles.addButton} 
              onPress={() => console.log('asd')} 
            />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: "#f5f5f5",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  listContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 6,
    marginVertical: 8,
    
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardImage: {
    width: 62,
    height: 62,
    marginRight: 10,
    borderRadius: 6,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  cardText: {
    fontSize: 16,
    flexShrink: 1,
  },
  addButton: {
    width: "100%",
    marginTop: 10
  }
});