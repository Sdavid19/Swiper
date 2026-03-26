import { Image, StyleSheet, Text, View } from "react-native";
import { Badge } from "../../../../../shared/components/Badge";
import { BankDto } from "../../../../../shared/types/generated";
import { PrimaryButton } from "../../../../../shared/components";
import { getImage } from "../../../../../api/services/image.service";

type CardProps = {
  bank: BankDto,
}

export function BankCard({ bank }: CardProps) {

  const shortenString = (word: string, letterNumberToShow: number) => {
    if (word.length > letterNumberToShow) {
      return word.slice(0, letterNumberToShow) + "...";
    } else {
      return word;
    }
  }

  return (
    <View key={bank.id} style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: bank.imageUrl ? getImage(bank.imageUrl) : 'https://placecats.com/200/100' }}
          style={styles.image}
        />
      </View>

      <View style={styles.cardBody}>
        <View>
          <View style={styles.infoCotainer}>
            <Text style={styles.bankTitle}>{shortenString(bank.title, 12)}</Text>
            <Badge color={bank.category.color} text={bank.category.name} />
          </View>

          <View style={styles.descContainer}>
            <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">
              {shortenString(bank.description, 25)}
            </Text>
          </View>
        </View>


        <View style={styles.buttonContainer}>
          <PrimaryButton style={{ width: 60 }} title="Start" />
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

    elevation: 5
  },
  imageWrapper: {
    width: '100%',
    height: 175,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    overflow: "hidden"
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoCotainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  descContainer: {
    marginVertical: 5
  },
  desc: {
    fontSize: 12
  },
  bankTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end'
  }
});