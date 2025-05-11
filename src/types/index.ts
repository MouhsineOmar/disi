export interface FormFieldOption {
  id: string;
  label: string;
  value: string;
}

export type FormFieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio';

export interface FormField {
  id: string; // UUID
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[]; // For select, radio, checkbox group
  defaultValue?: string | number | boolean | string[];
}

export interface Form {
  id: string; // UUID
  title: string;
  description?: string;
  projectNotes?: string; // Added for blocnote
  fields: FormField[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt?: string; // ISO date string
  publishedUrl?: string; // Unique URL for published form
}

export interface FormSubmission {
  id: string; // UUID
  formId: string;
  submittedAt: string; // ISO date string
  data: Record<string, any>; // Field ID -> Value
}
