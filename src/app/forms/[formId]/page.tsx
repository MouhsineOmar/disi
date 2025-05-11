'use client';

import { useEffect, useState } from 'react';
import { FormRenderer } from '@/components/forms/FormRenderer';
import { getFormById } from '@/lib/form-store';
import type { Form } from '@/types';
import { Loader2, AlertTriangle, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PublishedFormPage({ params }: { params: { formId: string } }) {
  const [form, setForm] = useState<Form | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loadedForm = getFormById(params.formId);
      if (loadedForm) {
        if (loadedForm.publishedAt && loadedForm.publishedUrl) {
          setForm(loadedForm);
        } else {
          setError('This form is not currently published or accessible.');
        }
      } else {
        setError('Form not found. It might have been deleted or the link is incorrect.');
      }
    } catch (e) {
      console.error("Error loading published form:", e);
      setError('Failed to load form data.');
    } finally {
      setLoading(false);
    }
  }, [params.formId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading Form...</p>
      </div>
    );
  }
  
  if (error || !form) {
    const isUnpublished = error && error.includes('not currently published');
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
        {isUnpublished ? 
            <Lock className="h-16 w-16 text-yellow-500 mb-4" /> : 
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        }
        <h2 className={`text-2xl font-semibold mb-2 ${isUnpublished ? 'text-yellow-600' : 'text-destructive'}`}>
          {isUnpublished ? 'Form Not Published' : 'Error Loading Form'}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error || 'The form you are trying to access is unavailable.'}
        </p>
        <Button asChild variant="outline">
          <Link href="/">Visit Free Forms</Link>
        </Button>
      </div>
    );
  }
  

  return (
    <div className="py-8">
      <FormRenderer form={form} isPreview={false} />
    </div>
  );
}
