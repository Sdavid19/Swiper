import { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { SigninDto } from "../../../shared/types/generated";
import { AxiosError } from "axios";
import { login } from "../services/auth.service";
import { NavigateLink } from "../components/NavigateLink";
import { InputField, PrimaryButton } from "../../../shared/components";
import { ValidationErrorMessage, ErrorResponse } from "../../../shared/types";
import { showSuccess } from "../../../shared/utils/toast.service";
import { KeyRound, Mail } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


export function LoginScreen() {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrorMessage<SigninDto> | null>(null);

  const isButtonDisabled = () => {
    return !email || !password;
  }

  const handleLogin = async () => {
    const credentials: SigninDto = { email, password };

    try {
      await login(credentials);
      showSuccess('Logged in succesfully!');
      setErrors(null);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse<SigninDto>>
      const message = error.response?.data.message

      if (typeof message === "object") {
        setErrors(message);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../../../assets/logo.png')}
          resizeMode="cover"
        />
      </View>

      <View style={styles.formContainer}>
        <InputField
          label="Email"
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessages={errors?.email}
          Icon={Mail}
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

        <PrimaryButton
          title="Login"
          onPress={handleLogin}
          disabled={isButtonDisabled()}
          style={styles.loginButton}
        />

        <NavigateLink text="Not a member yet?" component="Signup" />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#fff',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 60
  },

  logo: {
    width: 200,
    height: 200,
  },

  formContainer: {
    width: '100%',
    alignSelf: 'flex-end'
  },

  loginButton: {
    marginVertical: 12,
  },
});