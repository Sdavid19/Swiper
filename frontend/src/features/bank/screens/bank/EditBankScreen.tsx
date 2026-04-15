import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useMemo, useLayoutEffect } from "react";
import { deleteBank, getBankById } from "../../services/bank.service";
import { BankDto, BankListItemDto, CategoryDto } from "../../../../shared/types/generated";
import { getCategories } from "../../services/category.service";
import { ImageSelect } from "../../components/bank/edit/ImageSelect";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux";
import { EditBankForm } from "../../components/bank/edit/EditBankForm";
import { useNavigation } from "@react-navigation/native";
import { DeleteButton } from "../../../../shared/components/DeleteButton";
import { showSuccess } from "../../../../shared/utils/toast.service";
import { removeBankAction } from "../../../../redux/bankSlice";
import { EditBankStackParamList } from "../../../../navigation";

type EditBankProps = NativeStackScreenProps<EditBankStackParamList, "EditBank">;
export type EditBankScreenMode = "View" | "Edit" | "Create";

export function EditBankScreen({ route }: EditBankProps) {
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<NativeStackNavigationProp<EditBankStackParamList>>();

  const [bank, setBank] = useState<BankListItemDto>();
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const screenMode: EditBankScreenMode = useMemo(() => {
    if (!bank) return "Create";

    if (bank.voteCount > 0) return "View";

    if (!route.params?.bankId) return "Create";
    if (!user) return "View";

    if (bank.creator.id === user.id) return "Edit";

    return "View";
  }, [route.params?.bankId, bank, user]);

  useLayoutEffect(() => {
    if (!bank || screenMode == "View") return;
    navigation.setOptions({
      headerRight: () => (
        <DeleteButton
          onDelete={async () => {
            await deleteBank(bank.id);
            showSuccess("Bank deleted successfully!");
            dispatch(removeBankAction(bank.id));
            navigation.popToTop();
          }}
        />
      ),
    });
  }, [bank, navigation]);



  const isEditable = screenMode !== "View";
  const isCreateMode = screenMode === "Create";

  const loadData = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);

      if (route.params?.bankId) {
        const bankData = await getBankById(route.params.bankId);
        setBank(bankData);
      }
    } catch (error) {
      console.log("Data load error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <ImageSelect
            bankId={bank?.id}
            imageUrl={bank?.imageUrl}
            shape="rectangle"
            aspect={[4, 3]}
            disabled={!isEditable || isCreateMode}
          />
        </View>
        <View style={styles.formContainer}>
          <EditBankForm
            creatorId={user!.id}
            categories={categories}
            bank={bank}
            setBank={setBank}
            screenMode={screenMode}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  imageContainer: {
    marginBottom: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
});