import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import {
  EditBankNavigation,
  EditBankStackParamList,
} from "../../../../navigation";
import { useEffect } from "react";
import { getQuestionsByBank } from "../../services/question.service";
import { PrimaryButton } from "../../../../shared/components";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../../../../redux/questionSlice";
import { RootState } from "../../../../redux";
import { QuestionList } from "../../components/question/QuestionList";

type EditBankProps = NativeStackScreenProps<
  EditBankStackParamList,
  "BankQuestions"
>;

export function QuestionsScreen({ route }: EditBankProps) {
  const bankId = route.params.bankId;
  const viewMode = route.params.viewMode;
  const navigation = useNavigation<EditBankNavigation>();
  const dispatch = useDispatch();

  const questions = useSelector((state: RootState) => state.question);

  useEffect(() => {
    getQuestionsByBank(bankId)
      .then((res) => dispatch(setQuestions(res)))
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={styles.container}>
      <QuestionList questions={questions} viewMode={viewMode} />

      {!viewMode && (
        <PrimaryButton
          title="Add new"
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("EditQuestion", {
              bankId,
              questionId: undefined,
            })
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    padding: 10,
  },
  addButton: {
    width: "100%",
    marginTop: 10,
  },
});
