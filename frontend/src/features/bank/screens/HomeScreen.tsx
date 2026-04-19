import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getAllBanksWithFilter } from "../services/bank.service";
import { useEffect, useState } from "react";
import { QuestionBankTemplateDto } from "../../../shared/types/generated";
import { BankCard } from "../components/bank/list/BankCard";
import { NavigateLink } from "../components/bank/NavigateLink";
import { getAllTemplates } from "../services/template.service";
import { useDispatch, useSelector } from "react-redux";
import { setBanks } from "@/src/redux/bankSlice";
import { RootState } from "@/src/redux";

export function HomeScreen() {
  const [templates, setTemplates] = useState<QuestionBankTemplateDto[]>([]);
  const dispatch = useDispatch();

  const banks = useSelector((state: RootState) => state.bank);

  useEffect(() => {
    getAllBanksWithFilter()
      .then((res) => dispatch(setBanks(res)))
      .catch((err) => console.log(err));

    getAllTemplates()
      .then((res) => {
        setTemplates(res);
      })
      .catch((err) => console.log("Template fetch error:", err));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured banks</Text>
        </View>

        {templates.length > 0 ? (
          <ScrollView horizontal>
            {templates.map((template) => (
              <BankCard key={template.id} bank={template} isTemplate={true} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptycontainer}>
            <Text>There are no banks!</Text>
          </View>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My banks</Text>
          <NavigateLink text="see all" />
        </View>
        {banks.length > 0 ? (
          <ScrollView horizontal>
            {banks.map((bank) => (
              <BankCard key={bank.id} bank={bank} isTemplate={false} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptycontainer}>
            <Text>There are no banks!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sectionHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 10,
  },
  emptycontainer: {
    height: 200,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
