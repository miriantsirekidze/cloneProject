import React, { SyntheticEvent } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import FileItem from '../option-picker/FileItem';

import {
  handleCameraLaunch,
  selectImage,
  pickDocument,
  PickedFileResult,
  FileObject,
} from './utils/fileFunctions';

interface Props {
  onChange: (files: FileObject[]) => void;
  onFileSelect?: (fileResults: PickedFileResult[]) => void;
  modalVisible: boolean;
  setModalVisible: (bool: boolean) => void;
  onBlur: (e: SyntheticEvent) => void;
  currentValue?: FileObject[];
}

const FileModal = ({
  onChange,
  onFileSelect,
  modalVisible,
  setModalVisible,
  onBlur,
  currentValue = [],
}: Props) => {
  const handleFileChange = (newFiles: PickedFileResult[]) => {
    const newObjects: FileObject[] = newFiles.map(f => ({
      uri: f.uri,
      name: f.name || 'File',
      size: f.size,
      type: f.type && f.type.includes('image') ? 'image' : 'document',
      id: f.id,
    }));

    const uniqueNewObjects = newObjects.filter(
      (file, index, self) =>
        index ===
        self.findIndex(f => {
          if (file.type === 'image' && f.type === 'image' && f.id && file.id) {
            return f.id === file.id;
          }
          return f.name === file.name && f.size === file.size;
        }),
    );

    const validNewObjects: FileObject[] = [];

    uniqueNewObjects.forEach(newFile => {
      const isDuplicate = currentValue.some(existing => {
        if (
          newFile.type === 'image' &&
          existing.type === 'image' &&
          existing.id &&
          newFile.id
        ) {
          return existing.id === newFile.id;
        }
        return existing.name === newFile.name && existing.size === newFile.size;
      });

      if (!isDuplicate) {
        validNewObjects.push(newFile);
      }
    });

    const combinedFiles = [...currentValue, ...validNewObjects];

    let finalFiles = combinedFiles;
    let limitExceeded = false;

    if (combinedFiles.length > 5) {
      finalFiles = combinedFiles.slice(0, 5);
      limitExceeded = true;
    }

    onChange(finalFiles);
    onFileSelect?.(newFiles);
    setModalVisible(false);

    if (limitExceeded) {
      setTimeout(() => {
        Alert.alert(
          'Limit Reached',
          'You can only select up to 5 files. Extra files were discarded.',
        );
      }, 500);
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <TouchableWithoutFeedback onBlur={onBlur}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.title}>Pick Files</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={28} />
                  </TouchableOpacity>
                </View>
                <View style={styles.pickerWrapper}>
                  <FileItem
                    icon="camera"
                    label="Camera"
                    onChange={handleFileChange}
                    onPress={handleCameraLaunch}
                  />
                  <FileItem
                    icon="image-outline"
                    label="Gallery"
                    onChange={handleFileChange}
                    onPress={selectImage}
                  />
                  <FileItem
                    icon="document"
                    label="Document"
                    onChange={handleFileChange}
                    onPress={pickDocument}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default FileModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '30%',
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    flexDirection: 'row',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
