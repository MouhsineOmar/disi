'use client';

import { FormBuilderClient } from '@/components/forms/FormBuilderClient';
import { getFormById } from '@/lib/form-store';
import type { Form } from '@/types';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function EditFormPage({ params }: { params: { formId: string } }) {
  const auth = useAuth();
  const [initialForm, setInitialForm] = useState<Form | undefined>(undefined);
  const [isFormDataLoading, setIsFormDataLoading] = useState(true); // Specific to form data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) { // Only load if authenticated
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
          setIsFormDataLoading(false);
        }
      };
      loadForm();
    } else if (!auth.isLoading && !auth.isAuthenticated) {
      // AuthProvider handles redirect, set form data loading to false
      setIsFormDataLoading(false);
    }
    // If auth.isLoading, wait for auth state to resolve
  }, [params.formId, auth.isAuthenticated, auth.isLoading]);

  if (auth.isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Loading Editor...</span></div>;
  }

  if (!auth.isAuthenticated) {
     return <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Redirecting to login...</span></div>;
  }

  // Now, if authenticated, check form data loading state
  if (isFormDataLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Loading Form Data...</span></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive text-xl">{error}</div>;
  }
  
  if (!initialForm && !isFormDataLoading) { // Check after form data loading is complete
     return <div className="text-center py-10 text-destructive text-xl">Form with ID {params.formId} not found.</div>;
  }

  return (
    <div>
      <FormBuilderClient initialForm={initialForm} />
    </div>
  );
}
