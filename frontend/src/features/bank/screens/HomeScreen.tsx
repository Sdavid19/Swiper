import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getTopBanks } from "../services/bank.service";
import { useCallback, useEffect, useState } from "react";
import { BankListItemDto, QuestionBankTemplateDto } from "../../../shared/types/generated";
import { BankCard } from "../components/filterBankList/BankCard";
import { getAllTemplates } from "../services/template.service";
import { useFocusEffect } from "@react-navigation/native";
import { NavigateLink } from "../components/NavigateLink";

export function HomeScreen() {
  const [templates, setTemplates] = useState<QuestionBankTemplateDto[]>([]);
  const [banks, setBanks] = useState<BankListItemDto[]>([]);

  useEffect(() => {
    getAllTemplates()
      .then(setTemplates)
      .catch(console.log);
  }, []);

  const loadBanks = async () => {
    try {
      const res = await getTopBanks();
      setBanks(res);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBanks();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bank creators</Text>
        </View>

        {templates.length > 0 ? (
          <ScrollView horizontal>
            {templates.map((template) => (
              <BankCard key={template.id} bank={template} isTemplate />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptycontainer}>
            <Text>There are no templates!</Text>
          </View>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My top banks</Text>
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
