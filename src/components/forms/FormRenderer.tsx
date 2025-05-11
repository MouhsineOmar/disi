'use client';

import type { Form, FormField as FormFieldType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface FormRendererProps {
  form: Form;
  isPreview?: boolean; // If true, disable submission and show preview specific styles
}

type Inputs = Record<string, any>;

export function FormRenderer({ form, isPreview = false }: FormRendererProps) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isPreview) {
      toast({ title: "Preview Mode", description: "Submissions are disabled in preview mode." });
      console.log("Preview Data:", data);
      return;
    }
    // Actual submission logic would go here (e.g., API call)
    console.log("Form Submitted Data:", data);
    toast({
      title: "Form Submitted!",
      description: "Your response has been recorded. (This is a demo)",
    });
    // Potentially reset form or redirect
  };

  const renderField = (field: FormFieldType) => {
    const commonProps = {
      name: field.id,
      control: control,
      rules: { required: field.required ? `${field.label} is required.` : false },
    };

    return (
      <div key={field.id} className="space-y-2 mb-6 p-4 border border-input rounded-md bg-background shadow-sm hover:shadow-md transition-shadow">
        <Label htmlFor={field.id} className="text-md font-medium text-foreground flex items-center">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.placeholder && field.type !== 'checkbox' && field.type !== 'radio' && field.type !== 'select' && (
            <p className="text-sm text-muted-foreground italic mb-1">{field.placeholder}</p>
        )}

        {field.type === 'text' && (
          <Controller
            {...commonProps}
            defaultValue={field.defaultValue || ""}
            render={({ field: rhfField }) => <Input id={field.id} {...rhfField} placeholder={field.placeholder} type="text" disabled={isPreview} />}
          />
        )}
        {field.type === 'textarea' && (
          <Controller
            {...commonProps}
            defaultValue={field.defaultValue || ""}
            render={({ field: rhfField }) => <Textarea id={field.id} {...rhfField} placeholder={field.placeholder} disabled={isPreview} />}
          />
        )}
        {field.type === 'number' && (
          <Controller
            {...commonProps}
            defaultValue={field.defaultValue || ""}
            render={({ field: rhfField }) => <Input id={field.id} {...rhfField} placeholder={field.placeholder} type="number" disabled={isPreview} />}
          />
        )}
        {field.type === 'date' && (
          <Controller
            {...commonProps}
            defaultValue={field.defaultValue || ""}
            render={({ field: rhfField }) => <Input id={field.id} {...rhfField} type="date" disabled={isPreview} />}
          />
        )}
        {field.type === 'checkbox' && (
          <Controller
            {...commonProps}
            defaultValue={field.defaultValue || false}
            render={({ field: rhfField }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id={field.id} checked={rhfField.value} onCheckedChange={rhfField.onChange} disabled={isPreview} />
                <Label htmlFor={field.id} className="font-normal">
                  {/* Checkbox label is often part of the main label. If not, add sub-label here. */}
                </Label>
              </div>
            )}
          />
        )}
        {field.type === 'radio' && field.options && (
          <Controller
            {...commonProps}
            defaultValue={field.defaultValue || ""}
            render={({ field: rhfField }) => (
              <RadioGroup onValueChange={rhfField.onChange} value={rhfField.value} className="space-y-1" disabled={isPreview}>
                {field.options?.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${field.id}-${option.id}`} />
                    <Label htmlFor={`${field.id}-${option.id}`} className="font-normal">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        )}
        {field.type === 'select' && field.options && (
          <Controller
            {...commonProps}
            defaultValue={field.defaultValue || ""}
            render={({ field: rhfField }) => (
              <Select onValueChange={rhfField.onChange} value={rhfField.value} disabled={isPreview}>
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder={field.placeholder || "Select an option"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(option => (
                    <SelectItem key={option.id} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        {errors[field.id] && <p className="text-sm text-destructive">{(errors[field.id] as any)?.message}</p>}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-2 border-primary/20">
      {isPreview && (
        <div className="p-3 bg-yellow-100 border-b border-yellow-300 text-yellow-700 text-sm text-center rounded-t-lg">
          This is a preview of your form. Submissions are disabled.
        </div>
      )}
      <CardHeader className="text-center bg-primary/5 rounded-t-lg">
        <CardTitle className="text-3xl font-bold text-primary">{form.title}</CardTitle>
        {form.description && <CardDescription className="text-md text-muted-foreground mt-2">{form.description}</CardDescription>}
      </CardHeader>
      <CardContent className="py-8 px-6 md:px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {form.fields.map(field => renderField(field))}
          {!isPreview && (
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : <> <Send className="mr-2 h-5 w-5" /> Submit Form </> }
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground bg-secondary/30 py-3 rounded-b-lg">
        Powered by Firebase Forms
      </CardFooter>
    </Card>
  );
}
