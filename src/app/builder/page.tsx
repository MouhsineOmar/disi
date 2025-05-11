
'use client'; 

import { FormBuilderClient } from '@/components/forms/FormBuilderClient';
import { useAuth } from '@/components/providers/AuthProvider';
import { LottieAnimation } from '@/components/common/LottieAnimation';

export default function CreateFormPage() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-15rem)]">
        <LottieAnimation
          animationPath="https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json"
          width={150}
          height={150}
          message="Loading Form Builder..."
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

  return (
    <div>
      <FormBuilderClient />
    </div>
  );
}
