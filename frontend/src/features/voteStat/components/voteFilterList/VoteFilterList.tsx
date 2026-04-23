import { useEffect, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CalendarSearch, Search, SlidersHorizontal, Timer } from "lucide-react-native";
import {  VoteDto } from "@/src/shared/types/generated";
import { InputField } from "@/src/shared/components";
import { FilterBankModal } from "../../../bank/components/filerBankModal/FilterBankModal";
import { getVotesByUserParticipatedIn } from "../../../vote/services/vote.service";
import { VoteCard } from "./VoteCard";
import { DateFilterModal } from "./DateFilterVoteModal/DateFilterVoteModal";
import { DatePicker } from "./DateFilterVoteModal/DatePicker";

export function VoteFilterList() {

  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [appliedDate, setAppliedDate] = useState<Date | null>(null);

  const [filter, setFilter] = useState<string>('');
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [dateModalVisible, setdateModalVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<number[]>([]);

  const [votes, setVotes] = useState<VoteDto[]>([]);

  useEffect(() => {
    getVotesByUserParticipatedIn(appliedDate?.toISOString())
      .then(res => setVotes(res))
      .catch(err => console.log(err));
  }, [appliedDate]);

  useEffect(() => {
    if (dateModalVisible) {
      setTempDate(appliedDate);
    }
  }, [dateModalVisible]);

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
          <SlidersHorizontal size={28} color={selected.length > 0 ? "#22c55e" : "black"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setdateModalVisible(true)} style={{ padding: 10, borderRadius: 6 }}>
          <CalendarSearch size={28}  color={appliedDate != null ? "#22c55e" : "black"} />
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

      {Platform.OS == "ios" &&
        <DateFilterModal
          visible={dateModalVisible}
          setVisible={setdateModalVisible}
          pickerDate={tempDate ?? new Date()}
          setPickerDate={setTempDate}
          onApply={() => {
            setAppliedDate(tempDate);
          }}
          onClear={() => {
            setAppliedDate(null);
            setTempDate(null);
          }}
        />
      }

      {(Platform.OS == "android" && dateModalVisible) &&
        <DatePicker
          pickerDate={appliedDate}
          setPickerDate={setAppliedDate}
          onSelected={() => setdateModalVisible(false)}
          onClear={() => {
            setAppliedDate(null);
            setTempDate(null);
            setdateModalVisible(false)
          }}
        />
      }

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