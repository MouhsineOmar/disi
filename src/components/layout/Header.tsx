'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Feather, LogIn, LogOut, LayoutDashboard, PlusCircleIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider'; 

export function Header() {
  const auth = useAuth();

  // Return null or a minimal loader if auth state is loading, to prevent flashing UI
  if (auth.isLoading) {
    return (
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Feather className="h-7 w-7" />
            <span className="text-xl font-semibold">Firebase Forms</span>
          </div>
          <div className="h-8 w-20 bg-muted rounded animate-pulse"></div> {/* Placeholder for buttons */}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Feather className="h-7 w-7" />
          <span className="text-xl font-semibold">Firebase Forms</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {auth.isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/"> <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
              </Button>
              <Button variant="default" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/builder"> <PlusCircleIcon className="mr-2 h-4 w-4" />Create Form</Link>
              </Button>
              <Button variant="outline" onClick={auth.logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Button variant="default" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {auth.isAuthenticated ? (
                  <>
                    <SheetClose asChild>
                      <Link href="/" className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2 py-2">
                        <LayoutDashboard className="h-5 w-5" /> Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/builder" className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2 py-2">
                        <PlusCircleIcon className="h-5 w-5" /> Create Form
                      </Link>
                    </SheetClose>
                    <Button variant="outline" onClick={() => { auth.logout(); /* Sheet will close parent SheetClose if any, or manually handle */ }} className="w-full justify-start text-lg py-2 mt-4">
                      <LogOut className="mr-2 h-5 w-5" /> Logout
                    </Button>
                  </>
                ) : (
                  <SheetClose asChild>
                  <Link href="/login" className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2 py-2">
                    <LogIn className="mr-2 h-5 w-5" /> Login
                  </Link>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
