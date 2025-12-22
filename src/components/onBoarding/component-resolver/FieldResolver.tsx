import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
  Controller,
  Control,
  FieldErrors,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import { FieldItem } from '../../../types';
import { getRecursiveDefaults } from '../../../utils/zod/formHelpers';
import Ionicons from '@react-native-vector-icons/ionicons';

import TextField from '../TextField';
import MultiCheckBox from '../MultiCheckBox';
import Selector from '../option-picker/Selector';
import DatePick from '../DatePick';
import RadioGroup from '../RadioGroup';
import DynamicHeader from '../DynamicHeader';
import FilePicker from '../file-picker/FilePicker';

interface Props {
  field: FieldItem;
  control: Control<any>;
  errors: FieldErrors<any>;
  trigger: any;
  parentPath?: string;
  disabled?: boolean;
  defaultValue?: any;
  conditionalFields?: Record<string, any>;
}

const StaticGroup = ({
  field,
  control,
  errors,
  basePath,
  trigger,
}: {
  field: FieldItem;
  control: any;
  errors: any;
  basePath: string;
  trigger: any;
}) => (
  <View style={styles.card}>
    <Text style={styles.title}>{field.label}</Text>
    {field.fields?.map((child, index) => (
      <FieldResolver
        key={index}
        field={child}
        trigger={trigger}
        control={control}
        errors={errors}
        parentPath={basePath}
      />
    ))}
  </View>
);

const RepeatableGroup = ({
  field,
  control,
  errors,
  trigger,
  basePath,
}: {
  field: FieldItem;
  control: any;
  errors: any;
  trigger: any;
  basePath: string;
}) => {
  const [lastItemSubmitted, setLastItemSubmitted] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: basePath,
  });

  const handleSubmit = async () => {
    const currentIndex = fields.length - 1;
    const isValid = await trigger(`${basePath}.${currentIndex}`);
    if (isValid) {
      setLastItemSubmitted(true);
    }
  };

  const handleAddAnother = () => {
    append(getRecursiveDefaults(field.fields || []));
    setLastItemSubmitted(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{field.label}</Text>

      {fields.map((item, index) => {
        const isActive = index === fields.length - 1 && !lastItemSubmitted;

        return (
          <View key={item.id} style={styles.itemContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{index + 1}.</Text>
              {index > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    remove(index);
                    if (index === fields.length - 1 && fields.length > 1) {
                      setLastItemSubmitted(false);
                    }
                  }}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash" size={22} color="white" />
                </TouchableOpacity>
              )}
            </View>

            {field.fields?.map((child, childIndex) => (
              <FieldResolver
                key={childIndex}
                field={child}
                trigger={trigger}
                control={control}
                errors={errors}
                parentPath={`${basePath}.${index}`}
                disabled={!isActive}
              />
            ))}
          </View>
        );
      })}

      {!lastItemSubmitted ? (
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
          <Ionicons
            name="arrow-forward"
            size={22}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleAddAnother} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Another</Text>
          <Ionicons name="add" size={22} color="white" style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const FieldResolver = ({
  field,
  control,
  errors,
  trigger,
  parentPath = '',
  disabled = false,
  defaultValue,
}: Props) => {
  let requiredValues: any[] = [];
  let dependencyKeys: string[] = [];
  let depPaths: string[] = [];

  if (field.conditionalFields) {
    dependencyKeys = Object.keys(field.conditionalFields);
    requiredValues = Object.values(field.conditionalFields);

    depPaths = dependencyKeys.map(key =>
      parentPath ? `${parentPath}.${key}` : key,
    );
  }

  const watchedValues = useWatch({
    control,
    name: depPaths,
  });

  if (field.conditionalFields) {
    const conditionsMet = requiredValues.every((requiredValue, index) => {
      const watchedValue = watchedValues[index];

      if (requiredValue.startsWith('!')) {
        const actualRequiredValue = requiredValue.slice(1);
        return watchedValue !== actualRequiredValue;
      }

      return watchedValue === requiredValue;
    });

    if (!conditionsMet) {
      return null;
    }
  }

  const fullName = parentPath
    ? `${parentPath}.${field.fieldName}`
    : field.fieldName;

  if (field.fieldType === 'GROUP') {
    if (field.isRepeatable) {
      return (
        <RepeatableGroup
          field={field}
          trigger={trigger}
          control={control}
          errors={errors}
          basePath={fullName}
        />
      );
    }
    return (
      <StaticGroup
        field={field}
        trigger={trigger}
        control={control}
        errors={errors}
        basePath={fullName}
      />
    );
  }

  if (field.fieldType === 'HEADER') {
    return (
      <View style={styles.container}>
        <DynamicHeader label={field.label} fieldName={field.fieldName} />
      </View>
    );
  }

  return (
    <Controller
      control={control}
      name={fullName}
      defaultValue={defaultValue}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          {field.fieldType === 'TEXT' && (
            <TextField
              label={field.label}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              isRequired={field.isRequired || false}
              error={error?.message}
              disabled={disabled}
              trigger={trigger}
              fieldName={fullName}
            />
          )}
          {field.fieldType === 'MULTI_CHECKBOX' && (
            <MultiCheckBox
              label={field.label}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={error?.message}
              options={field.fieldOptions || []}
              isRequired={field.isRequired || false}
              disabled={disabled}
            />
          )}
          {field.fieldType === 'SELECT' && (
            <Selector
              label={field.label}
              options={field.fieldOptions || []}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              isRequired={field.isRequired || false}
              error={error?.message}
              disabled={disabled}
            />
          )}
          {field.fieldType === 'DATE' && (
            <DatePick
              label={field.label}
              value={value}
              onChange={onChange}
              isRequired={field.isRequired || false}
              onBlur={onBlur}
              error={error?.message}
              disabled={disabled}
            />
          )}
          {field.fieldType === 'RADIO' && (
            <RadioGroup
              label={field.label}
              options={field.fieldOptions || []}
              value={value}
              onChange={onChange}
              isRequired={field.isRequired || false}
              error={error?.message}
              onBlur={onBlur}
              disabled={disabled}
            />
          )}
          {field.fieldType === 'FILE' && (
            <FilePicker
              label={field.label}
              onChange={onChange}
              value={value}
              isRequired={field.isRequired || false}
              error={error?.message}
              onBlur={onBlur}
              disabled={disabled}
            />
          )}
        </View>
      )}
    />
  );
};

export default FieldResolver;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  error: {
    color: 'red',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  title: { fontWeight: 'bold', marginBottom: 10 },
  itemContainer: {
    marginBottom: 15,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: 'blue',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#52d',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#52e',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 5,
  },
});
