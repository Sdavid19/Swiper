import { CircleUser, Edit3 } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { getImage } from "../../../core/services";
import { uploadUserImage } from "../services/user.service";
import { AppDispatch, updateUserData } from "../../../redux";
import { useDispatch } from "react-redux";
import * as FileSystem from 'expo-file-system';
import api from "../../../core/api/client";

interface ImageSelectProps {
    shape?: ImagePicker.CropShape,
    aspect?: [number, number],
    userImageUrl?: string
}

export function ImageSelect({shape, aspect, userImageUrl}: ImageSelectProps){
    
    const [image, setImage] = useState<string | null>(null);
    const dispatch: AppDispatch = useDispatch();
    
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (!permissionResult.granted) {
          Alert.alert('Permission required', 'Permission to access the media library is required.');
          return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: aspect || [1,1],
          quality: 1,
          shape: shape || 'rectangle'
        });
    
        if (!result.canceled) {
            const asset = result.assets[0];
                
            try{
                const asset = result.assets[0];
            
               const response = await uploadUserImage(1, asset.uri, asset.mimeType, asset.fileName);
               dispatch(updateUserData({imageUrl: response.imageUrl}))
            }
            catch(error){
                  console.log('Image upload failed:', error instanceof Error ? error.message : error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    userImageUrl ?
                        (<Image source={{uri: getImage(userImageUrl)}} style={styles.image} />)
                            : 
                        (<CircleUser size={200} color="#999" />)
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