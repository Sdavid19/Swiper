import { StyleProp, TextStyle, View, TextInput, TextInputProps, Text, StyleSheet, ViewStyle } from "react-native";
import { Validator } from "../../types/validator";

interface InputFieldProps extends TextInputProps {
    label?: string
    errorMessages?: string[],
    fieldStyle?: StyleProp<ViewStyle>,
    validators?: Validator[];
}

export function InputField({label, errorMessages, fieldStyle, validators, ...props}: InputFieldProps){


    return (
    <View style={fieldStyle}>
        {label && (<Text>{label}</Text>)}

        <TextInput style={styles.input} {...props}/>

        <View style={styles.messageContainer}>
            {Array.isArray(errorMessages) && errorMessages.map((err, idx) => (
                <Text key={idx} style={styles.errorText}>
                    {err[0].toUpperCase() + err.slice(1)}
                </Text>
            ))}
        </View>

    </View>);
}

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        paddingLeft: 6
    },
    messageContainer: {
        minHeight: 25
    },
    input:{
        borderWidth: 1,
        padding: 12,
        borderRadius: 6,
    }
})