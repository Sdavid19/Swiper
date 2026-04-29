import { useEffect, useState, useCallback, useRef } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View, ListRenderItem } from "react-native";
import { CalendarSearch, Search, SlidersHorizontal } from "lucide-react-native";
import { VoteDto } from "@/src/shared/types/generated";
import { DateFilterModal } from "./DateFilterModal/DateFilterModal";
import { DatePicker } from "./DateFilterModal/DatePicker";
import { VoteCard } from "./VoteCard";
import { getVotesByUserParticipatedIn } from "../../../vote/services/vote.service";
import { SearchInputField } from "@/src/shared/components/Form/SearchInputField";
import { CategoryFilterModal } from "@/src/shared/components/FilterCategoryModal/CategoryFilterModal";

export function VoteFilterList() {
  const requestId = useRef(0);

  const [textFilter, setTextFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [appliedDate, setAppliedDate] = useState<Date | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);


  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const [votes, setVotes] = useState<VoteDto[]>([]);

  const limit = 10;

  const loadVotes = async (pageNumber: number, reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    const currentRequest = ++requestId.current;

    try {
      const res = await getVotesByUserParticipatedIn({
        date: appliedDate?.toISOString(),
        text: debouncedFilter,
        categoryIds: selected,
        page: pageNumber,
        limit,
      });

      if (currentRequest !== requestId.current) return;

      if (reset) setVotes(res.votes);
      else setVotes((prev) => [...prev, ...res.votes]);

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
  }, [selected, appliedDate, debouncedFilter]);

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
    ), []
  );

  const keyExtractor = useCallback((item: VoteDto) => item.id.toString(), []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <SearchInputField
          textFilter={textFilter}
          setTextFilter={setTextFilter}
          setDebounceTextFilter={setDebouncedFilter}
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
        contentContainerStyle={votes.length === 0 && styles.emptyContent}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <Text>There are no votes with the given filters!</Text>
          </View>
        }
      />

      <CategoryFilterModal
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
  emptyContent: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
  },
});