import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PrimaryButton } from "../../../shared/components";
import { useEffect, useState } from "react";
import { getSocket } from "../../../socket/socket";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppNavigation, AppStackParamList, EditBankStackParamList } from "../../../navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { useNavigation } from "@react-navigation/native";
import { getBankWithQuestionsById } from "../../bank/services/bank.service";
import { BankDetailDto, BankDto } from "../../../shared/types/generated";
import { QuestionList } from "../../question/components/questionList/QuestionList";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CreateLobbyScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "CreateLobby"
>;

export function CreateLobbyScreen({ route }: CreateLobbyScreenProps) {
  const [bank, setBank] = useState<BankDetailDto>();
  const insets = useSafeAreaInsets();

  const bankId = route.params.bankId;
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<AppNavigation>();
  const navigation2 = useNavigation<NativeStackNavigationProp<EditBankStackParamList>>();

  const handleCreateLobby = () => {

    if (!user || !bankId) return;
    getSocket()?.emit("createRoom", {
      bankId: bankId,
    });
  };

  useEffect(() => {
    getBankWithQuestionsById(bankId)
      .then((response) => setBank(response))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {

    getSocket()?.on("roomCreated", ({ roomId, bankId }) => {
      console.log("Room létrehozva:", roomId, bankId);

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Tabs",
            state: {
              routes: [
                {
                  name: "VoteStack",
                  state: {
                    routes: [
                      {
                        name: "Lobby",
                        params: { roomId, bankId },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      });
    });

    return () => {
      getSocket()?.off("roomCreated");
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {bank && (
        <View style={styles.header}>
          <Text style={styles.title}>{bank.title}</Text>
          {bank.description && (
            <Text style={styles.description}>{bank.description}</Text>
          )}
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Questions</Text>
        <QuestionList details={false} questions={bank?.questions || []} viewMode={true} />
      </View>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + 10 || 16 }]}
      >
        <PrimaryButton
          title="Start vote"
          style={styles.button}
          disabled={bank?.questions.length === 0}
          onPress={handleCreateLobby}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  header: {
    marginTop: 10,
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 14,
  },

  footer: {
    paddingTop: 20,
  },

  button: {
    width: "100%",
  },
});
