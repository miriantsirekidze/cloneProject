import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { storage, STORAGE_KEYS } from './store';

interface AuthResponse {
  success: boolean;
  error?: string;
  isNewUser?: boolean; 
}

const auth = getAuth();

GoogleSignin.configure({
  webClientId:
    '806721023668-cgmknf9k5ifimv6lpqsh3eeeh03efuh3.apps.googleusercontent.com',
});

export const loginWithEmail = async (
  email: string,
  pass: string,
): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    storage.set(STORAGE_KEYS.USER_UID, user.uid);
    storage.set(STORAGE_KEYS.AUTH_TYPE, 'email');

    return { success: true };
  } catch (error: any) {
    let errorMessage = 'Something went wrong';
    if (error.code === 'auth/invalid-email') errorMessage = 'Email address is invalid!';
    if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
    if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
    return { success: false, error: errorMessage };
  }
};

export const signUpWithEmail = async (
  email: string,
  pass: string,
): Promise<AuthResponse> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    storage.set(STORAGE_KEYS.USER_UID, user.uid);
    storage.set(STORAGE_KEYS.AUTH_TYPE, 'email');

    return { success: true };
  } catch (error: any) {
    let errorMessage = 'Something went wrong';
    if (error.code === 'auth/email-already-in-use') errorMessage = 'That email address is already in use!';
    if (error.code === 'auth/invalid-email') errorMessage = 'That email address is invalid!';
    return { success: false, error: errorMessage };
  }
};

export const passwordRecovery = async (
  email: string,
): Promise<AuthResponse> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    let errorMessage = 'Something went wrong';
    if (error.code === 'auth/invalid-email') errorMessage = 'That email address is invalid!';
    if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
    return { success: false, error: errorMessage };
  }
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const signInResult = await GoogleSignin.signIn();
    let idToken = signInResult.data?.idToken;

    if (!idToken) throw new Error('No ID Token found');

    const googleCredential = GoogleAuthProvider.credential(idToken);

    const userCredential = await signInWithCredential(auth, googleCredential);
    const user = userCredential.user;

    const isNewUser = userCredential.additionalUserInfo?.isNewUser ?? false;

    storage.set(STORAGE_KEYS.USER_UID, user.uid);
    storage.set(STORAGE_KEYS.AUTH_TYPE, 'google');

    return { success: true, isNewUser }; 
    
  } catch (error: any) {
    let errorMessage = 'Google Sign-In failed';

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      errorMessage = 'User cancelled the login flow';
    } else if (error.code === statusCodes.IN_PROGRESS) {
      errorMessage = 'Sign in is already in progress';
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      errorMessage = 'Play services not available or outdated';
    } else {
      errorMessage = error.message || errorMessage;
    }

    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  storage.remove(STORAGE_KEYS.USER_UID);
  storage.remove(STORAGE_KEYS.AUTH_TYPE);
};