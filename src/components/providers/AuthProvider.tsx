
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LottieAnimation } from '@/components/common/LottieAnimation'; // Changed import

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

    const publicPaths = ['/login', '/signup'];
    const isPublicPath = publicPaths.includes(pathname);
    const isFormViewPath = pathname.startsWith('/forms/');

    if (!isAuthenticated && !isPublicPath && !isFormViewPath) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading && !pathname.startsWith('/forms/')) {
     const publicPaths = ['/login', '/signup'];
     if (!publicPaths.includes(pathname)) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen fixed inset-0 bg-background z-[100]">
                <LottieAnimation
                  animationPath="https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json"
                  width={250}
                  height={250}
                  message="Authenticating..."
                  data-ai-hint="loading animation"
                />
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
