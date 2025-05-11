'use client'; 

import { FormBuilderClient } from '@/components/forms/FormBuilderClient';
import { useAuth } from '@/components/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function CreateFormPage() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Loading Form Builder...</span></div>;
  }

  if (!auth.isAuthenticated) {
    // AuthProvider will redirect, this is a fallback or for the brief moment before redirect
     return <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> <span className="ml-4 text-xl">Redirecting to login...</span></div>;
  }

  return (
    <div>
      <FormBuilderClient />
    </div>
  );
}
