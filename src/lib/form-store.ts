import type { Form } from '@/types';
// import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed or use crypto.randomUUID - Using crypto.randomUUID directly

const FORMS_STORAGE_KEY = 'firebaseForms_forms';

const isBrowser = typeof window !== 'undefined';

// Helper for UUID
const generateId = (): string => {
  if (isBrowser && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Basic fallback
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
  let finalFormId: string;

  if (form.id) {
    finalFormId = form.id;
    const index = forms.findIndex(f => f.id === form.id);
    if (index > -1) {
      forms[index] = { 
        ...forms[index], 
        ...form, 
        // projectNotes is handled by spreading ...form after ...forms[index]
        // If form.projectNotes is undefined, forms[index].projectNotes will persist.
        // If form.projectNotes is a string (even empty), it will overwrite.
        updatedAt: now 
      } as Form;
    } else {
      // If ID provided but not found, treat as new with this ID
      const newFormWithGivenId: Form = {
        id: form.id, // Use provided ID
        title: form.title || 'Untitled Form',
        description: form.description || '',
        projectNotes: form.projectNotes || '', // Initialize if not present
        fields: form.fields || [],
        createdAt: form.createdAt || now, // Preserve original createdAt if available, else use now
        updatedAt: now,
        ...form, // Spread the rest, this will correctly set projectNotes if it's in form
      } as Form; // Cast as Form is needed as `form` is Partial
      forms.push(newFormWithGivenId);
    }
  } else {
    // Create new form
    const newForm: Form = {
      id: generateId(),
      title: form.title || 'Untitled Form',
      description: form.description || '',
      projectNotes: form.projectNotes || '', // Initialize if not present
      fields: form.fields || [],
      createdAt: now,
      updatedAt: now,
      ...form, // Spread the rest
    } as Form; // Cast as Form
    forms.push(newForm);
    finalFormId = newForm.id;
  }

  localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
  
  // Retrieve the form from the updated list to ensure we return the complete, stored object
  const savedForm = forms.find(f => f.id === finalFormId);
  if (!savedForm) {
    // This should ideally not happen if logic is correct
    console.error("Failed to retrieve saved form from store immediately after saving. Form ID:", finalFormId, "Current form data:", form);
    throw new Error("Failed to retrieve saved form from store.");
  }
  return savedForm;
};

export const deleteForm = (id: string): void => {
  if (!isBrowser) return;
  let forms = getAllForms();
  forms = forms.filter(form => form.id !== id);
  localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
};

export const publishForm = (id: string): Form | undefined => {
  if (!isBrowser) return undefined;
  const formToPublish = getFormById(id);
  if (formToPublish) {
    formToPublish.publishedAt = new Date().toISOString();
    formToPublish.publishedUrl = `${window.location.origin}/forms/${formToPublish.id}`;
    return saveForm(formToPublish); // saveForm will handle updatedAt and preserve projectNotes
  }
  return undefined;
};

export const unpublishForm = (id: string): Form | undefined => {
  if (!isBrowser) return undefined;
  const formToUnpublish = getFormById(id);
  if (formToUnpublish) {
    formToUnpublish.publishedAt = undefined;
    formToUnpublish.publishedUrl = undefined;
    return saveForm(formToUnpublish); // saveForm will handle updatedAt and preserve projectNotes
  }
  return undefined;
};
