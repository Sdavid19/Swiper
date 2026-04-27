import { StyleSheet, View } from "react-native";
import { InputField, PrimaryButton } from "../../../../shared/components";
import { useEffect, useState } from "react";
import { CreateQuestionDto, QuestionDto, UpdateBankDto, UpdateQuestionDto } from "../../../../shared/types/generated";
import { ErrorResponse, ValidationErrorMessage } from "../../../../shared/types";
import { showSuccess } from "../../../../shared/utils/toast.service";
import { AxiosError } from "axios";
import { createQuestion, updateQuestion } from "../../services/question.service";
import { useDispatch } from "react-redux";
import { addQuestionAction, updateQuestionAction } from "../../../../redux/questionSlice";
import { EditQuestionScreenMode } from "../../screens/EditQuestionScreen";
import { Plus, Save } from "lucide-react-native";

interface EditQuestionFormProps {
    screenMode: EditQuestionScreenMode,
    bankId: number,
    question?: QuestionDto,
    setQuestion: React.Dispatch<React.SetStateAction<QuestionDto | undefined>>
}

export function EditQuestionForm({ screenMode, bankId, question, setQuestion }: EditQuestionFormProps) {
    const [text, setText] = useState("");
    const [description, setDescription] = useState<string>();
    const [errors, setErrors] = useState<ValidationErrorMessage<CreateQuestionDto> | null>(null);

    const dispatch = useDispatch();

    const setUpDataForUpdate = () => {
        if (!question) return;
        setText(question.text);
        setDescription(question.description ?? undefined)
    }

    const buttonDisabled = () => {
        return !text || (text == question?.text && description == question.description)
    }

    const saveQuestion = async () => {
        try {
            if (screenMode === "Edit" && question) {
                const response = await updateQuestion(question.id, { text, description } as UpdateQuestionDto);
                setQuestion(response);
                dispatch(updateQuestionAction(response));
                showSuccess('Question updated succesfully!');
            } else {
                const response = await createQuestion(bankId, { text, description } as UpdateQuestionDto);
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
                editable={screenMode != "View"}
                errorMessages={errors?.text}
            />

            <InputField
                label="Description"
                value={description}
                editable={screenMode != "View"}
                onChangeText={(text) => setDescription(text)}
                autoCapitalize="none"
                style={styles.descriptionField}
                textAlignVertical="top"
                errorMessages={errors?.description}
                multiline
                numberOfLines={4}
            />

            {screenMode != "View" && (
                <PrimaryButton
                    icon={screenMode === "Edit" ? <Save color="white" size={18} /> : <Plus color="white" size={18} />}
                    title={screenMode === "Edit" ? "Save Changes" : "Create Question "}
                    style={{ width: "100%", marginTop: 10 }}
                    onPress={saveQuestion}
                    disabled={buttonDisabled()}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        width: "100%",
    },
    descriptionField: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
        textAlignVertical: "top",
        height: 100,
    },
});