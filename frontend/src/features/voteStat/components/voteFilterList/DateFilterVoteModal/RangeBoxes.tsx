import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RangeBoxesProp = {
    active: "from" | "to",
    fromDate: Date,
    toDate: Date,
    setActive: React.Dispatch<React.SetStateAction<"from" | "to">>

}

export function RangeBoxes({active, fromDate, toDate, setActive} : RangeBoxesProp) {
    return (
        <View style={styles.rangeBox}>

            <TouchableOpacity
                style={[
                    styles.rangeItem,
                    active === "from" && styles.active
                ]}
                onPress={() => setActive("from")}
            >
                <Text style={[active === "from" ? styles.activeLabel : styles.label]}>From</Text>
                <Text style={[active === "from" && styles.activeText]}>{fromDate.toDateString()}</Text>
            </TouchableOpacity>


            <TouchableOpacity
                style={[
                    styles.rangeItem,
                    active === "to" && styles.active
                ]}
                onPress={() => setActive("to")}
            >
                <Text style={[active === "to" ? styles.activeLabel : styles.label]}>To</Text>
                <Text style={[active === "to" && styles.activeText]}>{toDate.toDateString()}</Text>
            </TouchableOpacity>

        </View>
    );
}


const styles = StyleSheet.create({

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

    active: {
        backgroundColor: "#e4e4e4",
    },
    activeText: {
        color: "#black",
    },

    label: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    activeLabel: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    }
});