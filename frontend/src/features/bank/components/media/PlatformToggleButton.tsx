import { StyleSheet, TouchableOpacity } from "react-native";
import { SvgFromUrl } from "../../../../shared/components/SvgFromUrl";
import { PlatformDto } from "../../../../shared/types/generated";

type PlatformToggleButtonProps = {
    item: PlatformDto,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
}

export function PlatformToggleButton({ item, selected, setSelected }: PlatformToggleButtonProps){

      const toggleItem = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };


    return (
    <TouchableOpacity
        style={[
        styles.itemWrapper,
        selected.includes(item.name) && styles.itemSelected,
        ]}
        onPress={() => toggleItem(item.name)}
    >
        <SvgFromUrl uri={item.imageUrl} />
    </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    marginHorizontal: 6,
    height: 90,
    backgroundColor: "#e6e4e4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  itemSelected: {
    backgroundColor: "#53daba",
  },
})
