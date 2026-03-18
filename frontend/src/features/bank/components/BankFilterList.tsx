import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BankDto, BankFilterDto } from "../../../shared/types/generated";
import { BankCardLarge } from "./BankCardLarge";;
import { InputField } from "../../../shared/components";
import { Search, SlidersHorizontal } from "lucide-react-native";

interface BankFilterListProps {
     banks: BankDto[],
     setBanks: React.Dispatch<React.SetStateAction<BankDto[]>>
}

export function BankFilterList({banks, setBanks}: BankFilterListProps){

    const [filter, setFilter] = useState<string>('');

    const filteredBanks = () => {
        return banks.filter(x => 
            x.title.toLocaleLowerCase().includes(filter) || 
            x.description.toLowerCase().includes(filter));
    }

    return (
        <View style={{flex: 1}}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingBottom: 10}}>
                <InputField 
                    fieldStyle={{width: '80%'}}
                    disableErrorMessages={true}
                    Icon={Search} 
                    value={filter}
                    onChangeText={(text) => setFilter(text.toLowerCase().trim())}

                />
                <TouchableOpacity style={{padding: 10, borderRadius: 6}}>
                    <SlidersHorizontal size={28}/>
                </TouchableOpacity>
            </View>
            
           {banks.length > 0 ? (
                <FlatList
                  data={filteredBanks()}
                  style={styles.list}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.itemWrapper}>
                      <BankCardLarge bank={item}  />
                    </View>
                  )}
              />
              ) : (
                <View style={styles.emptycontainer}>
                  <Text style={{fontSize: 16}}>There are no banks!</Text>
                </View>
              )}
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

