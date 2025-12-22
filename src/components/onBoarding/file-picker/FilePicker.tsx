import React, { useState, SyntheticEvent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import FileModal from './FileModal';
import { FileObject } from './utils/fileFunctions';

const { width } = Dimensions.get('window');

type FileValue = FileObject | string;

interface Props {
  label: string;
  value: FileValue[];
  onChange: (files: FileValue[]) => void;
  onBlur: (e: SyntheticEvent) => void;
  isRequired: boolean;
  error?: string;
  disabled?: boolean;
}

const FilePicker = ({
  label,
  value = [],
  onChange,
  isRequired,
  onBlur,
  disabled = false,
  error,
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const isImageUrl = (url: string) => {
    const cleanUrl = url.split('?')[0].toLowerCase();
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(cleanUrl);
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      const decoded = decodeURIComponent(url);
      return decoded.split('?')[0].split('/').pop() || 'File';
    } catch {
      return 'File';
    }
  };

  const normalizeFile = (file: FileValue): FileObject => {
    if (typeof file === 'string') {
      return {
        uri: file,
        name: getFileNameFromUrl(file),
        type: isImageUrl(file) ? 'image' : 'document',
        size: 0,
      };
    }
    return file;
  };

  const removeFile = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const getDisplayText = (): string => {
    if (!value || value.length === 0) {
      return 'Pick Files';
    }
    if (value.length === 1) {
      return normalizeFile(value[0]).name;
    }
    return `${value.length} files selected`;
  };

  const handleModalOpen = () => {
    if (disabled) return;
    if (value.length >= 5) {
      Alert.alert('Limit Reached', 'You can only select up to 5 files');
      return;
    }
    setModalVisible(true);
  };

  return (
    <>
      <View style={[styles.container, disabled && styles.disabledContainer]}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {isRequired && <Text style={styles.required}>*</Text>}
        </View>
        <View
          style={[styles.textInputContainer, error && styles.requiredError]}
        >
          <View style={styles.visualContainer}>
            <Text style={styles.default} numberOfLines={1}>
              {getDisplayText()}
            </Text>
            <Ionicons name="chevron-down" size={20} style={styles.icon} />
          </View>
          <TouchableOpacity
            style={styles.iosTouchOverlay}
            onPress={handleModalOpen}
          />
        </View>
      </View>
      {value && value.length > 0 && (
        <ScrollView
          style={styles.fileList}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.fileListContent}
        >
          {value.map((rawFile, index) => {
            const file = normalizeFile(rawFile);
            return (
              <View
                key={`${file.name}-${index}`}
                style={styles.fileChip}
                onStartShouldSetResponder={() => true}
              >
                {file.type === 'image' ? (
                  <Image source={{ uri: file.uri }} style={styles.fileImage} />
                ) : (
                  <View style={styles.fileIconContainer}>
                    <Ionicons name="document" size={24} color="#555" />
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => removeFile(index)}
                  style={styles.removeBtn}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <Ionicons name="close-circle" size={20} color="#52d" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

      <FileModal
        onBlur={onBlur}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onChange={onChange}
        currentValue={value.map(normalizeFile)}
      />
    </>
  );
};

export default FilePicker;

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
    flexWrap: 'nowrap',
    overflow: 'hidden',
    width: '85%',
  },
  icon: {
    marginRight: 12,
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
  fileList: {
    marginTop: 8,
    flexDirection: 'row',
    height: 70,
    flex: 1,
  },
  fileListContent: {
    paddingRight: 20,
  },
  fileChip: {
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 5,
    position: 'relative',
    marginTop: 5,
  },
  fileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6e6fa',
  },
  removeBtn: {
    zIndex: 2,
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  fileImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
});
