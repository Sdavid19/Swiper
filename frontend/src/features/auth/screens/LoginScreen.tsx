import { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";

import { LoginDto } from "../dtos/login.dto";
import { AxiosError } from "axios";
import { login } from "../services/auth.service";

import { NavigateLink } from "../components/NavigateLink";
import { InputField, PrimaryButton } from "../../../shared/components";
import { ValidationErrors, ErrorResponse } from "../../../shared/types";
import { showSuccess } from "../../../shared/utils/toast.service";

type LoginErrorResponse = ErrorResponse<ValidationErrors<LoginDto>>;

export function LoginScreen() {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [errors, setErrors] = useState<ValidationErrors<LoginDto> | null>(null);

  const isButtonDisabled = () => {
    return !email || !password;
  }

  const handleLogin = async () => { 
    const credentials: LoginDto = {email, password};

    try {
      await login(credentials);
      showSuccess('Logged in succesfully!');
      setErrors(null);
    } catch (err) {
      const error = err as AxiosError<LoginErrorResponse>; 
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
          label="Email"
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessages={errors?.email}
        />
        <InputField
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          errorMessages={errors?.password}
        />

        <PrimaryButton 
          title="Login" 
          onPress={handleLogin} 
          disabled={isButtonDisabled()} 
          style={styles.loginButton}
        />
  
      <NavigateLink text="Not a member yet?" component="Signup" />
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
