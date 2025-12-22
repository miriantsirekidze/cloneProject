import React, { SyntheticEvent } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@react-native-vector-icons/ionicons';

interface Props {
  onChange: (text: string) => void;
  modalVisible: boolean;
  setModalVisible: (bool: boolean) => void;
  value: string;
  options: string[];
  onBlur: (e: SyntheticEvent) => void;
}

const ModalComponent = ({
  onChange,
  modalVisible,
  setModalVisible,
  onBlur,
  value,
  options,
}: Props) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.title}>Pick an Option</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={28} />
                  </TouchableOpacity>
                </View>
                <View style={styles.pickerWrapper}>
                  <Picker
                    onBlur={onBlur}
                    itemStyle={styles.pickerItem}
                    selectedValue={value}
                    onValueChange={itemValue => onChange(itemValue)}
                  >
                    <Picker.Item />
                    {options.map(option => (
                      <Picker.Item label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '35%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pickerWrapper: {
    height: 200,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pickerItem: {
    fontSize: 16,
    height: 200,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
