import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Badge } from "../../../../shared/components/Badge";
import { CategoryDto } from "../../../../shared/types/generated";
import { PrimaryButton } from "../../../../shared/components";
import { getImage } from "../../../../api/services/image.service";
import { shortenString } from "../../../../shared/utils/text.service";
import { useNavigation } from "@react-navigation/native";
import { AppNavigation } from "../../../../navigation";
import { Play } from "lucide-react-native";
import { CardyButton } from "../../../../shared/components/CardButton";

type BankBase = {
  id: number;
  title: string;
  description: string;
  category: CategoryDto;
  imageUrl?: string | null;
};

type CardProps = {
  bank: BankBase;
  isTemplate: boolean;
};

export function BankCard({ bank, isTemplate }: CardProps) {
  const navigation = useNavigation<AppNavigation>();
  const navigateToCreateLobby = () => {
    if (isTemplate) {
      navigation.navigate("CreateMediaBank", { templateId: bank.id });
    } else {
      navigation.navigate("CreateLobby", { bankId: bank.id });
    }
  };

  return (
    <View key={bank.id} style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: bank.imageUrl
              ? getImage(bank.imageUrl)
              : "https://placecats.com/200/100",
          }}
          style={styles.image}
        />
      </View>
      <View style={{ position: "absolute", top: 20, right: 10 }}>
        <Badge color={bank.category.color} text={bank.category.name} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.leftContent}>
          <View style={styles.infoCotainer}>
            <Text style={styles.bankTitle}>
              {shortenString(bank.title, 20)}
            </Text>
          </View>

          <View style={styles.descContainer}>
            <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">
              {bank.description}
            </Text>
          </View>
      </View>

      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5}}>
        <CardyButton Icon={Play} backgroundColor={"#22c55e"} onPressed={navigateToCreateLobby} />
      </View>

    </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    marginVertical: 10,
    marginHorizontal: 10,

    backgroundColor: "white",
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    elevation: 5,
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
    borderBottomWidth: 1,
    borderColor: "#d4d4d4",
  },
  cardBody: {
    padding: 10,
    paddingVertical: 15,
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
    marginVertical: 5,
  },
  desc: {
    fontSize: 12,
    color: "#666",
  },
  bankTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
  },
  leftContent: {
    width: "72%",
  },
});
