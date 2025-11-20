import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// 1. Define the props you are passing from SignUp
type Props = {
  characters: boolean;
  numbers: boolean;
  symbols: boolean;
  match: boolean;
};

const PasswordRequirements = ({
  characters,
  numbers,
  symbols,
  match,
}: Props) => {
  const renderRequirement = (isValid: boolean, text: string) => {
    return (
      <View style={styles.row}>
        <Ionicons
          name={isValid ? 'checkmark-circle' : 'alert-circle-outline'}
          size={20}
          color={isValid ? 'green' : '#ccc'}
        />
        <Text
          style={[styles.text, isValid ? styles.textValid : styles.textInvalid]}
        >
          {text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Password Requirements:</Text>
      {renderRequirement(characters, 'At least 8 characters')}
      {renderRequirement(numbers, 'At least one number')}
      {renderRequirement(symbols, 'At least one symbol')}
      {renderRequirement(match, 'Passwords match.')}
    </View>
  );
};

export default PasswordRequirements;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 5,
  },
  header: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 14,
  },
  textValid: {
    color: 'green',
  },
  textInvalid: {
    color: '#666',
  },
});
