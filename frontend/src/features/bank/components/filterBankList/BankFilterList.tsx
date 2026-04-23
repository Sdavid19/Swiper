import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BankCardLarge } from "./BankCardLarge";;
import { InputField } from "../../../../shared/components";
import { Lock, LockOpen, Search, SlidersHorizontal } from "lucide-react-native";
import { FilterBankModal } from "../filerBankModal/FilterBankModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux";
import { getAllBanksWithFilter } from "../../services/bank.service";
import { setBanks, setFilterAction } from "@/src/redux/bankSlice";

export function BankFilterList() {

  const [filter, setFilter] = useState<string>('');
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [showLocked, setShowLocked] = useState(false);

  const dispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);

  useEffect(() => {
    dispatch(setFilterAction({ locked: showLocked, categoryIds: selected }))

    getAllBanksWithFilter({ categoryIds: [...selected], locked: showLocked })
      .then(res => dispatch(setBanks(res)))
      .catch(err => console.log(err));
  }, [selected, showLocked]);

  const filteredBanks = banks.filter((bank) => {
    return (
      bank.title.toLowerCase().includes(filter) ||
      bank.description.toLowerCase().includes(filter)
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingBottom: 10 }}>
        <InputField
          fieldStyle={{ width: '65%' }}
          disableErrorMessages={true}
          Icon={Search}
          value={filter}
          onChangeText={setFilter}
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ padding: 10, borderRadius: 6 }}>
          <SlidersHorizontal size={28} color={selected.length > 0 ? "#22c55e" : "black"}  />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowLocked(!showLocked)} style={{ padding: 10, borderRadius: 6 }}>
          {showLocked ? <Lock size={28} color="red" /> : <LockOpen size={28} />}
        </TouchableOpacity>
      </View>

      {filteredBanks.length > 0 ? (
        <FlatList
          data={filteredBanks}
          style={{ paddingHorizontal: 5 }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <BankCardLarge bank={item} />
            </View>
          )}
        />
      ) : (
        <View style={styles.emptycontainer}>
          <Text style={{ fontSize: 16 }}>There are no banks with the given filters!</Text>
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