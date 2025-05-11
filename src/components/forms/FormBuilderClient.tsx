'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Form, FormField, FormFieldType } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormFieldConfig } from './FormFieldConfig';
import { saveForm as saveFormToStore, getFormById } from '@/lib/form-store';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Eye, Save, Sparkles, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { suggestFormFields, SuggestFormFieldInput } from '@/ai/flows/suggest-form-fields';
import { FormFieldIcon } from './FormFieldIcon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const generateId = (): string => crypto.randomUUID();

const fieldTypes: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number Input' },
  { value: 'date', label: 'Date Picker' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
];

export function FormBuilderClient({ initialForm }: { initialForm?: Form }) {
  const router = useRouter();
  const params = useParams();
  const formId = params.formId as string | undefined;

  const [form, setForm] = useState<Form>(
    initialForm || {
      id: formId || generateId(),
      title: 'Untitled Form',
      description: '',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
  const [selectedFieldType, setSelectedFieldType] = useState<FormFieldType>('text');
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (formId && !initialForm) {
      const existingForm = getFormById(formId);
      if (existingForm) {
        setForm(existingForm);
      } else {
        // Handle form not found, maybe redirect or show error
        toast({ title: "Error", description: "Form not found.", variant: "destructive" });
        router.push('/');
      }
    }
  }, [formId, initialForm, router, toast]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addField = (type: FormFieldType, label?: string) => {
    const newField: FormField = {
      id: generateId(),
      label: label || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      type: type,
      required: false,
      options: (type === 'select' || type === 'radio') ? [{id: generateId(), label: 'Option 1', value: 'option1'}] : undefined,
    };
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  const updateField = (index: number, updatedField: FormField) => {
    const newFields = [...form.fields];
    newFields[index] = updatedField;
    setForm({ ...form, fields: newFields });
  };

  const removeField = (index: number) => {
    const newFields = form.fields.filter((_, i) => i !== index);
    setForm({ ...form, fields: newFields });
  };

  const handleSaveForm = () => {
    setIsSaving(true);
    try {
      const saved = saveFormToStore(form);
      setForm(saved); // Update state with potentially new ID or timestamps
      toast({
        title: 'Form Saved!',
        description: `"${saved.title}" has been successfully saved.`,
      });
      if (!formId) { // If it was a new form, redirect to its edit page
         router.replace(`/builder/${saved.id}`, { scroll: false });
      }
    } catch (error) {
      toast({
        title: 'Error Saving Form',
        description: (error as Error).message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewForm = () => {
    handleSaveForm(); // Save before previewing
    if(form.id) {
      router.push(`/preview/${form.id}`);
    } else {
       toast({ title: "Error", description: "Cannot preview unsaved form.", variant: "destructive" });
    }
  };

  const handleGetAISuggestions = async () => {
    if (!form.title.trim()) {
      toast({ title: "Form Title Required", description: "Please enter a title for your form to get AI suggestions.", variant: "destructive" });
      return;
    }
    setIsAISuggesting(true);
    setAiSuggestions([]);
    try {
      const input: SuggestFormFieldInput = { formTitle: form.title };
      const result = await suggestFormFields(input);
      if (result.suggestedFields && result.suggestedFields.length > 0) {
        setAiSuggestions(result.suggestedFields);
        toast({ title: "AI Suggestions Ready!", description: "Review the suggestions below." });
      } else {
        toast({ title: "No AI Suggestions", description: "AI couldn't generate suggestions for this title. Try a different title." });
      }
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({ title: "AI Suggestion Failed", description: "Could not fetch AI suggestions. Please try again.", variant: "destructive" });
    } finally {
      setIsAISuggesting(false);
    }
  };
  
  const addSuggestedField = (fieldName: string) => {
    // Basic type inference, could be more sophisticated
    let type: FormFieldType = 'text';
    if (fieldName.toLowerCase().includes('email')) type = 'text'; // HTML5 email type is handled by input type="email"
    else if (fieldName.toLowerCase().includes('phone') || fieldName.toLowerCase().includes('number')) type = 'number';
    else if (fieldName.toLowerCase().includes('date')) type = 'date';
    else if (fieldName.toLowerCase().includes('description') || fieldName.toLowerCase().includes('message') || fieldName.toLowerCase().includes('comment')) type = 'textarea';
    
    addField(type, fieldName);
    setAiSuggestions(prev => prev.filter(s => s !== fieldName)); // Remove from suggestions
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Form Settings</CardTitle>
          <CardDescription>Define the title and description for your form.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-lg">Form Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="E.g., Contact Us, Event Registration"
              className="text-xl p-4"
            />
          </div>
          <div>
            <Label htmlFor="description">Form Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description || ''}
              onChange={handleInputChange}
              placeholder="Provide a brief description or instructions for your form."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">AI Field Suggester</CardTitle>
          <CardDescription>Get intelligent field suggestions based on your form title. Make sure to set a descriptive form title first.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetAISuggestions} disabled={isAISuggesting || !form.title.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isAISuggesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isAISuggesting ? 'Getting Suggestions...' : 'Suggest Fields'}
          </Button>
          {aiSuggestions.length > 0 && (
            <div className="mt-4 space-y-2 p-4 border rounded-md bg-background">
              <h4 className="font-semibold">Suggested Fields:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {aiSuggestions.map((suggestion, idx) => (
                  <li key={idx}>
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addSuggestedField(suggestion)}>
                      <PlusCircle className="mr-2 h-4 w-4 text-green-500" /> {suggestion}
                    </Button>
                  </li>
                ))}
              </ul>
               <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 text-blue-500 shrink-0" />
                <span>These are just suggestions. Review and customize them after adding to your form.</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Form Fields</CardTitle>
          <CardDescription>Add and configure the fields for your form.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {form.fields.length > 0 ? (
            form.fields.map((field, index) => (
              <FormFieldConfig
                key={field.id}
                field={field}
                index={index}
                onUpdateField={updateField}
                onRemoveField={removeField}
              />
            ))
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No fields added yet.</p>
              <p className="text-sm text-muted-foreground">Select a field type below to get started, or use AI suggestions.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 items-center border-t pt-6">
           <div className="flex-grow w-full sm:w-auto">
            <Select onValueChange={(value) => setSelectedFieldType(value as FormFieldType)} defaultValue={selectedFieldType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map(ft => (
                  <SelectItem key={ft.value} value={ft.value}>
                    <div className="flex items-center">
                      <FormFieldIcon type={ft.value} className="mr-2" /> {ft.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => addField(selectedFieldType)} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Field
          </Button>
        </CardFooter>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
        <Button variant="outline" onClick={handlePreviewForm} disabled={isSaving}>
          <Eye className="mr-2 h-4 w-4" /> Preview
        </Button>
        <Button onClick={handleSaveForm} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {isSaving ? 'Saving...' : (formId ? 'Save Changes' : 'Save Form')}
        </Button>
      </div>
    </div>
  );
}
