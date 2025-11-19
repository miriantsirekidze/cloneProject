import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const { height, width } = Dimensions.get('window');

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
  value: string;
  onChangeText: (text: string) => void;
}

const EmailTextInput = ({ icon, text, value, onChangeText }: Props) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const isPassword = text.includes('Password') ? true : false;
  const isShown = passwordShown ? 'eye-outline' : 'eye-off' 

  return (
    <View style={styles.container}>
      <View style={styles.iconTextContainer}>
        <Ionicons name={icon} size={24} color={'black'} />
        <TextInput
          placeholder={text}
          style={styles.textInput}
          value={value}
          autoCapitalize="none"
          secureTextEntry={isPassword && !passwordShown}
          onChangeText={onChangeText}
        />
        {isPassword ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setPasswordShown(!passwordShown)}
          >
            <Ionicons name={isShown} color={'black'} size={20} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default EmailTextInput;

const styles = StyleSheet.create({
  container: {
    height: height * 0.065,
    width: width * 0.85,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 8,
    justifyContent: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  textInput: {
    marginLeft: 12,
    height: '100%',
    flex: 1,
  },
});
