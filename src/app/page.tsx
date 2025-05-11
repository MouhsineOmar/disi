'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Eye, Edit3, Share2, Trash2, ExternalLink, StickyNote } from 'lucide-react'; // Removed Loader2 as LottieAnimation handles its own loading
import type { Form } from '@/types';
import { getAllForms, deleteForm as deleteFormFromStore, publishForm as publishFormInStore, unpublishForm as unpublishFormInStore } from '@/lib/form-store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Added missing import
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { LottieAnimation } from '@/components/common/LottieAnimation';
import { Feather } from 'lucide-react'; // Added Feather import


export default function DashboardPage() {
  const auth = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [isFormsLoading, setIsFormsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
      setForms(getAllForms());
      setIsFormsLoading(false);
    } else if (!auth.isLoading && !auth.isAuthenticated) {
      setIsFormsLoading(false);
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  const handleDeleteForm = (id: string) => {
    deleteFormFromStore(id);
    setForms(getAllForms());
    toast({ title: "Form Deleted", description: "The form has been successfully deleted." });
  };
  
  const handlePublishToggle = (id: string) => {
    const form = forms.find(f => f.id === id);
    if (form) {
      let result;
      if (form.publishedAt) {
        result = unpublishFormInStore(id);
        toast({ title: "Form Unpublished", description: "The form is no longer public." });
      } else {
        result = publishFormInStore(id);
        toast({ title: "Form Published", description: "The form is now public." });
      }
      if(result) setForms(getAllForms());
    }
  };

  if (auth.isLoading) {
    // This state is mostly handled by AuthProvider's full-page loader.
    // This is a fallback or for the brief moment if AuthProvider's loader isn't active.
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-15rem)]">
        <LottieAnimation
          animationPath="https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json"
          width={150}
          height={150}
          message="Loading Dashboard..."
          data-ai-hint="loading animation"
        />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
     // This state is also mostly handled by AuthProvider causing a redirect.
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

  // Skeleton loader for forms data, kept as is for better UX than a single Lottie for content.
  if (isFormsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="h-8 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your forms here.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/builder">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
          </Link>
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card className="text-center py-12 shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
              <Feather className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 text-2xl">No Forms Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              It looks like you haven't created any forms.
            </CardDescription>
            <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/builder">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Form
              </Link>
            </Button>
          </CardContent>
           <CardFooter className="justify-center">
            <Image src="https://picsum.photos/seed/formempty/400/200" alt="Empty state illustration" width={400} height={200} className="rounded-lg mt-4" data-ai-hint="abstract forms illustration"/>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{form.title}</CardTitle>
                  <Badge variant={form.publishedAt ? "default" : "secondary"} className={form.publishedAt ? "bg-green-500 text-white" : ""}>
                    {form.publishedAt ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <CardDescription>
                  {form.fields.length} field(s). Created on {new Date(form.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground truncate" title={form.description || ''}>{form.description || 'No description provided.'}</p>
                 {form.projectNotes && (
                    <div className="mt-2 flex items-start text-xs text-blue-600 italic" title={form.projectNotes}>
                       <StickyNote className="h-3 w-3 mr-1 mt-0.5 shrink-0" /> 
                       <p className="truncate">Note: {form.projectNotes}</p>
                    </div>
                )}
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/builder/${form.id}`}>
                    <Edit3 className="mr-1 h-3 w-3" /> Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/preview/${form.id}`}>
                    <Eye className="mr-1 h-3 w-3" /> Preview
                  </Link>
                </Button>
                 <Button variant="outline" size="sm" onClick={() => handlePublishToggle(form.id)} className={form.publishedAt ? "text-yellow-600 border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700" : "text-green-600 border-green-500 hover:bg-green-50 hover:text-green-700"}>
                  <Share2 className="mr-1 h-3 w-3" /> {form.publishedAt ? 'Unpublish' : 'Publish'}
                </Button>
                {form.publishedAt && form.publishedUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={form.publishedUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" /> View Live
                    </a>
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="col-span-full sm:col-span-1">
                      <Trash2 className="mr-1 h-3 w-3" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the form "{form.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteForm(form.id)} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}