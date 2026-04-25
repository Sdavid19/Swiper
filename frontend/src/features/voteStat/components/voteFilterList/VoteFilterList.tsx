import { useEffect, useState, useCallback } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View, ListRenderItem } from "react-native";
import { CalendarSearch, Search, SlidersHorizontal } from "lucide-react-native";
import { VoteDto } from "@/src/shared/types/generated";
import { InputField } from "@/src/shared/components";
import { FilterBankModal } from "../../../bank/components/filerBankModal/FilterBankModal";
import { DateFilterModal } from "./DateFilterModal/DateFilterModal";
import { DatePicker } from "./DateFilterModal/DatePicker";
import { VoteCard } from "./VoteCard";
import { getVotesByUserParticipatedIn } from "../../../vote/services/vote.service";

export function VoteFilterList() {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [appliedDate, setAppliedDate] = useState<Date | null>(null);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const [votes, setVotes] = useState<VoteDto[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  const loadVotes = async (pageNumber: number, reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);

    try {
      const res = await getVotesByUserParticipatedIn({
        date: appliedDate?.toISOString(),
        text: filter,
        categoryIds: selected,
        page: pageNumber,
        limit,
      });

      if (reset) {
        setVotes(res.votes);
      } else {
        setVotes((prev) => [...prev, ...res.votes]);
      }

      setHasMore(res.hasMore);
      setPage(pageNumber);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadVotes(1, true);
  }, [selected, appliedDate, filter]);

  const onLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadVotes(page + 1);
    }
  }, [page, hasMore, loading]);

  const renderItem: ListRenderItem<VoteDto> = useCallback(
    ({ item }) => (
      <View style={styles.itemWrapper}>
        <VoteCard vote={item} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: VoteDto) => item.id.toString(), []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <Text>{votes.length}</Text>
        <InputField
          fieldStyle={{ width: "65%" }}
          disableErrorMessages
          Icon={Search}
          value={filter}
          onChangeText={setFilter}
        />

        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={{ padding: 10 }}
        >
          <SlidersHorizontal
            size={28}
            color={selected.length > 0 ? "#22c55e" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setDateModalVisible(true)}
          style={{ padding: 10 }}
        >
          <CalendarSearch
            size={28}
            color={appliedDate ? "#22c55e" : "black"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={votes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptycontainer}>
            <Text>There are no votes!</Text>
          </View>
        }
        ListFooterComponent={
          loading ? (
            <Text style={{ textAlign: "center" }}>Loading...</Text>
          ) : null
        }
      />

      <FilterBankModal
        selected={selected}
        setSelected={setSelected}
        visible={filterModalVisible}
        setVisible={setFilterModalVisible}
      />

      {Platform.OS === "ios" && (
        <DateFilterModal
          visible={dateModalVisible}
          setVisible={setDateModalVisible}
          pickerDate={tempDate ?? new Date()}
          setPickerDate={setTempDate}
          onApply={() => setAppliedDate(tempDate)}
          onClear={() => {
            setAppliedDate(null);
            setTempDate(null);
          }}
        />
      )}

      {Platform.OS === "android" && dateModalVisible && (
        <DatePicker
          pickerDate={appliedDate}
          setPickerDate={setAppliedDate}
          onSelected={() => setDateModalVisible(false)}
          onClear={() => {
            setAppliedDate(null);
            setTempDate(null);
            setDateModalVisible(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingBottom: 10,
  },
  itemWrapper: {
    width: "100%",
    alignItems: "center",
  },
  emptycontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});