import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CalendarSearch, Search, SlidersHorizontal, Timer } from "lucide-react-native";
import { BankDto, VoteDto } from "@/src/shared/types/generated";
import { InputField } from "@/src/shared/components";
import { BankCardLarge } from "../../../bank/components/filterBankList/BankCardLarge";
import { FilterBankModal } from "../../../bank/components/filerBankModal/FilterBankModal";
import { getVotesByUserParticipatedIn } from "../../../vote/services/vote.service";
import { getDefaultRange } from "@/src/shared/utils/date.service";
import { VoteCard } from "./VoteCard";
import { DateFilterModal } from "./DateFilterVoteModal/DateFilterVoteModal";

export function VoteFilterList() {

  const defaultRange = getDefaultRange();

  const [fromDate, setFromDate] = useState<Date | undefined>(defaultRange.from);
  const [toDate, setToDate] = useState<Date | undefined>(defaultRange.to);

  const [filter, setFilter] = useState<string>('');
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [dateModalVisible, setdateModalVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);

  const [votes, setVotes] = useState<VoteDto[]>([]);

  useEffect(() => {
    getVotesByUserParticipatedIn(
      fromDate?.toISOString(),
      toDate?.toISOString()
    )
      .then(res => setVotes(res))
      .catch(err => console.log(err));
  }, [fromDate, toDate]);

  const f = filter.toLowerCase();

  const filteredVotes = votes.filter((vote) => {
    const matchesText =
      vote.bank.title.toLowerCase().includes(f) ||
      vote.bank.description.toLowerCase().includes(f);

    const matchesCategory =
      selected.length === 0 ||
      selected.includes(vote.bank.category.id);

    return matchesText && matchesCategory;
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingBottom: 10 }}>
        <InputField
          fieldStyle={{ width: '65%' }}
          disableErrorMessages={true}
          Icon={Search}
          value={filter}
          onChangeText={(text) => setFilter(text.toLowerCase().trim())}
        />

        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ padding: 10, borderRadius: 6 }}>
          <SlidersHorizontal size={28} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setdateModalVisible(true)} style={{ padding: 10, borderRadius: 6 }}>
          <CalendarSearch size={28} />
        </TouchableOpacity>
      </View>

      {filteredVotes.length > 0 ? (
        <FlatList
          data={filteredVotes}
          style={{ paddingHorizontal: 5 }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <VoteCard vote={item} />
            </View>
          )}
        />
      ) : (
        <View style={styles.emptycontainer}>
          <Text style={{ fontSize: 16 }}>There are no votes!</Text>
        </View>
      )}

      <FilterBankModal
        selected={selected}
        setSelected={setSelected}
        visible={filterModalVisible}
        setVisible={setFilterModalVisible}
      />

      <DateFilterModal
        visible={dateModalVisible}
        setVisible={setdateModalVisible}
        onApply={(from, to) => {
          setFromDate(from);
          setToDate(to);
        }}
        onClear={() => {
          const d = getDefaultRange();
          setFromDate(d.from);
          setToDate(d.to);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: "100%",
    alignItems: "center"
  },
  emptycontainer: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
}); 