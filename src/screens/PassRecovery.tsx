import React, {useState} from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { passwordRecovery } from '../utils/authService'
import { useNavigation, NavigationProp } from '@react-navigation/native'

import EmailTextInput from '../components/EmailTextInput'
import Enter from '../components/Enter'

type RootStackParamList = {
  SignIn: undefined
};

const PassRecovery = () => {

  const [email, setEmail] = useState('')
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const isFormValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const onPress = async () => {
    if (!isFormValid) return
    const response = await passwordRecovery(email)
    if (response.success) {
      Alert.alert('Link sent!')
      navigation.navigate('SignIn')
    }
  }

  return (
    <View style={styles.container}>
      <Text>Password recovery link will be sent to your Email</Text>
      <EmailTextInput
        icon='mail-outline'
        text='Email'
        value={email}
        onChangeText={setEmail}
      />
      <Enter
        onPress={onPress}
        isFormValid={!isFormValid}
      />
    </View>
  )
}

export default PassRecovery

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  }
})