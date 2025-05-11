
'use client';

import { FormBuilderClient } from '@/components/forms/FormBuilderClient';
import { getFormById } from '@/lib/form-store';
import type { Form } from '@/types';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { LottieAnimation } from '@/components/common/LottieAnimation';

export default function EditFormPage({ params }: { params: { formId: string } }) {
  const auth = useAuth();
  const [initialForm, setInitialForm] = useState<Form | undefined>(undefined);
  const [isFormDataLoading, setIsFormDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
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
          message="Loading Editor..."
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
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <LottieAnimation
          animationPath="https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json"
          width={120} // Slightly smaller for content area loading
          height={120}
          message="Loading Form Data..."
          data-ai-hint="loading animation"
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-destructive text-xl">{error}</div>;
  }
  
  if (!initialForm && !isFormDataLoading) {
     return <div className="text-center py-10 text-destructive text-xl">Form with ID {params.formId} not found.</div>;
  }

  return (
    <div>
      <FormBuilderClient initialForm={initialForm} />
    </div>
  );
}
