import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import DateInput from '../components/shared/DateInput';
import { useGetCityAndCountry } from '../utils/getCountryAndCity';
import { useAuth } from '../context/AuthContext';

import TextField from '../components/auth/TextField';
import ProfilePicture from '../components/shared/ProfilePicture';
import Enter from '../components/shared/Enter';

const { height } = Dimensions.get('window');


const FinishRegistration = () => {
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const isFormValid = username.length > 3 && imageUri && birthDate;
  const { completeRegistration } = useAuth();

  const { data: locationData, isLoading: isLocationLoading } =
    useGetCityAndCountry(coordinates?.lat ?? null, coordinates?.long ?? null);

  const getLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to complete your profile.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Location is required.');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      position => {
        setCoordinates({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const onPress = async () => {
    if (!isFormValid) return;
    console.log('signed in')
    if (true) {
      completeRegistration();
    } else {
      // Alert.alert('Login Failed', response.error);
    }
  };

  const locationDisplayText = isLocationLoading
    ? 'Locating...'
    : locationData
    ? `${locationData.city}, ${locationData.country}`
    : '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finish registration</Text>
      <ProfilePicture imageUri={imageUri} onImagePicked={setImageUri} />
      <Text style={styles.location}>{locationDisplayText}</Text>
      <View style={styles.contentContainer}>
        <TextField
          value={username}
          onChange={setUsername}
          title="Username"
          placeholder="Choose an username"
        />
        <DateInput date={birthDate} onChange={setBirthDate} title="Birthday" />
        <Enter onPress={onPress} isFormValid={!isFormValid} />
      </View>
    </View>
  );
};

export default FinishRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginTop: height * 0.1,
  },
  contentContainer: {
    gap: 15,
    marginTop: height * 0.05,
    alignItems: 'center',
  },
  location: {
    alignSelf: 'center',
    marginTop: 10,
  },
});
