import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Badge } from "../../../../shared/components/Badge";
import { BankDto } from "../../../../shared/types/generated";
import { useNavigation } from "@react-navigation/native";
import { AppNavigation, EditBankNavigation } from "../../../../navigation";
import { getImage } from "../../../../api/services/image.service";
import { CardyButton } from "../../../../shared/components/CardButton";
import { Play } from "lucide-react-native";

type CardProps = {
  bank: BankDto;
};

export function BankCardLarge({ bank }: CardProps) {
  const navigation = useNavigation<EditBankNavigation>();
  const appNavigation = useNavigation<AppNavigation>();

  const navigateToCreateLobby = () => {
    appNavigation.navigate("CreateLobby", { bankId: bank.id });
  };

  const onButtonPress = (id: number) => {
    navigation.navigate("EditBank", { bankId: id });
  };

  return (
    <TouchableOpacity
      key={bank.id}
      style={styles.container}
      onPress={() => onButtonPress(bank.id)}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: getImage(bank.imageUrl)
          }}
          style={styles.image}
        />
      </View>
      <View style={{ position: "absolute", top: 20, right: 10 }}>
        <Badge color={bank.category.color} text={bank.category.name} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.leftContent}>
          <View>
            <View style={styles.infoCotainer}>
              <Text style={styles.bankTitle} numberOfLines={1}>
                {bank.title}
              </Text>
            </View>

            <View style={styles.descContainer}>
              <Text style={styles.desc} numberOfLines={2}>
                {bank.description}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
          <CardyButton Icon={Play} backgroundColor={"#22c55e"} onPressed={navigateToCreateLobby} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,

    backgroundColor: "white",
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    elevation: 5,
  },
  leftContent: {
    width: "80%",
  },
  imageWrapper: {
    width: "100%",
    height: 160,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    padding: 15,
    paddingTop: 15,
    paddingBottom: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: 'space-between',
  },
  infoCotainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  descContainer: {
    marginTop: 5,
  },
  desc: {
    fontSize: 13,
    color: "#666",
  },
  bankTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  buttonContainer: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
  },
});
