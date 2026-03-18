import { StyleSheet, Text, View } from "react-native";
import { getAllBanks } from "../services/bank.service";
import { PrimaryButton } from "../../../shared/components";
import { useNavigation } from "@react-navigation/native";
import { EditBankNavigation, EditBankStackParamList } from "../../../navigation";
import { BankFilterList } from "../components/BankFilterList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { setBanks } from "../../../redux/bankSlice";
import { useEffect } from "react";

type ShowBankProps = NativeStackScreenProps<EditBankStackParamList, "ShowBanks">;

export function BankScreen({route}: ShowBankProps) {
  const navigation = useNavigation<EditBankNavigation>()

  const banks = useSelector((state: RootState) => state.bank);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllBanks().then(res => dispatch(setBanks(res)));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My banks</Text>
      </View>

      <BankFilterList banks={banks} setBanks={setBanks} />
      
      <PrimaryButton 
        title="Add new" 
        style={styles.addButton} 
        onPress={() => navigation.navigate('EditBank', {bankId: undefined})} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5"
  },
  sectionHeader: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10
  },
  addButton: {
    width: "100%",
    marginTop: 10
  }
});