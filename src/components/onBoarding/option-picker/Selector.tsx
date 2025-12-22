import React, { useState, SyntheticEvent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@react-native-vector-icons/ionicons';
import ModalComponent from './ModalComponent';

const { width } = Dimensions.get('window');

interface Props {
  label: string;
  value: string;
  onChange: (text: string) => void;
  onBlur: (e: SyntheticEvent) => void;
  options: string[];
  isRequired: boolean;
  error?: string;
  disabled?: boolean;
}

const Selector = ({
  label,
  value,
  onChange,
  options,
  isRequired,
  onBlur,
  disabled = false,
  error,
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={[styles.container, disabled && styles.disabledContainer]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isRequired && <Text style={styles.required}>*</Text>}
      </View>
      <View style={[styles.textInputContainer, error && styles.requiredError]}>
        <View style={styles.visualContainer}>
          <Text style={styles.default}>{value || label}</Text>
          <Ionicons name="chevron-down" size={20} style={styles.icon} />
        </View>

        {Platform.OS === 'android' ? (
          <Picker
            selectedValue={value}
            onValueChange={itemValue => onChange(itemValue)}
            onBlur={onBlur}
            mode="dropdown"
            style={styles.androidPicker}
            enabled={!disabled}
          >
            {options.map(option => (
              <Picker.Item label={option} value={option} />
            ))}
          </Picker>
        ) : (
          <TouchableOpacity
            style={styles.iosTouchOverlay}
            onPress={() => !disabled && setModalVisible(true)}
          />
        )}
      </View>

      {Platform.OS === 'ios' && (
        <ModalComponent
          value={value}
          onBlur={onBlur}
          options={options}
          onChange={onChange}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </View>
  );
};

export default Selector;

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
  required: {
    color: 'red',
    fontSize: 12,
    marginLeft: 3,
  },
  default: {
    marginLeft: 12,
    fontSize: 17,
    color: '#000',
  },
  icon: {
    marginRight: 12,
  },
  androidPicker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  iosTouchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  requiredError: {
    borderColor: 'red',
  },
});
