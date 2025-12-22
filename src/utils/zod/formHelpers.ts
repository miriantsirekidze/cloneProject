import { z } from 'zod';
import { FieldItem } from '../../types';

const shouldShowField = (
  field: FieldItem,
  formData: Record<string, any>,
  parentPath: string = '',
): boolean => {
  if (!field.conditionalFields) return true;

  return Object.entries(field.conditionalFields).every(
    ([key, requiredValue]) => {
      const fullPath = parentPath ? `${parentPath}.${key}` : key;
      const watchedValue = getNestedValue(formData, fullPath);

      if (typeof requiredValue === 'string' && requiredValue.startsWith('!')) {
        const actualRequiredValue = requiredValue.slice(1);
        return watchedValue !== actualRequiredValue;
      }

      return watchedValue === requiredValue;
    },
  );
};

const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const createRecursiveSchema = (
  fields: FieldItem[],
  parentPath: string = '',
): z.ZodType<any> => {
  const shape: Record<string, any> = {};

  fields.forEach(field => {
    if (!field.fieldName || field.fieldType === 'HEADER') return;

    if (field.fieldType === 'GROUP') {
      const currentPath = parentPath
        ? `${parentPath}.${field.fieldName}`
        : field.fieldName;
      const childSchema = createRecursiveSchema(
        field.fields || [],
        currentPath,
      );

      if (field.isRepeatable) {
        shape[field.fieldName] = z
          .array(childSchema)
          .min(1, 'Add at least one item');
      } else {
        shape[field.fieldName] = childSchema;
      }
      return;
    }

    if (field.conditionalFields) {
      if (field.fieldType === 'MULTI_CHECKBOX') {
        shape[field.fieldName] = z.array(z.string()).optional().default([]);
      } else {
        shape[field.fieldName] = z.string().optional().default('');
      }
      return;
    }

    if (field.fieldType === 'MULTI_CHECKBOX') {
      const arraySchema = z.array(z.string());
      if (field.isRequired) {
        shape[field.fieldName] = arraySchema.min(
          1,
          'Select at least one option',
        );
      } else {
        shape[field.fieldName] = arraySchema;
      }
      return;
    }

    if (field.fieldType === 'FILE') {
      const fileObjectSchema = z.object({
        uri: z.string(),
        name: z.string(),
        type: z.enum(['image', 'document']),
        size: z.number().optional(),
        id: z.string().optional(),
      });

      const fileValueSchema = z.union([fileObjectSchema, z.string()]);

      const fileArraySchema = z.array(fileValueSchema);

      if (field.isRequired) {
        shape[field.fieldName] = fileArraySchema.min(
          1,
          'Please select at least one file',
        );
      } else {
        shape[field.fieldName] = fileArraySchema;
      }
      return;
    }

    let baseSchema = z.string();

    if (field.validationRule) {
      const { regex, minLength, maxLength } = field.validationRule;

      if (regex) {
        try {
          baseSchema = baseSchema.regex(new RegExp(regex), 'Invalid format');
        } catch (e) {
          console.warn(`Invalid Regex for ${field.fieldName}: ${regex}` + e);
        }
      }

      if (minLength) {
        baseSchema = baseSchema.min(
          minLength,
          `Minimum ${minLength} characters`,
        );
      }

      if (maxLength) {
        baseSchema = baseSchema.max(
          maxLength,
          `Maximum ${maxLength} characters`,
        );
      }
    }

    if (field.isRequired) {
      shape[field.fieldName] = baseSchema.min(1, 'Required field');
    } else {
      shape[field.fieldName] = baseSchema.optional().or(z.literal(''));
    }
  });

  const baseSchema = z.object(shape);

  const conditionalFields = fields.filter(
    f => f.conditionalFields && f.fieldName,
  );

  if (conditionalFields.length === 0) {
    return baseSchema;
  }

  return baseSchema.superRefine((data, ctx) => {
    conditionalFields.forEach(field => {
      const shouldShow = shouldShowField(field, data, parentPath);

      if (shouldShow && field.isRequired) {
        const value = data[field.fieldName];

        if (field.fieldType === 'MULTI_CHECKBOX') {
          if (!value || !Array.isArray(value) || value.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Select at least one option',
              path: [field.fieldName],
            });
          }
        } else {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Required field',
              path: [field.fieldName],
            });
          }
        }
      }
    });
  });
};

export const mergeValuesToObject = (
  schema: FieldItem[],
  answers: any,
): FieldItem[] => {
  const copiedSchema = JSON.parse(JSON.stringify(schema));
  console.log(copiedSchema);
  return copiedSchema.map((field: FieldItem) => {
    const fieldName = field.fieldName;

    if (fieldName && answers[fieldName] !== undefined) {
      if (field.isRepeatable && Array.isArray(answers[fieldName])) {
        field.value = answers[fieldName];
      } else if (field.fields) {
        field.fields = mergeValuesToObject(field.fields, answers[fieldName]);
      } else {
        field.value = answers[fieldName];
      }
    }

    return field;
  });
};

export const getRecursiveDefaults = (fields: FieldItem[]) => {
  const defaults: Record<string, any> = {};

  fields.forEach(field => {
    if (!field.fieldName) return;

    if (field.fieldType === 'GROUP') {
      if (field.isRepeatable) {
        if (field.value && Array.isArray(field.value)) {
          defaults[field.fieldName] = field.value;
        } else {
          const childDefaults = getRecursiveDefaults(field.fields || []);
          defaults[field.fieldName] = [childDefaults];
        }
      } else {
        const childDefaults = getRecursiveDefaults(field.fields || []);
        defaults[field.fieldName] = childDefaults;
      }
    } else {
      if (field.fieldType === 'MULTI_CHECKBOX') {
        if (Array.isArray(field.value)) {
          defaults[field.fieldName] = field.value;
        } else if (field.value) {
          defaults[field.fieldName] = [field.value.toString()];
        } else {
          defaults[field.fieldName] = [];
        }
      } else if (field.fieldType === 'FILE') {
        // FILE fields expect an array of FileObject, default to empty array
        if (Array.isArray(field.value)) {
          defaults[field.fieldName] = field.value;
        } else {
          defaults[field.fieldName] = [];
        }
      } else {
        defaults[field.fieldName] = field.value || '';
      }
    }
  });
  return defaults;
};
