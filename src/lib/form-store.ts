import type { Form } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed or use crypto.randomUUID

const FORMS_STORAGE_KEY = 'firebaseForms_forms';

const isBrowser = typeof window !== 'undefined';

// Helper for UUID if uuid package is not available/allowed
const generateId = (): string => {
  if (isBrowser && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Basic fallback (consider a more robust polyfill or allow uuid package)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


export const getAllForms = (): Form[] => {
  if (!isBrowser) return [];
  const formsJson = localStorage.getItem(FORMS_STORAGE_KEY);
  return formsJson ? JSON.parse(formsJson) : [];
};

export const getFormById = (id: string): Form | undefined => {
  if (!isBrowser) return undefined;
  const forms = getAllForms();
  return forms.find(form => form.id === id);
};

export const saveForm = (form: Partial<Form> & { id?: string }): Form => {
  if (!isBrowser) throw new Error("localStorage is not available.");
  const forms = getAllForms();
  const now = new Date().toISOString();

  if (form.id) {
    // Update existing form
    const index = forms.findIndex(f => f.id === form.id);
    if (index > -1) {
      forms[index] = { ...forms[index], ...form, updatedAt: now } as Form;
    } else {
      // If ID provided but not found, treat as new (or throw error)
      const newForm: Form = {
        id: form.id,
        title: form.title || 'Untitled Form',
        fields: form.fields || [],
        createdAt: now,
        updatedAt: now,
        ...form,
      } as Form;
      forms.push(newForm);
    }
  } else {
    // Create new form
    const newForm: Form = {
      id: generateId(),
      title: form.title || 'Untitled Form',
      description: form.description || '',
      fields: form.fields || [],
      createdAt: now,
      updatedAt: now,
      ...form,
    } as Form;
    forms.push(newForm);
    form = newForm; // Update the passed form object with new ID and timestamps
  }

  localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
  return form as Form; // Return the saved/updated form
};

export const deleteForm = (id: string): void => {
  if (!isBrowser) return;
  let forms = getAllForms();
  forms = forms.filter(form => form.id !== id);
  localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
};

export const publishForm = (id: string): Form | undefined => {
  if (!isBrowser) return undefined;
  const form = getFormById(id);
  if (form) {
    form.publishedAt = new Date().toISOString();
    form.publishedUrl = `${window.location.origin}/forms/${form.id}`;
    saveForm(form);
    return form;
  }
  return undefined;
};

export const unpublishForm = (id: string): Form | undefined => {
  if (!isBrowser) return undefined;
  const form = getFormById(id);
  if (form) {
    form.publishedAt = undefined;
    form.publishedUrl = undefined;
    saveForm(form);
    return form;
  }
  return undefined;
};
