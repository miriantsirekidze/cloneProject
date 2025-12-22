import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';

const { height, width } = Dimensions.get('window');

interface Props {
  isFormValid: boolean;
  onPress: (() => {}) | (() => void);
}

const Enter = ({ onPress, isFormValid }: Props) => {
  const isEnabledStyle = isFormValid
  ? { backgroundColor: '#000000' }
  : { backgroundColor: '#00000080' }

  const isEnabledOpacity = isFormValid ? 0.5 : 1;

  return (
    <TouchableOpacity
      style={[styles.container, isEnabledStyle]}
      onPress={onPress}
      activeOpacity={isEnabledOpacity}
    >
      <View style={styles.dummyView} />
      <Text style={styles.text}>Enter</Text>
      {isFormValid ? (
        <Ionicons
          name="arrow-forward"
          size={20}
          color={'white'}
          style={styles.icon}
        />
      ) : (
        <View style={styles.dummyView}/>
      )}
    </TouchableOpacity>
  );
};

export default Enter;

const styles = StyleSheet.create({
  container: {
    height: height * 0.055,
    width: width * 0.85,
    borderRadius: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  dummyView: {
    height: 20,
    width: 20,
    marginHorizontal: 16,
  },
  icon: {
    marginHorizontal: 16,
  },
});
