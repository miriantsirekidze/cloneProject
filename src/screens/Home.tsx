import React from 'react';
import { View, StyleSheet } from 'react-native';
// import { useAuth } from '../context/AuthContext';
import CountryList from '../testing/dev/CountryList';

const Home = () => {
  return (
    <View style={styles.container}>
      <CountryList />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// const { logout } = useAuth();

// const onPress = async () => {
//   logout();
// };

// <TouchableOpacity onPress={onPress}>
//   <Text>Sign Out</Text>
// </TouchableOpacity>
