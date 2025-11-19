import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { loginWithEmail } from '../utils/authService';
import { useAuth } from '../context/AuthContext';
import {
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';

import SignInGoogle from '../components/SignInGoogle';
import EmailTextInput from '../components/EmailTextInput';
import Enter from '../components/Enter';

type RootStackParamList = {
  SignUp: undefined; 
  PassRecovery: undefined;
};

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { login } = useAuth();

  const isFormValid = email.includes('@') && password.length > 3;

  const onPress = async () => {
    if (!isFormValid) return;
    const response = await loginWithEmail(email, password);
    if (response.success) {
      login();
    } else {
      Alert.alert('Login Failed', response.error);
    }
  };


  return (
    <View style={styles.container}>
      <Text>Sign in with Email</Text>
      <View style={styles.emailContainer}>
        <EmailTextInput
          icon="mail-outline"
          text="Email"
          value={email}
          onChangeText={setEmail}
        />
        <EmailTextInput
          icon="key-outline"
          text="Password"
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PassRecovery')}>
            <Text style={styles.buttonText}>Forget Password?</Text>
          </TouchableOpacity>
        </View>
        <Enter onPress={onPress} isFormValid={!isFormValid} />
      </View>
      <Text style={styles.text}>Or</Text>
      <SignInGoogle icon="logo-google" title="Sign in with Google" />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600'
  },
  emailContainer: {
    gap: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
  },
  buttonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 2,
  },
});
