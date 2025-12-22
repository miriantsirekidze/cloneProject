import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const { height } = Dimensions.get('window');

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity activeOpacity={0.5}>
          <Ionicons name="chevron-back" size={28} color={'#52d'} />
        </TouchableOpacity>
        <Text style={styles.title}>Company</Text>
        <Text style={styles.pageCount}>1/7</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: height * 0.13,
    width: '100%',
    backgroundColor: '#ccc',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  headerContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginTop: height * 0.08,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  pageCount: {
    fontSize: 16,
  },
});
