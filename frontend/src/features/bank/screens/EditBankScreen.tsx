import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useState, useMemo, useLayoutEffect } from "react";
import { copyBank, deleteBank, getBankById } from "../services/bank.service";
import {
  BankListItemDto,
  CategoryDto,
} from "../../../shared/types/generated";
import { getCategories } from "../services/category.service";
import { ImageSelect } from "../components/editBankForm/ImageSelect";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { EditBankForm } from "../components/editBankForm/EditBankForm";
import { useNavigation } from "@react-navigation/native";
import { DeleteButton } from "../../../shared/components/Buttons/DeleteButton";
import { showSuccess } from "../../../shared/utils/toast.service";
import { addBankAction, removeBankAction } from "../../../redux/bankSlice";
import { EditBankStackParamList } from "../../../navigation";
import { CopyButton } from "@/src/shared/components/Buttons/CopyButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type EditBankProps = NativeStackScreenProps<EditBankStackParamList, "EditBank">;
export type EditBankScreenMode = "View" | "Edit" | "Create";

export function EditBankScreen({ route }: EditBankProps) {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const navigation =
    useNavigation<NativeStackNavigationProp<EditBankStackParamList>>();

  const [bank, setBank] = useState<BankListItemDto>();
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const screenMode: EditBankScreenMode = useMemo(() => {
    if (bank && bank.voteCount > 0) return "View";
    if (bank?.id) return "Edit";
    if (!route.params?.bankId) return "Create";
    if (!user) return "View";
    return "View";
  }, [route.params?.bankId, bank, user]);

  const handleDelete = async (bankId: number) => {
    await deleteBank(bankId);
    dispatch(removeBankAction(bankId));
    showSuccess("Bank deleted successfully!");
    navigation.popToTop();
  };

  const handleCopy = async (bankId: number) => {
    const bank = await copyBank(bankId);
    dispatch(addBankAction(bank));
    showSuccess("Bank copeid successfully!");
    navigation.popToTop();
  };

  useLayoutEffect(() => {
    if (!bank) return;

    navigation.setOptions({
      headerRight: () => (
        <>
          {screenMode != "View" ? (
            <DeleteButton onDelete={() => handleDelete(bank.id)} />
          ) : (
            <CopyButton onCopy={() => handleCopy(bank.id)} />
          )}
        </>
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
     <KeyboardAwareScrollView
          enableOnAndroid={true}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
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
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
     paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
