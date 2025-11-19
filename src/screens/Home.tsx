import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthContext'

const Home = () => {

  const {logout} = useAuth() 

  const onPress = async() => {
    logout()
  } 

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.signOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  signOut: {

  }
})