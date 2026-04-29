import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { VoteDto } from "@/src/shared/types/generated";
import { getImage } from "@/src/shared/utils/image.service";
import { shortenString } from "@/src/shared/utils/text.service";
import { Badge } from "@/src/shared/components/Badge";
import { VoteStatNavigation } from "@/src/navigation";
import { CardyButton } from "@/src/shared/components/Buttons/CardButton";
import { ChartColumnDecreasing, Eye } from "lucide-react-native";

type CardProps = {
  vote: VoteDto;
};

export function VoteCard({ vote }: CardProps) {
  const navigation = useNavigation<VoteStatNavigation>();

  const handleButtonPressed = () => {
    navigation.navigate("VoteStat", { voteId: vote.id });
  };

  const date = new Date(vote.startsAt);

  const formattedDate = date.toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View key={vote.id} style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: getImage(vote.bank.imageUrl)
          }}
          style={styles.image}
        />
      </View>
      <View style={{ position: "absolute", top: 20, right: 10 }}>
        <Badge color={vote.bank.category.color} text={vote.bank.category.name} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.leftContent}>
          <View style={styles.infoCotainer}>
            <Text style={styles.bankTitle}>
              {shortenString(vote.title, 20)}
            </Text>
          </View>
          <View style={styles.descContainer}>
            <Text style={styles.desc}>
              ended {formattedDate}
            </Text>
          </View>
        </View>
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
          <CardyButton Icon={Eye} backgroundColor={"#007AFF"} onPressed={handleButtonPressed} />
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
    paddingBottom: 20,
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
