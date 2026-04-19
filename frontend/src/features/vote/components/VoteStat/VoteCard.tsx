import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { VoteDto } from "@/src/shared/types/generated";
import { getImage } from "@/src/api/services/image.service";
import { shortenString } from "@/src/shared/utils/text.service";
import { Badge } from "@/src/shared/components/Badge";
import { PrimaryButton } from "@/src/shared/components";
import { VoteStatNavigation } from "@/src/navigation";
import { useMemo } from "react";
import { StatButton } from "./StatButton";

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
            uri: vote.bank.imageUrl
              ? getImage(vote.bank.imageUrl)
              : "https://placecats.com/200/100",
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.cardBody}>
        <View>
          <View style={styles.infoCotainer}>
            <Text style={styles.bankTitle}>
              {shortenString(vote.bank.title, 20)}
            </Text>
            <Badge
              text={vote.bank.category.name}
              color={vote.bank.category.color}
            />
          </View>
          <View style={styles.descContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.desc}>
              {formattedDate}
            </Text>
          </View>
        </View>
        <StatButton onPressed={handleButtonPressed} />
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
