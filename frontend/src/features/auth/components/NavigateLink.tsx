import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { AuthNavigation, AuthStackParamList } from "../../../navigation/types";

type NavigateLinkProps = {
  text: string;
  component: keyof AuthStackParamList;
};

export function NavigateLink({ text, component }: NavigateLinkProps) {
  const navigation = useNavigation<AuthNavigation>();

  return (
    <TouchableOpacity onPress={() => navigation.replace(component)}>
      <Text
        style={{
          textAlign: "center",
          marginTop: 30,
          textDecorationLine: "underline",
          color: "#333"
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
