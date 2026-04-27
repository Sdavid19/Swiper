import { getImage } from "@/src/shared/utils/image.service";
import { UserDto } from "@/src/shared/types/generated";
import { Image, StyleSheet, Text, View } from "react-native";
import { UserTable } from "./UserTable";
import { use } from "react";

type UserStatProps = {
    users: UserDto[],
    selectedPieData: "yes" | "no" | undefined,
}

export function UserStat({ users, selectedPieData }: UserStatProps) {
    return (
        <View style={styles.shadowWrapper}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    Users voted {selectedPieData}
                </Text>

                <UserTable users={users} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    shadowWrapper: {
        shadowColor: "#3a3a3a",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        borderRadius: 8,
        marginBottom: 20,
    },

    card: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 10,
        alignItems: "center",
    },

    title: {
        marginVertical: 10,
        marginBottom: 20,
        fontWeight: "500",
        fontSize: 16,
        textAlign: "center"
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        width: "100%",
    },

    userBox: {
        width: "30%",
        alignItems: "center",
        marginBottom: 15,
    },

    userImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginBottom: 5,
        backgroundColor: "#ccc",
    },

    userName: {
        fontSize: 14,
        textAlign: "center",
    },
});