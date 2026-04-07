import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../../../shared/components";
import { useNavigation } from "@react-navigation/native";
import { EditBankNavigation, EditBankStackParamList } from "../../../../navigation";
import { BankFilterList } from "../../components/bank/list/BankFilterList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ShowBankProps = NativeStackScreenProps<EditBankStackParamList, "ShowBanks">;

export function BankScreen({ route }: ShowBankProps) {
  const navigation = useNavigation<EditBankNavigation>();

  return (
    <View style={styles.container}>

      <BankFilterList />

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
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5"
  },
  addButton: {
    width: "100%",
    marginTop: 15
  }
});