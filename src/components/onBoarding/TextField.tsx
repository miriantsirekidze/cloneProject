import React, { SyntheticEvent } from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
  label: string;
  value: string;
  onChange: (text: string) => void;
  isRequired: boolean;
  onBlur: (e: SyntheticEvent) => void;
  error?: string;
  disabled?: boolean;
  trigger?: (name: string) => Promise<boolean>;
  fieldName?: string;
}

const TextField = ({
  label,
  value,
  onChange,
  isRequired,
  onBlur,
  error,
  disabled = false,
  trigger,
  fieldName,
}: Props) => {
  const handleChange = (text: string) => {
    onChange(text);
    if (trigger && fieldName) {
      trigger(fieldName);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.labelContainer]}>
        <Text style={styles.label}>{label}</Text>
        {isRequired && <Text style={styles.required}>*</Text>}
      </View>
      {error && (
        <View style={styles.warning}>
          <Text style={styles.warningText}>{error}</Text>
        </View>
      )}
      <View style={[styles.textInputContainer, error && styles.requiredError]}>
        <TextInput
          value={value}
          onBlur={onBlur}
          onChangeText={handleChange}
          autoCapitalize="none"
          style={[styles.textInputStyle, disabled && styles.disabledContainer]}
          editable={!disabled}
        />
      </View>
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
  },
  textInputContainer: {
    width: '100%',
    height: width * 0.13,
    borderWidth: 2,
    borderColor: '#52d',
    borderRadius: 10,
  },
  requiredError: {
    borderColor: 'red',
  },
  labelContainer: {
    backgroundColor: '#f1f1f1',
    zIndex: 1,
    paddingHorizontal: 8,
    position: 'absolute',
    top: 8,
    left: 20,
    flexDirection: 'row',
  },
  label: {
    color: '#444',
    fontSize: 13,
  },
  textInputStyle: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
  },
  required: {
    color: 'red',
    fontSize: 12,
    marginLeft: 3,
  },
  warning: {
    top: 9,
    paddingHorizontal: 8,
    position: 'absolute',
    right: 20,
    alignSelf: 'flex-end',
    backgroundColor: '#f1f1f1',
    zIndex: 1,
  },
  warningText: {
    color: 'red',
    fontSize: 11,
  },
  disabledContainer: {
    opacity: 0.5,
  },
});
