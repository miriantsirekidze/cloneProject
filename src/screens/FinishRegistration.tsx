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
import { useGetCityAndCountry } from '../utils/misc/getCountryAndCity';
import { useAuth } from '../context/AuthContext';
import { uploadProfileImage } from '../utils/firebase/firebaseStorage';
import {
  createUserProfile,
  checkUsernameAvailability,
} from '../utils/firebase/firebaseDatabase';
import { storage, STORAGE_KEYS } from '../utils/store';

import TextField from '../components/auth/TextField';
import ProfilePicture from '../components/shared/ProfilePicture';
import Enter from '../components/shared/Enter';
import { DUMMY_FIELDS } from '../DATA';

const { height } = Dimensions.get('window');

const FinishRegistration = () => {
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const isFormValid =
    username.length > 3 && imageUri && birthDate ? true : false;
  const { completeRegistration } = useAuth();

  const { data: locationData, isLoading: isLocationLoading } =
    useGetCityAndCountry(
      coordinates?.latitude ?? null,
      coordinates?.longitude ?? null,
    );

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
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
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
    if (!isFormValid || !imageUri || !birthDate || !coordinates) return;

    try {
      const currentUid = storage.getString(STORAGE_KEYS.USER_UID);
      if (!currentUid) throw new Error('No User UID found');

      const isTaken = await checkUsernameAvailability(username);

      if (isTaken) {
        setUsernameTaken(true);
        return;
      }

      const downloadUrl = await uploadProfileImage(imageUri, currentUid);

      await createUserProfile({
        uid: currentUid,
        username: username,
        profilePicture: downloadUrl,
        dateOfBirth: birthDate.getTime(),
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
        location: locationDisplayText,
        registrationForm: DUMMY_FIELDS,
      });

      completeRegistration();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Check console.');
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
          isTaken={usernameTaken}
        />
        <DateInput date={birthDate} onChange={setBirthDate} title="Birthday" />
        <Enter onPress={onPress} isFormValid={isFormValid} />
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
