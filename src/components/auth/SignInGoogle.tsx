import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';
import { useAuth } from '../../context/AuthContext';
import { signInWithGoogle } from '../../utils/firebase/authService';

const { height, width } = Dimensions.get('window');

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
}

const SignInGoogle = ({ icon, title }: Props) => {
  const { login, loginAsNewUser } = useAuth();

  const onPress = async () => {
    const response = await signInWithGoogle();

    if (response.success) {
      if (response.isNewUser) {
        console.log('New Google User -> Redirecting to Finish Registration');
        loginAsNewUser();
      } else {
        console.log('Returning Google User -> Redirecting to Home');
        login();
      }
    } else {
      if (response.error !== 'User cancelled the login flow') {
        Alert.alert('Google Sign In Error', response.error);
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.5}
    >
      <View style={styles.itemContainer}>
        <Ionicons name={icon} color={'white'} size={30} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SignInGoogle;

const styles = StyleSheet.create({
  container: {
    height: height * 0.06,
    width: width * 0.85,
    backgroundColor: 'black',
    borderRadius: 50,
  },
  title: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '600',
    marginLeft: 12,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
