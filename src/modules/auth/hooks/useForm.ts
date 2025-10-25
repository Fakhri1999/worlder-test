import { useCallback, useRef } from 'react';

export type FormField<T> = {
  [K in keyof T]: React.RefObject<HTMLInputElement>;
};

export type FormMethods<T> = {
  refs: FormField<T>;
  getFormData: () => T;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: string) => void;
};

export function useForm<T extends Record<string, string>>(
  fields: Array<keyof T>,
): FormMethods<T> {
  const refs = fields.reduce((acc, field) => {
    acc[field] = useRef<HTMLInputElement>(null);
    return acc;
  }, {} as FormField<T>);

  const getFormData = useCallback((): T => {
    return fields.reduce((acc, field) => {
      const ref = refs[field];
      acc[field] = (ref.current?.value || '') as T[keyof T];
      return acc;
    }, {} as T);
  }, [fields, refs]);

  const resetForm = useCallback(() => {
    fields.forEach((field) => {
      const ref = refs[field];
      if (ref.current) {
        ref.current.value = '';
      }
    });
  }, [fields, refs]);

  const setFieldValue = useCallback(
    (field: keyof T, value: string) => {
      const ref = refs[field];
      if (ref.current) {
        ref.current.value = value;
      }
    },
    [refs],
  );

  return {
    refs,
    getFormData,
    resetForm,
    setFieldValue,
  };
}
