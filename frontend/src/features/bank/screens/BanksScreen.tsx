import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../../shared/components";
import { useNavigation } from "@react-navigation/native";
import { EditBankNavigation, EditBankStackParamList } from "../../../navigation";
import { BankFilterList } from "../components/filterBankList/BankFilterList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux";
import { useEffect } from "react";
import { getAllBanksWithFilter } from "../services/bank.service";
import { setBanks } from "@/src/redux/bankSlice";

type ShowBankProps = NativeStackScreenProps<EditBankStackParamList, "ShowBanks">;

export function BankScreen({ route }: ShowBankProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation<EditBankNavigation>();

  const banks = useSelector((state: RootState) => state.bank);

  useEffect(() => {
    getAllBanksWithFilter()
      .then(res => dispatch(setBanks(res)))
      .catch(err => console.log(err));
  }, []);

  return (
    <View style={styles.container}>

      <BankFilterList banks={banks} />

      <PrimaryButton
        title="Add new"
        style={styles.addButton}
        onPress={() => navigation.navigate('EditBank', { bankId: undefined })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5"
  },
  addButton: {
    width: "100%",
    marginTop: 20,
    marginBottom: 5
  },
});