import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { getAllBanks } from "../services/bank.service";
import { useCallback, useEffect, useState } from "react";
import { BankDto } from "../../../shared/types/generated";
import { BankCard } from "../components/BankCard";
import { NavigateLink } from "../components/NavigateLink";
import { useFocusEffect } from "@react-navigation/native";

export function HomeScreen() {
  const [banks, setBanks] = useState<BankDto[]>([]);

    useFocusEffect(
    useCallback(() => {
      let isActive = true;
  
      getAllBanks()
        .then(res => {
          if (isActive) setBanks(res);
        })
        .catch(err => console.log("Bank fetch error:", err));
  
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <ScrollView  style={styles.container}>
      <View style={styles.sectionContainer}>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My banks</Text>
          <NavigateLink text="manage" />
        </View>

        {banks.length > 0 ? (
          <ScrollView horizontal>
            {banks.map(bank => (
              <BankCard key={bank.id} bank={bank} />
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
            {banks.map(bank => (
              <BankCard key={bank.id} bank={bank} />
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
    padding: 10
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionContainer:{
    marginVertical: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10
  },
  emptycontainer: {
    height: 200,
    width: "100%",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
});