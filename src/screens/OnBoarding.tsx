import React, { useMemo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { STORAGE_KEYS, storage } from '../utils/store';
import { processFormFiles } from '../components/onBoarding/file-picker/utils/fileFunctions';

import { DUMMY_FIELDS } from '../DATA';
import {
  createRecursiveSchema,
  getRecursiveDefaults,
} from '../utils/zod/formHelpers';
import {
  uploadFormData,
  fetchRegistrationForm,
} from '../utils/firebase/firebaseDatabase';

const uid = storage.getString(STORAGE_KEYS.USER_UID);

import FieldResolver from '../components/onBoarding/component-resolver/FieldResolver';
import Enter from '../components/shared/Enter';
import Header from '../components/onBoarding/Header';

const OnBoarding = () => {
  const {
    data: formFields,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['registrationForm'],
    queryFn: fetchRegistrationForm,
    staleTime: 5 * 60 * 1000,
  });

  const fields = formFields || DUMMY_FIELDS;

  const validationSchema = useMemo(() => {
    return createRecursiveSchema(fields);
  }, [fields]);

  const defaultValues = useMemo(() => {
    return getRecursiveDefaults(fields);
  }, [fields]);

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(validationSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (formFields) {
      const newDefaults = getRecursiveDefaults(formFields);
      reset(newDefaults);
    }
  }, [formFields, reset]);

  const onSubmit = async (data: any) => {
    try {
      const dataWithUrls = await processFormFiles(data, fields, uid);

      await uploadFormData(fields, dataWithUrls);

      Alert.alert('Success', 'Form submitted successfully!');
    } catch (err: any) {
      console.error('Submission failed:', err);
      Alert.alert('Error', err.message || 'Upload failed');
    }
  };

  const onError = (validationErrors: any) => {
    console.log('VALIDATION FAILED:', validationErrors);
    Alert.alert('Validation Error', 'Please check the red fields.');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading form...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load registration form</Text>
          <Text style={styles.errorSubtext}>
            {error instanceof Error ? error.message : 'Please try again later'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          onPress={Keyboard.dismiss}
          activeOpacity={1}
          style={styles.touchable}
        >
          {fields.map((field: any, index: number) => (
            <FieldResolver
              key={index}
              field={field}
              trigger={trigger}
              control={control}
              errors={errors}
              parentPath=""
            />
          ))}

          <View style={styles.buttonContainer}>
            <Enter
              onPress={handleSubmit(onSubmit, onError)}
              isFormValid={true}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 50,
    flexGrow: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
  },
  touchable: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
