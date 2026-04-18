import { Image, StyleSheet, Text, View } from "react-native";
import { Badge } from "../../../../../shared/components/Badge";
import { CategoryDto } from "../../../../../shared/types/generated";
import { PrimaryButton } from "../../../../../shared/components";
import { getImage } from "../../../../../api/services/image.service";
import { shortenString } from "../../../../../shared/utils/text.service";
import { useNavigation } from "@react-navigation/native";
import { AppNavigation } from "../../../../../navigation";

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
              ? bank.imageUrl.startsWith("http")
                ? bank.imageUrl
                : getImage(bank.imageUrl)
              : "https://placecats.com/200/100",
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.cardBody}>
        <View>
          <View style={styles.infoCotainer}>
            <Text style={styles.bankTitle}>
              {shortenString(bank.title, 12)}
            </Text>
            <Badge color={bank.category.color} text={bank.category.name} />
          </View>

          <View style={styles.descContainer}>
            <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">
              {shortenString(bank.description, 25)}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            style={{ width: 60 }}
            onPress={navigateToCreateLobby}
            title="Start"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 270,
    marginVertical: 10,
    marginHorizontal: 10,

    backgroundColor: "white",
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,

    elevation: 5,
  },
  imageWrapper: {
    width: "100%",
    height: 175,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardBody: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
  },
  bankTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
  },
});
