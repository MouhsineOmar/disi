
'use client';

import { useEffect, useState } from 'react';
import { FormRenderer } from '@/components/forms/FormRenderer';
import { getFormById } from '@/lib/form-store';
import type { Form } from '@/types';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';
import { LottieAnimation } from '@/components/common/LottieAnimation';

export default function PreviewFormPage({ params }: { params: { formId: string } }) {
  const auth = useAuth();
  const [form, setForm] = useState<Form | undefined>(undefined);
  const [isFormDataLoading, setIsFormDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
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
      setIsFormDataLoading(false);
    }
  }, [params.formId, auth.isAuthenticated, auth.isLoading]);

  if (auth.isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-15rem)]">
        <LottieAnimation
          animationPath="https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json"
          width={150}
          height={150}
          message="Loading Preview..."
          data-ai-hint="loading animation"
        />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-15rem)]">
        <LottieAnimation
          animationPath="https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json"
          width={150}
          height={150}
          message="Redirecting to login..."
          data-ai-hint="loading animation"
        />
      </div>
    );
  }

  if (isFormDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <LottieAnimation
          animationPath="https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json"
          width={120}
          height={120}
          message="Loading Form Preview Data..."
          data-ai-hint="loading animation"
        />
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
