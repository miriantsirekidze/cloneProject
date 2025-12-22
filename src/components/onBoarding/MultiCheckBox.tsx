import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');

interface Props {
  label: string;
  value: string[] | string;
  onChange: (text: string[]) => void;
  options: string[];
  onBlur?: () => void;
  isRequired: boolean;
  error?: string;
  disabled?: boolean;
}

const MultiCheckBox = ({
  label,
  options,
  value,
  onBlur,
  error,
  onChange,
  isRequired = false,
  disabled = false,
}: Props) => {
  const [isShown, setIsShown] = useState(false);

  const currentValues = Array.isArray(value) ? value : [value];

  const handlePress = (item: string) => {
    let newValues: string[];

    if (currentValues.includes(item)) {
      newValues = currentValues.filter(val => val !== item);
    } else {
      newValues = [...currentValues, item];
    }

    onChange(newValues);
  };

  const getDisplayText = () => {
    if (currentValues.length === 0) return 'Select Option(s)';
    if (currentValues.length > 2) return `${currentValues.length} selected`;
    return currentValues.join(', ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isRequired && <Text style={styles.required}>*</Text>}
      </View>
      <View style={disabled && styles.disabledContainer}>
        <TouchableOpacity
          style={[styles.textContainer, error && styles.requiredError]}
          onPress={() => !disabled && setIsShown(!isShown)}
          onBlur={onBlur}
          activeOpacity={0.8}
        >
          <View style={styles.visualContainer}>
            <Text style={styles.default} numberOfLines={1}>
              {getDisplayText()}
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
              const isSelected = currentValues.includes(item);

              return (
                <TouchableOpacity
                  key={item}
                  style={styles.optionContainer}
                  onPress={() => !disabled && handlePress(item)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkSquare,
                      isSelected && styles.selectedCircle,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark-sharp"
                        size={17}
                        style={styles.checkStyle}
                      />
                    )}
                  </View>

                  <Text style={styles.checkLabel}>{item}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    </View>
  );
};

export default MultiCheckBox;

const styles = StyleSheet.create({
  container: { gap: 12, paddingTop: 15 },
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
  checkSquare: {
    height: 22,
    width: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#52d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedCircle: { borderColor: '#52d' },
  checkLabel: { fontSize: 16, color: '#333' },
  label: {
    color: '#444',
    fontSize: 13,
  },
  required: {
    color: 'red',
    fontSize: 12,
    marginLeft: 3,
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
  checkStyle: {
    alignSelf: 'center',
    color: '#52d',
  },
  disabledContainer: {
    opacity: 0.5,
  },
  margin: {
    marginTop: 5,
  },
});
