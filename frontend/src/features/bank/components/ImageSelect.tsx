import { Edit3, ImageIcon } from "lucide-react-native";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getImage } from "../../../api/services/image.service";
import { showInfo } from "../../../shared/utils/toast.service";
import { useState, useEffect } from "react";
import { uploadBankImage } from "../services/bank.service";

interface ImageSelectProps {
  shape?: ImagePicker.CropShape;
  aspect?: [number, number];
  imageUrl?: string | null;
  disabled?: boolean;
  bankId?: number;
}

export function ImageSelect({
  shape,
  aspect,
  imageUrl,
  disabled = false,
  bankId,
}: ImageSelectProps) {
  const [image, setImage] = useState<string | null>(imageUrl ?? null);

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

    if (!result.canceled) {
      try {
        const asset = result.assets[0];

        const response = await uploadBankImage(
          bankId || 2,
          asset.uri,
          asset.mimeType,
          asset.fileName
        );

        if (!response.imageUrl) return;

        setImage(response.imageUrl);
      } catch (error) {
        console.log(
          "Image upload failed:",
          error instanceof Error ? error.message : error
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} disabled={disabled}>
        {image ? (
          <Image source={{ uri: getImage(image) }} style={styles.image} />
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
    marginVertical: 30,
  },
  image: {
    height: 200,
    borderRadius: 6,
  },
  placeholder: {
    height: 200,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
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