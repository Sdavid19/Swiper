import { useEffect, useState } from "react";
import { BankDto, CategoryDto, CreateBankDto, UpdateBankDto } from "../../../../../shared/types/generated";
import { EditBankScreenMode } from "../../../screens/EditBankScreen";
import { StyleSheet, View } from "react-native";
import { InputField, PrimaryButton } from "../../../../../shared/components";
import { CheckboxField } from "../../../../../shared/components/CheckBoxField";
import { PickerSelect } from "../../../../../shared/components/PickerSelect";
import { createBank, updateBank } from "../../../services/bank.service";
import { showSuccess } from "../../../../../shared/utils/toast.service";
import { AxiosError } from "axios";
import { ErrorResponse, ValidationErrorMessage } from "../../../../../shared/types";
import { useDispatch } from "react-redux";
import { addBankAction, updateBankAction } from "../../../../../redux/bankSlice";
import { useNavigation } from "@react-navigation/native";
import { EditBankNavigation } from "../../../../../navigation";

export interface EditBankFormProps {
  screenMode: EditBankScreenMode,
  creatorId: number,
  bank?: BankDto,
  setBank: React.Dispatch<React.SetStateAction<BankDto | undefined>>,
  categories: CategoryDto[]
}

export function EditBankForm({ creatorId, screenMode, bank, setBank, categories }: EditBankFormProps) {

  const dispatch = useDispatch();

  const navigation = useNavigation<EditBankNavigation>()

  const [form, setForm] = useState<CreateBankDto>({
    title: "",
    description: "",
    categoryId: 0,
    public: false,
    creatorId: creatorId
  });

  const [errors, setErrors] = useState<ValidationErrorMessage<CreateBankDto> | null>(null);

  const buttonDisabled = () => {
    return !form.title || !form.categoryId;
  }

  const navigateToQuestionBank = () => {
    if (!bank) return;
    navigation.navigate("BankQuestions", { bankId: bank.id })
  }

  const categoryOptions = categories.map(c => ({
    label: c.name,
    value: c.id
  }));

  const setUpDataForUpdate = () => {
    if (bank) {
      setForm({
        title: bank.title,
        categoryId: bank.category.id,
        creatorId: creatorId,
        description: bank.description,
        public: bank.public,
      });
    }
  }

  const setField = <K extends keyof CreateBankDto>(key: K, value: CreateBankDto[K]) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const isEditable = screenMode !== "View";

  const saveBank = async () => {
    try {
      if (screenMode === "Edit" && bank) {
        const response = await updateBank(bank.id, form);
        setBank(response);
        dispatch(updateBankAction(response));
        showSuccess('Bank updated succesfully!');
      } else {
        const response = await createBank(form);
        setBank(response);
        dispatch(addBankAction(response));
        showSuccess('Bank created succesfully!');
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse<UpdateBankDto>>
      const message = error.response?.data.message

      if (typeof message === "object") {
        setErrors(message);
      }
    }
  }

  useEffect(() => {
    setUpDataForUpdate();
  }, [bank]);

  return (
    <View style={styles.formContainer}>

      <InputField
        label="Title"
        value={form.title}
        onChangeText={(text) => setField("title", text)}
        autoCapitalize="none"
        editable={isEditable}
        errorMessages={errors?.title}
      />

      <InputField
        label="Description"
        value={form.description}
        onChangeText={(text) => setField("description", text)}
        autoCapitalize="none"
        style={styles.descriptionField}
        multiline
        numberOfLines={4}
        editable={isEditable}
        errorMessages={errors?.description}
      />

      <PickerSelect
        title="Category"
        value={form.categoryId}
        onValueChange={(value) =>
          isEditable && setField("categoryId", value ? Number(value) : 0)
        }
        items={categoryOptions}
        placeholder={{ label: "Select category", value: null }}
        style={{
          inputIOSContainer: {
            zIndex: 100,
            padding: 20
          }
        }}
        disabled={!isEditable}
        errorMessages={errors?.categoryId}
      />

      <View style={styles.bottomRow}>

        <PrimaryButton
          title="View questions"
          style={{ width: "40%" }}
          disabled={!isEditable}
          onPress={navigateToQuestionBank}
        />

        <CheckboxField
          title="Public"
          containerStyle={{ width: "70%" }}
          value={form.public}
          onValueChange={
            isEditable
              ? (value) => setField("public", value)
              : undefined
          }
          disabled={!isEditable}
        />

      </View>

      {isEditable && (
        <PrimaryButton
          title={screenMode === "Edit" ? "Save Changes" : "Create Bank"}
          style={{ width: "100%", marginTop: 35 }}
          disabled={buttonDisabled()}
          onPress={saveBank}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30
  },

  formContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 50
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,

  },
  descriptionField: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    textAlignVertical: 'top',
    height: 80
  }
});