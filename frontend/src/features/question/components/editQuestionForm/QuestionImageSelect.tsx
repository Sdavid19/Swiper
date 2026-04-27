import { Edit3, ImageIcon } from "lucide-react-native";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { showInfo } from "../../../../shared/utils/toast.service";
import { getImage } from "../../../../shared/utils/image.service";
import * as ImageManipulator from "expo-image-manipulator";
import { uploadQuestionImage } from "../../services/question.service";
import { useDispatch } from "react-redux";
import { updateQuestionImageAction } from "../../../../redux/questionSlice";

interface ImageSelectProps {
  shape?: ImagePicker.CropShape;
  aspect?: [number, number];
  imageUrl?: string | null;
  disabled?: boolean;
  questionId?: number;
}

export function QuestionImageSelect({
  shape,
  aspect,
  imageUrl,
  disabled = false,
  questionId,
}: ImageSelectProps) {
  const [image, setImage] = useState<string | null>(imageUrl ?? null);
  const dispatch = useDispatch();

  useEffect(() => {
    setImage(imageUrl ?? null);
  }, [imageUrl]);

  const pickImage = async () => {
    if (disabled) return;

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showInfo("Permission to access the media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: aspect || [4, 3],
      quality: 1,
      shape: shape || "rectangle",
    });

    if (!result.canceled && questionId) {
      try {
        const asset = result.assets[0];

        const manipulated = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
        );

        const response = await uploadQuestionImage(
          questionId,
          manipulated.uri,
          "image/jpeg",
          asset.fileName,
        );

        if (!response.imageUrl) return;
        setImage(response.imageUrl);
        dispatch(
          updateQuestionImageAction({
            id: questionId,
            imageUrl: response.imageUrl,
          }),
        );
      } catch (error) {
        console.log(
          "Image upload failed:",
          error instanceof Error ? error.message : error,
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} disabled={disabled}>
        {image ? (
          <Image
            source={{
              uri: getImage(image)
            }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <ImageIcon size={50} color="black" />
          </View>
        )}

        {!disabled && (
          <View style={styles.editIcon}>
            <Edit3 size={20} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  image: {
    aspectRatio: 3 / 4,
    borderRadius: 6,
  },
  placeholder: {
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 3 / 4,
  },
  editIcon: {
    position: "absolute",
    bottom: -12,
    right: -12,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
  },
});
