import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import {
  PlatformDto,
  QuestionBankTemplateDto,
} from "../../../shared/types/generated";
import { getAllPlatforms } from "../services/media.service";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppNavigation, AppStackParamList } from "../../../navigation";
import { getTemplateById } from "../services/template.service";
import { PrimaryButton } from "../../../shared/components";
import { PlatformToggleButton } from "../components/media/PlatformToggleButton";
import { createBankByMedia } from "../services/bank.service";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { addBankAction } from "@/src/redux/bankSlice";

type CreateMediaBankScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "CreateMediaBank"
>;

export function CreateMediaBankScreen({ route }: CreateMediaBankScreenProps) {
  const [platforms, setPlatforms] = useState<PlatformDto[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [template, setTemplate] = useState<QuestionBankTemplateDto>();

  const navigation = useNavigation<AppNavigation>();
  const templateId = route.params.templateId;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const handleStartPress = async () => {
    const bank = await createBankByMedia({
      bankTemplateId: templateId,
      platforms: selected,
    });

    if (!bank) return;
    dispatch(addBankAction(bank));
    navigation.navigate("CreateLobby", { bankId: bank.id });
  };

  useEffect(() => {
    getAllPlatforms().then(setPlatforms).catch(console.error);
  }, []);

  useEffect(() => {
    getTemplateById(templateId).then(setTemplate).catch(console.error);
  }, [templateId]);

  const numColumns = 3;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {template && (
        <View style={styles.header}>
          <Text style={styles.title}>{template.title}</Text>
          {template.description && (
            <Text style={styles.description}>{template.description}</Text>
          )}
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Platforms</Text>

        <FlatList
          data={platforms}
          renderItem={({ item }) => (
            <PlatformToggleButton
              item={item}
              selected={selected}
              setSelected={setSelected}
            />
          )}
          keyExtractor={(item) => item.name}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + 10 || 16 }]}
      >
        <PrimaryButton
          title="Create bank"
          style={styles.button}
          onPress={handleStartPress}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
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
    marginBottom: 16,
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
