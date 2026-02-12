import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export function LoginScreen(){
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
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
      <Button title="Login" onPress={() => console.log('logging in')} />
    </View>
);
}


const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 12, borderWidth: 1, padding: 8, borderRadius: 4 },
});