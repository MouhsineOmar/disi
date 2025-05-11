'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (redirectTo?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('isAuthenticated');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      // Handle environments where localStorage might be blocked or unavailable
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((redirectTo?: string) => {
    try {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      router.push(redirectTo || '/');
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('isAuthenticated');
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [router]);

  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.includes(pathname);
    const isFormViewPath = pathname.startsWith('/forms/'); // Published forms are public

    if (!isAuthenticated && !isPublicPath && !isFormViewPath) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // If loading, show a full-page loader. This prevents content flashing.
  // Specific pages might also have their own auth.isLoading checks for more granular loading UI.
  if (isLoading && !pathname.startsWith('/forms/')) { // Don't show auth loader for public form views
     const publicPaths = ['/login'];
     if (!publicPaths.includes(pathname)) { // Avoid showing this loader on the login page itself while it's determining auth state
        return (
            <div className="flex flex-col justify-center items-center min-h-screen fixed inset-0 bg-background z-[100]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-xl mt-4">Authenticating...</p>
            </div>
        );
     }
  }


  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
