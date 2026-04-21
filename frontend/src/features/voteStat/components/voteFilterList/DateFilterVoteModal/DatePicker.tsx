import RNDateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet, View } from "react-native";


type DatePickerProps = {
    active: "from" | "to",
    
    pickerDate: Date,
    setPickerDate: React.Dispatch<React.SetStateAction<Date>>

    fromDate: Date,
    setFromDate: React.Dispatch<React.SetStateAction<Date>>

    toDate: Date,
    setToDate: React.Dispatch<React.SetStateAction<Date>>
}

export function DatePicker({ pickerDate, active, fromDate, toDate, setFromDate, setToDate, setPickerDate }: DatePickerProps) {
    return (
        <View style={styles.pickerWrap}>
            <RNDateTimePicker
                value={pickerDate}
                mode="date"
                display="spinner"
                themeVariant="light"
                minimumDate={active == "to" ? fromDate : undefined}
                maximumDate={active == "from" ? toDate : undefined}
                onChange={(event, selectedDate) => {
                    if (event.type === "dismissed") return;
                    if (!selectedDate) return;

                    const safe = new Date(selectedDate);

                    if (active === "from") {
                        setFromDate(safe);
                        if (safe > toDate) {
                            setToDate(safe);
                        }
                    } else {
                        if (safe < fromDate) {
                            setToDate(fromDate);
                        } else {
                            setToDate(safe);
                        }
                    }
                    setPickerDate(safe);
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