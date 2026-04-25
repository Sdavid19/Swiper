import RNDateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet, View } from "react-native";


type DatePickerProps = {

    pickerDate: Date | null,
    setPickerDate: React.Dispatch<React.SetStateAction<Date | null>>
    onSelected?: () => void
    onClear?: () => void
}

export function DatePicker({ pickerDate, setPickerDate, onSelected, onClear }: DatePickerProps) {
    return (
        <View style={styles.pickerWrap}>
            <RNDateTimePicker
                value={pickerDate ?? new Date()}
                mode="date"
                display={'spinner'}
                themeVariant="light"
                neutralButton={{ label: 'Clear', textColor: 'grey' }}
                positiveButton={{ label: 'Apply', textColor: 'black' }}
                negativeButton={{ label: 'Cancel ', textColor: 'black' }}
                onChange={(event, selectedDate) => {
                    if (event.type === "dismissed") {
                        onSelected?.();
                        return;
                    }
                    if (event.type == "neutralButtonPressed") {
                        onClear?.();
                        return;
                    }

                    if (!selectedDate) return;

                    setPickerDate(selectedDate);
                    onSelected?.();
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    pickerWrap: {
        alignItems: "center",
        marginBottom: 16,
    },
});