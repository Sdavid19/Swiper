import { useState } from "react";
import { Button, StyleSheet, TextInput, View, KeyboardAvoidingView, Platform, Alert } from "react-native";

import { AxiosError } from "axios";
import { signup } from "../services/auth.service";

import { ErrorMessage } from "../components/ErrorMessages";
import { SignupDto } from "../dtos/signup.dto";

import { NavigateLink } from "../components/NavigateLink";


interface ErrorResponse {
  message: string[];
  statusCode: number;
  error: string;
}

export function SignupScreen() {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<string[] | null>(null);

  const handleLogin = async () => {
    const credentials: SignupDto = { email, password, name };

    try {
      await signup(credentials);
       Alert.alert('Succesful signup!')
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
          placeholder="Name"
          value={name}
          onChangeText={setName}
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

        <Button title="Signup" onPress={handleLogin} />

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
  input: {
    marginBottom: 12,
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
  }
});
