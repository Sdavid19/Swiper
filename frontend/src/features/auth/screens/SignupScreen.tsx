import { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";

import { signup } from "../services/auth.service";
import { SignupDto } from "../dtos/signup.dto";
import { NavigateLink } from "../components/NavigateLink";
import { AxiosError } from "axios";
import { showSuccess } from "../../../core/services";
import { InputField, PrimaryButton } from "../../../shared/components";
import { ErrorResponse, ValidationErrors } from "../../../types";

type SignupErrorResponse = ErrorResponse<ValidationErrors<SignupDto>>;

export function SignupScreen() {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors<SignupDto> | null>(null);

   const isButtonDisabled = () => {
    return !email || !password || !name;
  }

  const handleLogin = async () => {
    const credentials: SignupDto = { email, password, name };

    try {
      await signup(credentials);
      showSuccess('Sucessfully signed up!')
      setErrors(null);
    } catch (err) {
      const error = err as AxiosError<SignupErrorResponse>; 
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
          errorMessages={errors?.name}
          placeholder="Steve"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />
        <InputField
          label="Email"
          errorMessages={errors?.email}
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Password"
          errorMessages={errors?.password}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

         <PrimaryButton 
            title="Login" 
            onPress={handleLogin} 
            disabled={isButtonDisabled()} 
            style={styles.loginButton}
          />

        <NavigateLink text="Already have an account?" component="Login" />
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
  },
   loginButton:{
    marginTop: 10
  }
});
