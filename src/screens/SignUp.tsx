import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { signUpWithEmail } from '../utils/firebase/authService';
import { useAuth } from '../context/AuthContext';

import EmailTextInput from '../components/auth/EmailTextInput';
import Enter from '../components/shared/Enter';
import SignInGoogle from '../components/auth/SignInGoogle';
import PasswordRequirements from '../components/auth/PasswordRequirements';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const { loginAsNewUser } = useAuth();

  const onPress = async () => {
    if (!isFormValid) return;
    const response = await signUpWithEmail(email, password);
    if (response.success) {
      loginAsNewUser();
    } else {
      Alert.alert('Login Failed', response.error);
    }
  };

  const isFormValid =
    password === repeatedPassword &&
    password.length >= 8 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordHasCharacters = password.length >= 8;
  const passwordHasNumber = /\d/.test(password);
  const passwordHasSymbol = /[^a-zA-Z0-9]/.test(password);
  const passwordMatches = password === repeatedPassword && password !== '';

  return (
    <View style={styles.container}>
      <View style={styles.emailContainer}>
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
      </View>
      <View style={styles.separator} />
      <PasswordRequirements
        characters={passwordHasCharacters}
        numbers={passwordHasNumber}
        symbols={passwordHasSymbol}
        match={passwordMatches}
      />
      <View style={styles.buttonContainer}>
        <Enter onPress={onPress} isFormValid={isFormValid} />
        <Text style={styles.text}>Or</Text>
        <SignInGoogle icon="logo-google" title="Sign up with Google" />
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    gap: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  emailContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  separator: {
    width: '95%',
    height: 1,
    alignSelf: 'center',
    backgroundColor: '#ccc',
  },
});
