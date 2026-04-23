import { StyleSheet, Text, View } from "react-native";
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

interface LabeledPickerSelectProps extends PickerSelectProps {
    title?: string;
    errorMessages?: string[];
}

export function PickerSelect({ title, errorMessages, ...props }: LabeledPickerSelectProps) {
    return (
        <View style={{ marginBottom: 20, width: '55%' }}>
            {title && <Text style={styles.label}>{title}</Text>}

            <View style={styles.inputContainer}>
                <RNPickerSelect
                    {...props}
                    style={{
                        inputIOS: styles.textInput,
                        inputAndroid: styles.textInput,
                        placeholder: { color: '#999' },
                        inputIOSContainer: { zIndex: 100 }
                    }}
                    useNativeAndroidPickerStyle={false}
                />
            </View>

            {errorMessages?.length ? (
                <View style={styles.messageContainer}>
                    {errorMessages.map((err, idx) => (
                        <Text key={idx} style={styles.errorText}>
                            {err[0].toUpperCase() + err.slice(1)}
                        </Text>
                    ))}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 4,
        fontWeight: '500',
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    textInput: {
        fontSize: 16,
        paddingVertical: 4,
    },
    errorText: {
        color: 'red',
        paddingLeft: 4,
        fontSize: 12,
    },
    messageContainer: {
        minHeight: 20,
        marginTop: 4,
    },
});