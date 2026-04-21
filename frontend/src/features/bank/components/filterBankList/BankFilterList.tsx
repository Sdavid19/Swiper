import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BankCardLarge } from "./BankCardLarge";;
import { InputField } from "../../../../shared/components";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { FilterBankModal } from "../filerBankModal/FilterBankModal";
import { BankDto, VoteDto } from "@/src/shared/types/generated";

type BankFilterListProps = {
  banks: BankDto[]
}

export function BankFilterList({banks}: BankFilterListProps) {

  const [filter, setFilter] = useState<string>('');
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);

  const filteredBanks = banks.filter((bank) => {
  const matchesText =
    bank.title.toLowerCase().includes(filter) ||
    bank.description.toLowerCase().includes(filter);

  const matchesCategory =
    selected.length === 0 ||
    selected.includes(bank.category.id);

  return matchesText && matchesCategory;
});

  return (
    <View style={{ flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingBottom: 10 }}>
        <InputField
          fieldStyle={{ width: '80%' }}
          disableErrorMessages={true}
          Icon={Search}
          value={filter}
          onChangeText={(text) => setFilter(text.toLowerCase().trim())}
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ padding: 10, borderRadius: 6 }}>
          <SlidersHorizontal size={28} />
        </TouchableOpacity>
      </View>

      {filteredBanks.length > 0 ? (
        <FlatList
          data={filteredBanks}
          style={{paddingHorizontal: 5}}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <BankCardLarge bank={item}/>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptycontainer}>
          <Text style={{ fontSize: 16 }}>There are no banks!</Text>
        </View>
      )}
      <FilterBankModal
        selected={selected}
        setSelected={setSelected}
        visible={filterModalVisible}
        setVisible={setFilterModalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: "100%",
    alignItems: "center"
  },
  list: {
    flex: 1,
    marginBottom: 10
  },
  emptycontainer: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
}); 