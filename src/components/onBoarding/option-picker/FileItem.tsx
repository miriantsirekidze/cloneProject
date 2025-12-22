import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { PickedFileResult } from '../file-picker/utils/fileFunctions';

const FileItem = ({
  icon,
  label,
  onChange,
  onPress,
}: {
  icon: string;
  label: string;
  onChange: (fileResults: PickedFileResult[]) => void;
  onPress: () => Promise<PickedFileResult[]>;
}) => {
  const handlePress = async () => {
    const results = await onPress();
    if (results && results.length > 0) {
      onChange(results);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.iconContainer}
        onPress={handlePress}
      >
        <Ionicons name={icon as any} size={36} />
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default FileItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 75,
    width: 75,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: 'semibold',
    fontSize: 16,
  },
});
