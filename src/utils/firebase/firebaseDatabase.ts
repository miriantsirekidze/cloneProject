import {
  getDatabase,
  ref,
  get,
  update,
  serverTimestamp,
} from '@react-native-firebase/database';
import { mergeValuesToObject } from '../zod/formHelpers';
import { storage, STORAGE_KEYS } from '../store';

const DATABASE_URL =
  'https://cloneproject-0000-default-rtdb.europe-west1.firebasedatabase.app';

const db = getDatabase(undefined, DATABASE_URL);
const rootRef = ref(db);
const uid = storage.getString(STORAGE_KEYS.USER_UID);

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
  registrationForm: any;
}

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
      registrationForm: data,
    };

    updates[`/usernames/${normalizedUsername}`] = data.uid;

    await update(rootRef, updates);
  } catch (error) {
    console.log(error);
  }
};

export const uploadFormData = async (fieldsStructure: any, formData: any) => {
  try {
    const fullForm = mergeValuesToObject(fieldsStructure, formData);

    const updates: any = {};

    updates[`users/${uid}/registrationForm`] = fullForm;

    await update(rootRef, updates);
  } catch (error) {
    console.error('Firebase Error:', error);
    throw error;
  }
};

export const fetchRegistrationForm = async () => {
  const snapshot = await get(ref(db, `users/${uid}/registrationForm`));

  if (!snapshot.exists()) {
    throw new Error('Form not found');
  }

  return snapshot.val();
};
