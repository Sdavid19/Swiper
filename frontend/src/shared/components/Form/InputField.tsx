import { Search } from "lucide-react-native";
import { StyleProp, TextStyle, View, TextInput, TextInputProps, Text, StyleSheet, ViewStyle } from "react-native";

interface InputFieldProps extends TextInputProps {
    label?: string;
    errorMessages?: string[];
    fieldStyle?: StyleProp<ViewStyle>;
    disableErrorMessages?: boolean;
    Icon?: React.ComponentType<{ size?: number; color?: string; style?: any }>;
}

export function InputField({ label, errorMessages, fieldStyle, disableErrorMessages = false, Icon, editable = true, ...props }: InputFieldProps) {

    return (
        <View style={[fieldStyle]}>
            {label && (<Text style={styles.label}>{label}</Text>)}

            <View style={[styles.inputContainer, {backgroundColor: editable ? '#fff' : 'transparent'}]}>
                {Icon && <Icon size={20} color={"#666"} style={styles.icon} />}
                <TextInput
                    style={[styles.textInput]}
                    editable={editable}
                    {...props}
                />
            </View>

            {!disableErrorMessages && (
                <View style={styles.messageContainer}>
                    {Array.isArray(errorMessages) && errorMessages.map((err, idx) => (
                        <Text key={idx} style={styles.errorText}>
                            {err[0].toUpperCase() + err.slice(1)}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 4,
        marginLeft: 2,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 0,
    },
    icon: {
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
    },
    errorText: {
        color: 'red',
        paddingLeft: 6,
        fontSize: 12,
    },
    messageContainer: {
        minHeight: 20,
        marginTop: 4,
    },
});