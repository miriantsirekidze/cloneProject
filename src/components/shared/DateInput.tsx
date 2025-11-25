import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import DatePicker from 'react-native-date-picker';

const { width } = Dimensions.get('window');

interface Props {
  date: Date | null;
  onChange: (date: Date) => void;
  title?: string;
}

const DateInput = ({ date, onChange, title = 'Date of Birth' }: Props) => {
  const [open, setOpen] = useState(false);

  const formatDate = (rawDate: Date) => {
    return rawDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      
      <TouchableOpacity 
        style={styles.inputField} 
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, !date && styles.placeholder]}>
          {date ? formatDate(date) : 'Select a date'}
        </Text>
        <Ionicons name='chevron-down' size={18}/>
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={date || new Date()}
        mode="date"
        theme="light"
        onConfirm={(rawDate) => {
          setOpen(false);
          onChange(rawDate);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default DateInput;

const styles = StyleSheet.create({
  container: {
    width: width * 0.9, 
    alignSelf: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  inputField: {
    backgroundColor: '#f0f0f0', 
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    color: 'black',
  },
  placeholder: {
    color: '#999',
  },
});