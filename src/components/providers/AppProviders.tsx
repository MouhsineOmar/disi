'use client';

import React from 'react';

// This component can be used to wrap context providers or other client-side setup.
// For now, it's a simple pass-through, but good for future expansion.
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
