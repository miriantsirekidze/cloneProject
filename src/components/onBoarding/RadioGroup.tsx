import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');

interface Props {
  label: string;
  value: string;
  onChange: (text: string) => void;
  options: string[];
  isRequired: boolean;
  disabled?: boolean;
  error?: string;
  onBlur?: () => void;
}

const RadioGroup = ({
  label,
  options,
  value,
  onChange,
  onBlur,
  error,
  isRequired = false,
  disabled = false,
}: Props) => {
  const [isShown, setIsShown] = useState(false);

  const handleSelect = (item: string) => {
    onChange(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isRequired && <Text style={styles.required}>*</Text>}
      </View>
      <View style={[disabled && styles.disabledContainer]}>
        <TouchableOpacity
          style={[styles.textContainer, error && styles.requiredError]}
          onPress={() => !disabled && setIsShown(!isShown)}
          onBlur={onBlur}
          activeOpacity={0.8}
          disabled={disabled}
        >
          <View style={styles.visualContainer}>
            <Text style={styles.default}>
              {value ? value : 'Select an Option'}
            </Text>
            <Ionicons
              name={isShown ? 'chevron-up' : 'chevron-down'}
              size={20}
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.margin}>
          {isShown &&
            options.map(item => {
              const isSelected = item === value;

              return (
                <TouchableOpacity
                  key={item}
                  style={styles.optionContainer}
                  onPress={() => !disabled && handleSelect(item)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.selectedCircle,
                    ]}
                  >
                    {isSelected && <View style={styles.innerDot} />}
                  </View>

                  <Text style={styles.radioLabel}>{item}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 15, paddingTop: 15 },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  textContainer: {
    width: '100%',
    height: width * 0.13,
    borderWidth: 2,
    borderColor: '#52d',
    borderRadius: 10,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  visualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  default: {
    marginLeft: 12,
    fontSize: 17,
    color: '#000',
  },
  icon: {
    marginRight: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#52d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedCircle: { borderColor: '#52d' },
  innerDot: {
    height: 10,
    width: 10,
    borderRadius: 6,
    backgroundColor: '#52d',
  },
  radioLabel: { fontSize: 16, color: '#333' },
  label: {
    color: '#444',
    fontSize: 13,
  },
  required: {
    color: 'red',
    fontSize: 12,
    marginLeft: 3,
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
  disabledContainer: {
    opacity: 0.5,
  },
  margin: {
    marginTop: 5,
  },
  requiredError: {
    borderColor: 'red',
  },
});

export default RadioGroup;
