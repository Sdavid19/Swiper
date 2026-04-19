import { useNavigation } from "@react-navigation/native";
import { Pressable, Text } from "react-native";
import { AppNavigation } from "../../../../navigation";

type NavigateLinkProps = {
  text: string;
};

export function NavigateLink(props: NavigateLinkProps) {
  const navigation = useNavigation<AppNavigation>();

  const navigate = () => {
    navigation.navigate("Tabs", {
      screen: "BankStack",
      params: {
        screen: "ShowBanks",
      },
    });
  };

  return (
    <Pressable onPress={navigate}>
      <Text
        style={{
          textAlign: "center",
          marginTop: 20,
          marginHorizontal: 10,
          textDecorationLine: "underline",
          color: "#666",
        }}
      >
        {props.text}
      </Text>
    </Pressable>
  );
}
