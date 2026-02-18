import { useState } from "react";
import { Button, StyleSheet, TextInput, View, Alert, KeyboardAvoidingView, Platform, Text } from "react-native";

import { LoginDto } from "../dtos/login.dto";
import { AxiosError } from "axios";
import { login } from "../services/auth.service";


import { ErrorMessage } from "../components/ErrorMessages";
import { NavigateLink } from "../components/NavigateLink";


interface ErrorResponse {
  message: string[];
  statusCode: number;
  error: string;
}

export function LoginScreen() {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<string[] | null>(null);

  const handleLogin = async () => { 
    const credentials: LoginDto = { email, password };

    try {
      await login(credentials);
      setErrors(null);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const messages = error.response?.data?.message || [error.message || 'Unknown error'];
      setErrors(messages);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      
      <View style={styles.formContainer}>
        <ErrorMessage message={errors} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button title="Login" onPress={handleLogin} />
  
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
  input: {
    marginBottom: 12,
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
  }
});
