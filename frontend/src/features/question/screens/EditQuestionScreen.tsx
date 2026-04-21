import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { EditBankStackParamList } from "../../../navigation";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { QuestionDto } from "../../../shared/types/generated";
import { deleteQuestion, getQuestionById } from "../services/question.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { QuestionImageSelect } from "../components/editQuestionForm/QuestionImageSelect";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { DeleteButton } from "../../../shared/components/DeleteButton";
import { showSuccess } from "../../../shared/utils/toast.service";
import { removeQuestionAction } from "../../../redux/questionSlice";
import { EditQuestionForm } from "../components/editQuestionForm/EditQuestionForm";

type EditQuestionProps = NativeStackScreenProps<EditBankStackParamList, "EditQuestion">;

export type EditQuestionScreenMode = "View" | "Edit" | "Create";

export function EditQuestionScreen({ route }: EditQuestionProps) {

  const questionId = route.params.questionId;
  const viewMode = route.params.viewMode;
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<NativeStackNavigationProp<EditBankStackParamList>>();
  const dispatch = useDispatch();

  const [question, setQuestion] = useState<QuestionDto>();

  useLayoutEffect(() => {
    if (!question || viewMode) return;
    navigation.setOptions({
      headerRight: () =>
        <DeleteButton
          onDelete={async () => {
            await deleteQuestion(question.id);
            showSuccess("Question deleted successfully!");
            dispatch(removeQuestionAction(question.id));
            navigation.goBack();
          }}
        />
    });
  }, [question, navigation])

  const loadData = async () => {
    try {
      if (!questionId) return;
      const question = await getQuestionById(questionId);
      setQuestion(question);
    } catch (error) {
      console.log("Data load error:", error);
    }
  };

  const screenMode: EditQuestionScreenMode = useMemo(() => {
    if(viewMode) return "View"
    if (question?.id) return "Edit";
    if (!route.params?.questionId) return "Create";
    if (!user) return "View";
    return "View";
  }, [route.params?.questionId, question, user]);

  const isEditable = screenMode !== "View";
  const isCreateMode = screenMode === "Create";

  useEffect(() => {
    loadData();
  }, [])

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.container]}
      enableOnAndroid={true}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={80}
      showsVerticalScrollIndicator={false}

    >
      <QuestionImageSelect
        questionId={question?.id}
        imageUrl={question?.imageUrl}
        shape="rectangle"
        aspect={[3, 4]}
        disabled={!isEditable || isCreateMode}
      />

      <EditQuestionForm
        bankId={route.params.bankId}
        screenMode={screenMode}
        question={question}
        setQuestion={setQuestion}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
    //flexGrow: 1,
  },
});