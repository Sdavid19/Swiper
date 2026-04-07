import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { PlatformDto, QuestionBankTemplateDto } from "../../../../shared/types/generated";
import { getAllPlatforms } from "../../services/media.service";
import { SvgFromUri, SvgUri } from "react-native-svg";
import { SvgFromUrl } from "../../components/SvgFromUrl";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../../navigation";
import { getBankById } from "../../services/bank.service";
import { getTemplateById } from "../../services/template.service";


type CreateMediaBankScreenProps = NativeStackScreenProps<AppStackParamList, "CreateMediaBank">;

export function CreateMediaBankScreen({route}: CreateMediaBankScreenProps) {
  const [platforms, setPlatforms] = useState<PlatformDto[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [template, setTemplate] = useState<QuestionBankTemplateDto>();

  const templateId = route.params.templateId;

  useEffect(() => {
    getAllPlatforms()
      .then((p) => setPlatforms(p))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getTemplateById(templateId)
    .then((p) => setTemplate(p))
    .catch((err) => console.log(err));
  }, [templateId])

  const numColumns = 3;

  const toggleItem = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

 const renderItem = ({ item }: { item: PlatformDto }) => {
  console.log("Rendering SVG:", item.name, item.imageUrl);
  return (
    <TouchableOpacity
      style={[styles.itemWrapper, selected.includes(item.name) && styles.itemSelected]}
      onPress={() => toggleItem(item.name)}
    >
      <SvgFromUrl uri={item.imageUrl} />
    </TouchableOpacity>
  );
};
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      { template && (
        <View style={{marginBottom: 20}}>
            <Text style={styles.title}>{template.title}</Text>
            <Text>{template.description}</Text>
        </View>
        ) 
      }

      <Text style={styles.title}>Platforms</Text>

      <FlatList
        data={platforms}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  itemWrapper: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    backgroundColor: "#e6e4e4",
    height: 60,
    width: '80%',
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  itemSelected: {
    backgroundColor: "#53daba",
  },
  itemLabel: {
    marginTop: 6,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  labelSelected: {
    color: "#fff", // kijelölt szöveg
    fontWeight: "600",
  },
});