'use client'; // This page might need to be client if getFormById runs on client

import { FormBuilderClient } from '@/components/forms/FormBuilderClient';
import { getFormById } from '@/lib/form-store'; // Assuming this can run client-side or data is fetched here
import type { Form } from '@/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// This is a server component that fetches initial data if possible,
// but FormBuilderClient handles client-side interactions and fetching if needed.
export default function EditFormPage({ params }: { params: { formId: string } }) {
  // If getFormById can only run client-side, FormBuilderClient will handle fetching.
  // For this example, we'll pass undefined and let FormBuilderClient fetch.
  // If it were a server-side fetch:
  // const form = getFormById(params.formId); // This would need to be adapted if store is client-only
  
  const [initialForm, setInitialForm] = useState<Form | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = () => {
      try {
        const form = getFormById(params.formId);
        if (form) {
          setInitialForm(form);
        } else {
          setError("Form not found.");
        }
      } catch (e) {
        setError("Failed to load form.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [params.formId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Loading Form...</span></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive text-xl">{error}</div>;
  }
  
  // If form is not found after loading (and no error from getFormById directly),
  // initialForm will be undefined, FormBuilderClient might handle this or redirect.
  if (!initialForm && !loading) {
     return <div className="text-center py-10 text-destructive text-xl">Form with ID {params.formId} not found.</div>;
  }


  return (
    <div>
      <FormBuilderClient initialForm={initialForm} />
    </div>
  );
}
