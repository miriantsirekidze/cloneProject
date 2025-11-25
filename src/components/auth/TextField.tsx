import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';

const { height, width } = Dimensions.get('window');

interface Props {
  value: string;
  onChange: (text: string) => void;
  title: string;
  placeholder: string;
  isTaken?: boolean;
}

const TextField = ({ value, onChange, title, placeholder, isTaken }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View>
      <View style={styles.usernameContainer}>
        <Text style={styles.label}>{title}</Text>
        {
          isTaken ? <Text style={styles.takenUsername}>Taken, try another one</Text> : null
        }
      </View>
      <View
        style={[
          styles.textContainer,
          isTaken ? styles.errorBorder : isFocused ? styles.focusedBorder : styles.unfocusedBorder,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          style={styles.textInput}
          placeholderTextColor={'#222'}
          autoCapitalize="none"
          spellCheck={false}
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
        />
      </View>
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  textContainer: {
    width: width * 0.9,
    height: height * 0.06,
    borderRadius: 10,
    backgroundColor: '#dbdbdb',
    borderWidth: 2,
    justifyContent: 'center',
  },
  focusedBorder: {
    borderColor: 'black',
  },
  unfocusedBorder: {
    borderColor: '#ffffff',
  },
  errorBorder: {
    borderColor: 'red'
  },
  textInput: {
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  takenUsername: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
