import { ChevronRight } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QuestionDto } from "../../../../shared/types/generated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EditBankStackParamList } from "../../../../navigation";

interface QuestionCardProps {
    question: QuestionDto
}

export function QuestionCard({question}: QuestionCardProps){

    const navigation = useNavigation<NativeStackNavigationProp<EditBankStackParamList>>();

    return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate("EditQuestion", {questionId: question.id})}>
        <View style={styles.cardContent}>
            <Image
                style={styles.cardImage}
                source={{ uri: "https://placecats.com/250/400" }}
            />
            <Text style={styles.cardText}>{question.text}</Text>
        </View>
      <ChevronRight style={{marginRight: 6}} size={20}/>
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
      cardContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 6,
    marginVertical: 6,
    
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardImage: {
    width: 62,
    height: 62,
    marginRight: 10,
    borderRadius: 6,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  cardText: {
    fontSize: 16,
    flexShrink: 1,
  },
});