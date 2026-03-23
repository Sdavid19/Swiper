import { StyleProp, Text, View, ViewStyle } from "react-native";
import { PrimaryButton } from "./PrimaryButton";
import Checkbox, { CheckboxProps } from "expo-checkbox";

export interface CheckboxFieldProps extends CheckboxProps {
    title?: string,
    containerStyle?: StyleProp<ViewStyle>
}

export function CheckboxField({title, containerStyle, ...props}: CheckboxFieldProps){
    return (
        <View style={[{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}, containerStyle]}>
            <Checkbox  {...props}/>
            {title && (<Text style={{ marginLeft: 10 }}>{title}</Text>)}
        </View>
    );
}
