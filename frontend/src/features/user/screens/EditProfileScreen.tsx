
import { useState } from "react";
import { StyleSheet, TextInput, View, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux";
import { UpdateUserDto } from "../dto/update-user.dto";
import { updateUser } from "../services/user.service";
import { useNavigation } from "@react-navigation/native";
import { AppNavigation } from "../../../navigation/types";
import { updateUserData } from "../../../redux/authSlice";
import { showSuccess } from "../../../core/services";
import { InputField, PrimaryButton } from "../../../shared/components";
import { AxiosError } from "axios";
import { ErrorResponse, ValidationErrors } from "../../../types";

type UpdateProfileErrorResponse = ErrorResponse<ValidationErrors<UpdateUserDto>>;

export function EditProfileScreen(){

    const user = useSelector((state: RootState) => state.auth.user);

    const navigation = useNavigation<AppNavigation>();
    const dispatch: AppDispatch = useDispatch();

    const [name, setName] = useState<string | undefined>(user?.name || undefined);
    const [password, setPassword] = useState<string | undefined>('');
    const [passwordAgain, setPasswordAgain] = useState<string | undefined>('');

     const [errors, setErrors] = useState<ValidationErrors<UpdateUserDto> | null>(null);

      const isButtonDisabled = () => {
        return !name || password !== passwordAgain || (name === user?.name && !password && !passwordAgain);
      } 

    const handleUpdate = async () => { 

        const dto: UpdateUserDto = {};

        if(name){
            dto.name = name
        }

        if(password && password === passwordAgain){
            dto.password = password;
        };

        try {
          await updateUser(dto);
          if(name) dispatch(updateUserData({ name }));
          if(name || password){
            setErrors(null);
            showSuccess('Proifle updated successfully!')
            navigation.navigate('Tabs', {screen: 'Profile'});
          }
        } catch (err) {
           const error = err as AxiosError<UpdateProfileErrorResponse>; 
           setErrors(error.response?.data.error ?? null);
        }
    };
    

    return (
         <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              
              <View style={styles.formContainer}>
                <InputField
                  label="Name"
                  placeholder="Steve"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                  errorMessages={errors?.name}
                />
                <InputField
                label="Password"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  errorMessages={errors?.password}
                />
                <InputField
                  label="Password again"
                  placeholder="Password"
                  value={passwordAgain}
                  onChangeText={setPasswordAgain}
                  secureTextEntry
                />
        
                <PrimaryButton title="Save" onPress={handleUpdate} disabled={isButtonDisabled()} />
          
              </View>
            </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-start',
  }
});