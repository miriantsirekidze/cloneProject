import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { signUpWithEmail } from '../utils/authService';

import EmailTextInput from '../components/EmailTextInput';
import Enter from '../components/Enter';
import SignInGoogle from '../components/SignInGoogle';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const { login } = useAuth();

  const onPress = async () => {
    if (!isFormValid) return;
    const response = await signUpWithEmail(email, password);
    if (response.success) {
      login();
    } else {
      Alert.alert('Login Failed', response.error);
    }
  };

  const isFormValid = password === repeatedPassword && password.length > 3 && email.includes('@');

  return (
    <View style={styles.container}>
      <Text>Sign up with Email</Text>
      <View style={styles.inputContainer}>
        <EmailTextInput
          icon="mail-outline"
          text="Email"
          value={email}
          onChangeText={setEmail}
        />
        <EmailTextInput
          icon="key-outline"
          text="Enter Password"
          value={password}
          onChangeText={setPassword}
        />
        <EmailTextInput
          icon="key-outline"
          text="Repeat Password"
          value={repeatedPassword}
          onChangeText={setRepeatedPassword}
        />
      </View>
      <Enter onPress={onPress} isFormValid={!isFormValid} />
      <Text style={styles.text}>Or</Text>
      <SignInGoogle icon="logo-google" title="Sign up with Google" />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  inputContainer: {
    gap: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: '600'
  }
});
