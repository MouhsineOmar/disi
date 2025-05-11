
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LottieAnimation } from '@/components/common/LottieAnimation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
       router.push('/');
    }
  }, [auth.isAuthenticated, auth.isLoading, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (email && password) {
        auth.login(); 
      } else {
        alert('Please enter email and password.'); 
        setIsSubmitting(false);
      }
    }, 500);
  };
  
  if (auth.isLoading) {
    // This state is largely covered by AuthProvider's full-page loader
    // but kept for robustness or if AuthProvider's loader is conditional
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
        <LottieAnimation
          animationPath="https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json"
          width={150}
          height={150}
          data-ai-hint="loading animation"
        />
      </div>
    );
  }

  if (auth.isAuthenticated) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
          <LottieAnimation
            animationPath="https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json"
            width={150}
            height={150}
            message="Redirecting..."
            data-ai-hint="loading animation"
          />
        </div>
      );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-15rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>Access your dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/signup">
                   Sign Up
                </Link>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
