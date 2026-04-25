import { useEffect, useState, useCallback, useRef } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ListRenderItem, } from "react-native";
import { BankCardLarge } from "./BankCardLarge";
import { Book, BookLock, SlidersHorizontal } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux";
import { getAllBanksWithFilter } from "../../services/bank.service";
import { setBanks, appendBanks, setFilterAction } from "@/src/redux/bankSlice";
import { BankListItemDto } from "@/src/shared/types/generated";
import { SearchInputField } from "@/src/shared/components/SearchInputField";
import { CategoryFilterModal } from "@/src/shared/components/FilterCategoryModal/CategoryFilterModal";
import { StateFilterButton } from "../StateFilterButton";

export function BankFilterList() {
    const dispatch = useDispatch();

  const [textFilter, setTextFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");

  const [categoryFilterModalVisible, setCategoryFilterModalVisible] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [stateFilter, setStateFilter] = useState<"OPEN" | "LOCKED" | "ALL">();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false);
  const requestId = useRef(0);

  const banks = useSelector((state: RootState) => state.bank.banks);

  const limit = 10;

  const loadBanks = async (pageNumber: number, reset = false) => {
    if (loadingRef.current) return;
    if (!hasMore && !reset) return;

    loadingRef.current = true;
    const currentRequest = ++requestId.current;

    try {
      const res = await getAllBanksWithFilter({
        categoryIds: selectedCategoryIds,
        state: stateFilter,
        page: pageNumber,
        limit,
        text: debouncedFilter,
      });

      if (currentRequest !== requestId.current) return;

      if (reset) dispatch(setBanks(res.banks));
      else dispatch(appendBanks(res.banks));

      setHasMore(res.hasMore);
      setPage(pageNumber);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    dispatch(setFilterAction({ state: stateFilter, categoryIds: selectedCategoryIds }));
    setPage(1);
    setHasMore(true);
    loadBanks(1, true);
  }, [selectedCategoryIds, stateFilter, debouncedFilter]);

  const onLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadBanks(page + 1);
  }, [page, hasMore]);

  const renderItem: ListRenderItem<BankListItemDto> = useCallback(
    ({ item }) => (
      <View style={styles.itemWrapper}>
        <BankCardLarge bank={item} />
      </View>
    ), []
  );

  const keyExtractor = useCallback((item: BankListItemDto) => item.id.toString(),[]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>

        <SearchInputField
          textFilter={textFilter}
          setTextFilter={setTextFilter}
          setDebounceTextFilter={setDebouncedFilter}
        />

        <TouchableOpacity
          onPress={() => setCategoryFilterModalVisible(true)}
          style={{ padding: 10 }}
        >
          <SlidersHorizontal
            size={28}
            color={selectedCategoryIds.length > 0 ? "#22c55e" : "black"}
          />
        </TouchableOpacity>

        <StateFilterButton state={stateFilter} setState={setStateFilter} />

      </View>

      <FlatList
        data={banks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[banks.length === 0 && styles.emptyContent, { padding: 5 }]}
        removeClippedSubviews
        initialNumToRender={limit}
        maxToRenderPerBatch={limit}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <Text>There are no banks with the given filters!</Text>
          </View>
        }
      />

      <CategoryFilterModal
        selected={selectedCategoryIds}
        setSelected={setSelectedCategoryIds}
        visible={categoryFilterModalVisible}
        setVisible={setCategoryFilterModalVisible}
      />
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