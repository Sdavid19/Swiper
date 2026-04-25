import { useEffect, useState, useCallback, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListRenderItem,
} from "react-native";
import { BankCardLarge } from "./BankCardLarge";
import { InputField } from "../../../../shared/components";
import {
  Book,
  BookLock,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import { FilterBankModal } from "../filerBankModal/FilterBankModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux";
import { getAllBanksWithFilter } from "../../services/bank.service";
import { setBanks, appendBanks, setFilterAction } from "@/src/redux/bankSlice";
import { BankListItemDto } from "@/src/shared/types/generated";

export function BankFilterList() {
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [showLocked, setShowLocked] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false);

  const dispatch = useDispatch();
  const banks = useSelector((state: RootState) => state.bank.banks);

  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 400);

    return () => clearTimeout(t);
  }, [filter]);

  const loadBanks = async (pageNumber: number, reset = false) => {
    if (loadingRef.current) return;
    if (!hasMore && !reset) return;

    loadingRef.current = true;

    try {
      console.log("lekérem ám")
      const res = await getAllBanksWithFilter({
        categoryIds: selected,
        locked: showLocked,
        page: pageNumber,
        limit,
        text: debouncedFilter,
      });

      if (reset) {
        dispatch(setBanks(res.banks));
      } else {
        dispatch(appendBanks(res.banks));
      }

      setHasMore(res.hasMore);
      setPage(pageNumber);
    } catch (err) {
      console.log(err);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    dispatch(
      setFilterAction({
        locked: showLocked,
        categoryIds: selected,
      })
    );

    setPage(1);
    setHasMore(true);

    loadBanks(1, true);
  }, [selected, showLocked, debouncedFilter]);

  const onLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadBanks(page + 1);
  }, [page, hasMore]);

  const renderItem: ListRenderItem<BankListItemDto> = useCallback(
    ({ item }) => (
      <View style={styles.itemWrapper}>
        <BankCardLarge bank={item} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: BankListItemDto) => item.id.toString(),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
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
          onPress={() => setShowLocked(!showLocked)}
          style={{ padding: 10 }}
        >
          {showLocked ? (
            <BookLock size={28} color="red" />
          ) : (
            <Book size={28} />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={banks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptycontainer}>
            <Text>There are no banks with the given filters!</Text>
          </View>
        }
        ListFooterComponent={
          loadingRef.current ? (
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