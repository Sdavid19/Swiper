import { getImage } from "@/src/shared/utils/image.service";
import { UserDto } from "@/src/shared/types/generated";
import { Image, StyleSheet, Text, View } from "react-native";

type UserTableProps = {
    users: UserDto[]
}

export function UserTable({ users }: UserTableProps) {
    return (
        <View style={styles.grid}>
            {users.map((user) => (
                <View key={user.id} style={styles.userBox}>
                    <Image
                        source={{
                            uri: getImage(user.imageUrl)
                        }}
                        style={styles.userImage}
                    />
                    <Text style={styles.userName}>
                        {user.name}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({

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