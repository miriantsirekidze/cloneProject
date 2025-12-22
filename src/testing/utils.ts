import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo'; 
import { CountryApiResponse } from './types';

const BASE_URL = Config.BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleRequest = async (config: InternalAxiosRequestConfig) => {
  const state = await NetInfo.fetch();

  console.log("INTERCEPTOR: Internet Status:", state.isConnected);
  if (!state.isConnected) {
    Toast.show({
      type: 'error',
      text1: 'No Internet Connection',
    });
    throw new Error('No Internet Connection');
  }

  return config;
};

const handleResponseSuccess = (response: AxiosResponse) => {
  Toast.show({
    type: 'success',
    text1: 'Successfuly fetched',
    visibilityTime: 5000,
  });

  return response;
};

const handleResponseError = (error: any) => {
  const message =
    error.response?.data?.message || error.message || 'Unknown Error';

  Toast.show({
    type: 'error',
    text1: 'Request Failed',
    text2: message,
    visibilityTime: 4000,
  });

  return Promise.reject(error || new Error(message));
};

instance.interceptors.request.use(handleRequest, error =>
  Promise.reject(error),
);
instance.interceptors.response.use(handleResponseSuccess, handleResponseError);

const getAPIResponse = async <T>(url: string): Promise<T> => {
  const response = await instance.get<T>(url);
  return response.data;
};

export const getCountries = async (): Promise<CountryApiResponse> => {
  const endpoint = Config.API_ENDPOINT;

  if (!endpoint) {
    throw new Error('API_ENDPOINT is missing in .env');
  }

  const data = await getAPIResponse<CountryApiResponse>(endpoint);
  return data;
};
