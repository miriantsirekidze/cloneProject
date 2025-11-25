import database from '@react-native-firebase/database';

interface DataProps {
  key: string;
  username: string;
  profilePicture: string;
  dateOfBirth: string;
  coordinates: [number, number];
  location: string;
}

export const addData = async ({
  key,
  username,
  profilePicture,
  dateOfBirth,
  coordinates,
  location,
}: DataProps) => {
  try {
    await database().ref(`/users/${key}`).set({
      username,
      profilePicture,
      dateOfBirth,
      coordinates,
      location,
      timestamp: database.ServerValue.TIMESTAMP
    });
  } catch (error) {
    console.log(error);
  }
};

export const getData = () => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const updateData = () => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const removeData = () => {
  try {
  } catch (error) {
    console.log(error);
  }
};
