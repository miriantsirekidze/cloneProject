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

const getFileName = (name: string, uri: string) => {
  if (name) return name;
  return uri.split('/').pop() || 'file';
};

export const uploadFile = async (
  uri: string,
  uid: string,
  originalName?: string,
): Promise<string> => {
  try {
    let uploadUri = uri;

    if (Platform.OS === 'android') {
      if (
        uploadUri.startsWith('file://') &&
        !uploadUri.startsWith('content://')
      ) {
        uploadUri = `file://${uploadUri}`;
      }
    }

    console.log(uploadUri);

    const cleanName = getFileName(originalName || '', uri).replace(
      /[^a-zA-Z0-9.]/g,
      '_',
    );
    const uniqueName = `${Date.now()}_${cleanName}`;

    const reference = storage().ref(`files/${uid}/${uniqueName}`);

    await reference.putFile(uploadUri);

    const url = await reference.getDownloadURL();
    return url;
  } catch (error) {
    console.error(`File upload failed for ${uri}:`, error);
    throw error;
  }
};
