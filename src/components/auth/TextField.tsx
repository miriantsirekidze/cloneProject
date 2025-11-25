import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';

const { height, width } = Dimensions.get('window');

interface Props {
  value: string;
  onChange: (text: string) => void;
  title: string;
  placeholder: string;
}

const TextField = ({ value, onChange, title, placeholder }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <View style={[styles.textContainer, isFocused ? styles.focusedBorder : styles.unfocusedBorder]}>
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
  container: {},
  textContainer: {
    width: width * 0.9,
    height: height * 0.06,
    borderRadius: 10,
    backgroundColor: '#dbdbdb',
    borderWidth: 2,
    justifyContent: 'center',
  },
  focusedBorder: {
    borderColor: 'black'
  },
  unfocusedBorder: {
    borderColor: '#ffffff',
  },
  textInput: {
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  }
});
