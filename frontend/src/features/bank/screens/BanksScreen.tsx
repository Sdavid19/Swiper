import { StyleSheet, Text, View } from "react-native";
import { getAllBanks } from "../services/bank.service";
import { PrimaryButton } from "../../../shared/components";
import { useNavigation } from "@react-navigation/native";
import { EditBankNavigation, EditBankStackParamList } from "../../../navigation";
import { BankFilterList } from "../components/list/BankFilterList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { setBanks } from "../../../redux/bankSlice";
import { useEffect, useState } from "react";

type ShowBankProps = NativeStackScreenProps<EditBankStackParamList, "ShowBanks">;

export function BankScreen({route}: ShowBankProps) {
  const navigation = useNavigation<EditBankNavigation>()



  return (
    <View style={styles.container}>
  
      <BankFilterList />
      
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