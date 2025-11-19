import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV()

export const STORAGE_KEYS = {
  USER_UID: 'user.uid',
  AUTH_TYPE: 'auth.type'
}