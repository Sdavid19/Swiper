
import { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux";
import { updateUser } from "../services/user.service";
import { useNavigation } from "@react-navigation/native";
import { updateUserData } from "../../../redux/authSlice";
import { showSuccess } from "../../../shared/utils/toast.service";
import { InputField, PrimaryButton } from "../../../shared/components";
import { AxiosError } from "axios";
import { ErrorResponse, ValidationErrorMessage } from "../../../shared/types";
import { ImageSelect } from "../components/ImageSelect";
import { UpdateUserDto } from "../../../shared/types/generated";
import { KeyRound, Save, User } from "lucide-react-native";

export function EditProfileScreen() {

  const user = useSelector((state: RootState) => state.auth.user);

  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();

  const [name, setName] = useState<string | undefined>(user?.name || undefined);
  const [password, setPassword] = useState<string | undefined>('');
  const [passwordAgain, setPasswordAgain] = useState<string | undefined>('');

  const [errors, setErrors] = useState<ValidationErrorMessage<UpdateUserDto> | null>(null);

  const isButtonDisabled = () => {
    return !name || password !== passwordAgain || (name === user?.name && !password && !passwordAgain);
  }

  const handleUpdate = async () => {

    const dto: UpdateUserDto = {};

    if (name) {
      dto.name = name
    }

    if (password && password === passwordAgain) {
      dto.password = password;
    };

    try {
      await updateUser(dto);
      if (name) dispatch(updateUserData({ name }));
      if (name || password) {
        setErrors(null);
        showSuccess('Proifle updated successfully!')
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse<UpdateUserDto>>
      const message = error.response?.data.message

      if (typeof message === "object") {
        setErrors(message);
      }
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <ImageSelect shape="oval" userImageUrl={user?.imageUrl} />

          <InputField
            label="Name"
            placeholder="Steve"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            errorMessages={errors?.name}
            Icon={User}
          />
          <InputField
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            errorMessages={errors?.password}
            Icon={KeyRound}
          />
          <InputField
            label="Password again"
            placeholder="Password"
            value={passwordAgain}
            onChangeText={setPasswordAgain}
            secureTextEntry
            Icon={KeyRound}
          />
        </View>

        <PrimaryButton
          icon={<Save size={18} color="white"></Save>}
          title="Save"
          onPress={handleUpdate}
          disabled={isButtonDisabled()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  formContainer: {
    width: '100%',
  },
});