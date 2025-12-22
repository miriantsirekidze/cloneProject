import React, { useState, SyntheticEvent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import DatePicker from 'react-native-date-picker';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');

interface Props {
  label: string;
  value?: string;
  onChange: (text: string) => void;
  isRequired: boolean;
  error?: any;
  onBlur: (e: SyntheticEvent) => void;
  disabled?: boolean;
}

const DatePick = ({
  label,
  value,
  onChange,
  error,
  isRequired,
  onBlur,
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState(false);

  const formatDate = (currentDate: Date): string => {
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date();

    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date();
  };

  return (
    <View style={[styles.container, disabled && styles.disabledContainer]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isRequired && <Text style={styles.required}>*</Text>}
      </View>
      <TouchableOpacity
        style={[styles.textInputContainer, error && styles.requiredError]}
        activeOpacity={0.5}
        onPress={() => !disabled && setOpen(true)}
      >
        <Text style={styles.default}>{value ? value : 'Select Date'}</Text>
        <Ionicons
          name="calendar-outline"
          size={20}
          color={'black'}
          style={styles.icon}
        />
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={parseDate(value)}
        mode="date"
        onBlur={onBlur}
        theme="light"
        onConfirm={selectedDate => {
          setOpen(false);
          onChange(formatDate(selectedDate));
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default DatePick;

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
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
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
  default: {
    marginLeft: 12,
    fontSize: 17,
  },
  required: {
    color: 'red',
    fontSize: 12,
    marginLeft: 3,
  },
  icon: {
    marginRight: 12,
  },
  disabledContainer: {
    opacity: 0.5,
  },
});
