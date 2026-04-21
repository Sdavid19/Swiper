import { useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Text,
} from "react-native";
import { X } from "lucide-react-native";
import { PrimaryButton } from "@/src/shared/components";
import { getDefaultRange } from "@/src/shared/utils/date.service";
import { DatePicker } from "./DatePicker";
import { RangeBoxes } from "./RangeBoxes";


interface Props {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onApply?: (from: Date, to: Date) => void;
    onClear?: () => void;
}

export function DateFilterModal({
    visible,
    setVisible,
    onApply,
    onClear
}: Props) {

    const defaultRange = getDefaultRange();

    const [fromDate, setFromDate] = useState<Date>(defaultRange.from);
    const [toDate, setToDate] = useState<Date>(defaultRange.to);
    const slideAnim = useRef(new Animated.Value(300)).current;
    const [active, setActive] = useState<"from" | "to">("from");
    const [pickerDate, setPickerDate] = useState(new Date());

    useEffect(() => {
        setPickerDate(active === "from" ? fromDate : toDate);
    }, [active]);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(300);
        }
    }, [visible]);

    const apply = () => {
        onApply?.(fromDate, toDate);
        setVisible(false);
    };

    const clear = () => {
        const { from, to } = getDefaultRange();

        setFromDate(from);
        setToDate(to);
        setActive("from");

        setPickerDate(from);

        onClear?.();
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                />

                <Animated.View
                    style={[
                        styles.sheet,
                        { transform: [{ translateY: slideAnim }] },
                    ]}
                >

                    <View style={styles.header}>
                        <Text style={styles.title}>Select date </Text>

                        <TouchableOpacity onPress={() => setVisible(false)}>
                            <X size={22} />
                        </TouchableOpacity>
                    </View>

                    <RangeBoxes active={active} fromDate={fromDate} toDate={toDate} setActive={setActive} />

                    <DatePicker
                        active={active}
                        pickerDate={pickerDate}
                        fromDate={fromDate}
                        toDate={toDate}
                        setFromDate={setFromDate}
                        setPickerDate={setPickerDate}
                        setToDate={setToDate} /
                    >

                    <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
                        <PrimaryButton title="Clear filter" onPress={clear} style={{ width: '45%' }}></PrimaryButton>
                        <PrimaryButton title="Apply filter" onPress={apply} style={{ width: '45%' }}></PrimaryButton>
                    </View>

                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "flex-end",
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    sheet: {
        backgroundColor: "white",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
    },

    rangeBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    rangeItem: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#f5f5f5",
        marginHorizontal: 10
    },

    pickerWrap: {
        alignItems: "center",
        marginBottom: 16,
    },

    button: {
        backgroundColor: "black",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    buttonText: {
        color: "white",
        fontWeight: "600",
    },
});