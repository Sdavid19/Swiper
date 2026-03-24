import { Image, StyleSheet, Text, View } from "react-native";
import { Badge } from "../../../../../shared/components/Badge";
import { BankDto } from "../../../../../shared/types/generated";
import { PrimaryButton } from "../../../../../shared/components";
import { useNavigation } from "@react-navigation/native";
import { EditBankNavigation } from "../../../../../navigation";
import { getImage } from "../../../../../api/services/image.service";

type CardProps = {
  bank: BankDto
}

export function BankCardLarge({bank}: CardProps){

  const navigation = useNavigation<EditBankNavigation>()

  const onButtonPress = (id: number) => {
      navigation.navigate('EditBank', {bankId: id});
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
                  <Text style={styles.bankTitle}>{bank.title}</Text>
                  <Badge text={bank.category.name} color={bank.category.color} />
              </View>

              <View style={styles.descContainer}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.desc}>{bank.description}</Text>
              </View>
            </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={() => onButtonPress(bank.id)} style={{width: 60}} title="View" />
          </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
  width: "95%",
  marginVertical: 10,

  backgroundColor: "white",
  borderRadius: 10,

  shadowColor: "#000",
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 2,

  elevation: 5,
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