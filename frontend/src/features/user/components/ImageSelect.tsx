import { CircleUser, Edit3 } from "lucide-react-native";
import { Alert, Image, StyleSheet, View, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { getImage } from "../../../shared/utils/image.service";
import { uploadUserImage } from "../services/user.service";
import { AppDispatch, RootState, updateUserData } from "../../../redux";
import { useDispatch, useSelector } from "react-redux";
import * as ImageManipulator from 'expo-image-manipulator';
import { useState } from "react";

interface ImageSelectProps {
    shape?: ImagePicker.CropShape,
    aspect?: [number, number],
    userImageUrl?: string | null
}

export function ImageSelect({ shape, aspect, userImageUrl }: ImageSelectProps) {

    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [image, setImage] = useState(userImageUrl);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: aspect || [1, 1],
            quality: 1,
            shape: shape || 'rectangle'
        });

        if (!result.canceled && user) {
            try {
                const asset = result.assets[0];

                const manipulated = await ImageManipulator.manipulateAsync(
                    asset.uri,
                    [{ resize: { width: 800 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );

                const response = await uploadUserImage(
                    user.id,
                    manipulated.uri,
                    'image/jpeg',
                    asset.fileName
                );

                setImage(response.imageUrl);
                dispatch(updateUserData({ imageUrl: response.imageUrl }))
            }
            catch (error) {
                console.log('Image upload failed:', error instanceof Error ? error.message : error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: getImage(image) }} style={styles.image} />
                ) : (
                    <CircleUser size={200} color="#999" />
                )}
                <View style={styles.editIcon}>
                    <Edit3 size={20} color="white" />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        marginVertical: 30,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 500,
    },
    editIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#007AFF',
        borderRadius: 20,
        padding: 10,
    },
});