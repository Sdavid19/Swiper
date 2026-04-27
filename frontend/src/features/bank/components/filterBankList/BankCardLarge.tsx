import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Badge } from "../../../../shared/components/Badge";
import { BankListItemDto } from "../../../../shared/types/generated";
import { useNavigation } from "@react-navigation/native";
import { AppNavigation, EditBankNavigation } from "../../../../navigation";
import { getImage } from "../../../../shared/utils/image.service";
import { Eye, Pencil, Play } from "lucide-react-native";
import { formatDate } from "@/src/shared/utils/date.service";
import { PrimaryButton } from "@/src/shared/components";
import { shortenString } from "@/src/shared/utils/text.service";

type CardProps = {
  bank: BankListItemDto;
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
    <View
      key={bank.id}
      style={styles.container}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: getImage(bank.imageUrl)
          }}
          style={styles.image}
        />
      </View>

       <View style={{ position: "absolute", top: 10, right: 10 }}>
        <Badge color={bank.category.color} text={bank.category.name} />
      </View>


      <View style={styles.cardBody}>

        <Text style={styles.bankTitle} numberOfLines={1}>
          {bank.title}
        </Text>

        <View style={styles.descContainer}>
          <Text style={styles.desc}>
            created {formatDate(new Date(bank.updatedAt))}
          </Text>
        </View>

         <View style={styles.descContainer}>
          <Text style={styles.desc} numberOfLines={1}>
            {shortenString(bank.description, 50)}
          </Text>
        </View>

        <View style={{marginTop: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <PrimaryButton onPress={navigateToCreateLobby} title="Start vote" style={{width: '82.5%'}} icon={<Play size={16} color="#fff" />} />
          <PrimaryButton onPress={() => onButtonPress(bank.id)} icon={bank.voteCount > 0 ? <Eye size={18}/> : <Pencil size={18}/>} color="#e6e6e6" />
        </View>

      </View>
    </View>
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
    marginTop: 10,
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
