import {
  getDatabase,
  ref,
  get,
  update,
  serverTimestamp,
} from '@react-native-firebase/database';

const DATABASE_URL =
  'https://cloneproject-0000-default-rtdb.europe-west1.firebasedatabase.app';

const db = getDatabase(undefined, DATABASE_URL);

export const checkUsernameAvailability = async (
  username: string,
): Promise<boolean> => {
  try {
    const normalizedUser = username.toLowerCase();

    const usernameRef = ref(db, `/usernames/${normalizedUser}`);

    const snapshot = await get(usernameRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
};

interface UserProfileData {
  uid: string;
  username: string;
  profilePicture: string;
  dateOfBirth: number;
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  location: string;
}

export const createUserProfile = async (data: UserProfileData) => {
  try {
    const normalizedUsername = data.username.toLowerCase();

    const updates: any = {};

    updates[`/users/${data.uid}`] = {
      username: data.username,
      profilePicture: data.profilePicture,
      dateOfBirth: data.dateOfBirth,
      coordinates: data.coordinates,
      location: data.location,
      createdAt: serverTimestamp(),
    };

    updates[`/usernames/${normalizedUsername}`] = data.uid;

    const rootRef = ref(db);
    await update(rootRef, updates);
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
