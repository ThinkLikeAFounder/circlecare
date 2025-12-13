'use client';

import { useState, useCallback } from 'react';
import { ValidationError } from '@/lib/errors';

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule>>
) {
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFields: Record<keyof T, FormField> = {} as any;
    Object.keys(initialValues).forEach((key) => {
      initialFields[key as keyof T] = {
        value: initialValues[key as keyof T],
        touched: false,
      };
    });
    return initialFields;
  });

  const validateField = useCallback(
    (name: keyof T, value: any): string | null => {
      const rules = validationRules[name];
      if (!rules) return null;

      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return `${String(name)} is required`;
      }

      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          return `${String(name)} must be at least ${rules.minLength} characters`;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          return `${String(name)} must be no more than ${rules.maxLength} characters`;
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          return `${String(name)} format is invalid`;
        }
      }

      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [validationRules]
  );

  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      setFields((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error: validateField(name, value),
        },
      }));
    },
    [validateField]
  );

  const setFieldTouched = useCallback((name: keyof T, touched = true) => {
    setFields((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched,
        error: touched ? validateField(name, prev[name].value) : undefined,
      },
    }));
  }, [validateField]);

  const validateAll = useCallback(() => {
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(fields).forEach((key) => {
      const fieldKey = key as keyof T;
      const error = validateField(fieldKey, fields[fieldKey].value);
      if (error) {
        errors[fieldKey] = error;
        isValid = false;
      }
    });

    setFields((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        const fieldKey = key as keyof T;
        updated[fieldKey] = {
          ...updated[fieldKey],
          touched: true,
          error: errors[fieldKey],
        };
      });
      return updated;
    });

    return { isValid, errors };
  }, [fields, validateField]);

  const getValues = useCallback(() => {
    const values: Partial<T> = {};
    Object.keys(fields).forEach((key) => {
      values[key as keyof T] = fields[key as keyof T].value;
    });
    return values as T;
  }, [fields]);

  const reset = useCallback(() => {
    setFields(() => {
      const resetFields: Record<keyof T, FormField> = {} as any;
      Object.keys(initialValues).forEach((key) => {
        resetFields[key as keyof T] = {
          value: initialValues[key as keyof T],
          touched: false,
        };
      });
      return resetFields;
    });
  }, [initialValues]);

  return {
    fields,
    setFieldValue,
    setFieldTouched,
    validateAll,
    getValues,
    reset,
  };
}