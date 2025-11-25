import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';

export const uploadProfileImage = async (
  uri: string,
  uid: string,
): Promise<string> => {
  try {
    const uploadUri =
      Platform.OS === 'android' && !uri.startsWith('file://')
        ? `file://${uri}`
        : uri;

    const reference = storage().ref(`profile_pictures/${uid}`);

    const task = reference.putFile(uploadUri);

    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
    });

    await task;
    const url = await reference.getDownloadURL();
    return url;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};
