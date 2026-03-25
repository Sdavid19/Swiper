import { StyleSheet, View } from "react-native";
import { InputField, PrimaryButton } from "../../../../shared/components";
import { useEffect, useState } from "react";
import { CreateQuestionDto, QuestionDto } from "../../../../shared/types/generated";
import { EditQuestionScreenMode } from "../../screens/EditQuestionScreen";
import { ErrorResponse, ValidationErrorMessage } from "../../../../shared/types";
import { showSuccess } from "../../../../shared/utils/toast.service";
import { AxiosError } from "axios";
import { createQuestion, updateQuestion } from "../../services/question.service";
import { useDispatch } from "react-redux";
import { addQuestionAction, updateQuestionAction } from "../../../../redux/questionSlice";

interface EditQuestionFormProps {
    screenMode: EditQuestionScreenMode,
    bankId: number,
    question?: QuestionDto,
    setQuestion: React.Dispatch<React.SetStateAction<QuestionDto | undefined>>
}

export function EditQuestionForm({screenMode, bankId, question, setQuestion}: EditQuestionFormProps){
    const [text, setText] = useState("");
    const [errors, setErrors] = useState<ValidationErrorMessage<CreateQuestionDto> | null>(null);

    const dispatch = useDispatch();

    const setUpDataForUpdate = () => {
        if(!question) return;
        setText(question.text);
    }

        const saveQuestion = async () => {
        try {
            if (screenMode === "Edit" && question) {
                const response = await updateQuestion(question.id, {text});
                setQuestion(response);
                dispatch(updateQuestionAction(response));
                showSuccess('Question updated succesfully!');
            } else {
                const response = await createQuestion(bankId, {text});
                setQuestion(response);
                dispatch(addQuestionAction(response));
                showSuccess('Question created succesfully!');
            }
        } catch (err) {
            const error = err as AxiosError<ErrorResponse<CreateQuestionDto>>
            const message = error.response?.data.message
      
            if (typeof message === "object") {
              setErrors(message);
            }
        }
    }

    useEffect(() => {
        setUpDataForUpdate();
    }, [question]);

    return (
          <View style={styles.formContainer}>
            <InputField
                value={text}
                onChangeText={setText}
                label="Question"
                errorMessages={errors?.text}
            />

            <PrimaryButton
                title="Edit question"
                style={{ width: "100%"}}
                onPress={saveQuestion}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        justifyContent: "space-evenly"
    }
});