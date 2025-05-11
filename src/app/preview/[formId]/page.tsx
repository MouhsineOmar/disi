'use client';

import { useEffect, useState } from 'react';
import { FormRenderer } from '@/components/forms/FormRenderer';
import { getFormById } from '@/lib/form-store';
import type { Form } from '@/types';
import { Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';

export default function PreviewFormPage({ params }: { params: { formId: string } }) {
  const auth = useAuth();
  const [form, setForm] = useState<Form | undefined>(undefined);
  const [isFormDataLoading, setIsFormDataLoading] = useState(true); // Specific to form data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) { // Only load if authenticated
      try {
        const loadedForm = getFormById(params.formId);
        if (loadedForm) {
          setForm(loadedForm);
        } else {
          setError('Form not found. It might have been deleted or the ID is incorrect.');
        }
      } catch (e) {
        console.error("Error loading form for preview:", e);
        setError('Failed to load form data.');
      } finally {
        setIsFormDataLoading(false);
      }
    } else if (!auth.isLoading && !auth.isAuthenticated) {
      setIsFormDataLoading(false); // AuthProvider handles redirect
    }
  }, [params.formId, auth.isAuthenticated, auth.isLoading]);

  if (auth.isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Loading Preview...</span></div>;
  }

  if (!auth.isAuthenticated) {
     return <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Redirecting to login...</span></div>;
  }

  if (isFormDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading Form Preview Data...</p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Error Loading Form</h2>
        <p className="text-muted-foreground mb-6">{error || 'The form could not be loaded.'}</p>
        <Button asChild variant="outline">
          <Link href="/">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8 text-center">
         <Button asChild variant="outline" className="mb-4">
            <Link href={`/builder/${form.id}`}>Back to Editor</Link>
        </Button>
        <h1 className="text-3xl font-bold">Form Preview</h1>
        <p className="text-muted-foreground">This is how your form <span className="font-semibold text-primary">{form.title}</span> will look.</p>
      </div>
      <FormRenderer form={form} isPreview={true} />
    </div>
  );
}
