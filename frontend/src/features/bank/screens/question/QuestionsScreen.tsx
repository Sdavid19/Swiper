import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { EditBankNavigation, EditBankStackParamList } from "../../../../navigation";
import { useEffect } from "react";
import { getQuestionsByBank } from "../../services/question.service";
import { PrimaryButton } from "../../../../shared/components";
import { QuestionCard } from "../../components/question/QuestionCard";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../redux/questionSlice";
import { RootState } from "../../../../redux";

type EditBankProps = NativeStackScreenProps<EditBankStackParamList, "BankQuestions">;

export function QuestionsScreen({ route }: EditBankProps) {
  const bankId = route.params.bankId;
  const navigation = useNavigation<EditBankNavigation>()
  const dispatch = useDispatch();

  const questions = useSelector((state: RootState) => state.question);

  useEffect(() => {
    getQuestionsByBank(bankId)
      .then(res => dispatch(setQuestions(res)))
      .catch(err => console.log(err));
  }, []);

  return (
    <View style={styles.container}>
      {questions.length > 0 ? (
        <FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <QuestionCard question={item} />}
        />
      ) : (
        <View style={styles.emptycontainer}>
          <Text>There are now questions.</Text>
        </View>
      )}

      <PrimaryButton
        title="Add new"
        style={styles.addButton}
        onPress={() => navigation.navigate("EditQuestion", { bankId, questionId: undefined })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  listContent: {
    paddingBottom: 20,
  },
  addButton: {
    width: "100%",
    marginTop: 10
  },
  emptycontainer: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});