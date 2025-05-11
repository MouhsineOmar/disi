'use client';

import type { FormField, FormFieldOption } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, PlusCircle, GripVertical } from 'lucide-react';
import { FormFieldIcon } from './FormFieldIcon';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldConfigProps {
  field: FormField;
  index: number;
  onUpdateField: (index: number, field: FormField) => void;
  onRemoveField: (index: number) => void;
  onMoveField?: (dragIndex: number, hoverIndex: number) => void; // For drag and drop
}

export const FormFieldConfig: React.FC<FormFieldConfigProps> = ({
  field,
  index,
  onUpdateField,
  onRemoveField,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdateField(index, { ...field, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField(index, { ...field, [e.target.name]: e.target.checked });
  };
  
  const handleOptionChange = (optIndex: number, prop: keyof FormFieldOption, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[optIndex] = { ...newOptions[optIndex], [prop]: value };
    onUpdateField(index, { ...field, options: newOptions });
  };

  const addOption = () => {
    const newOption: FormFieldOption = { id: crypto.randomUUID(), label: '', value: '' };
    const newOptions = [...(field.options || []), newOption];
    onUpdateField(index, { ...field, options: newOptions });
  };

  const removeOption = (optIndex: number) => {
    const newOptions = (field.options || []).filter((_, i) => i !== optIndex);
    onUpdateField(index, { ...field, options: newOptions });
  };


  return (
    <div className="p-4 border rounded-lg bg-card shadow space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" aria-label="Drag to reorder"/>
          <FormFieldIcon type={field.type} className="text-primary" />
          <span className="font-medium capitalize">{field.type} Field</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onRemoveField(index)} aria-label="Remove field">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`field-label-${field.id}`}>Label</Label>
          <Input
            id={`field-label-${field.id}`}
            name="label"
            value={field.label}
            onChange={handleInputChange}
            placeholder="E.g., Your Name"
          />
        </div>
        { (field.type === 'text' || field.type === 'textarea' || field.type === 'number') && (
          <div>
            <Label htmlFor={`field-placeholder-${field.id}`}>Placeholder</Label>
            <Input
              id={`field-placeholder-${field.id}`}
              name="placeholder"
              value={field.placeholder || ''}
              onChange={handleInputChange}
              placeholder="E.g., John Doe"
            />
          </div>
        )}
      </div>

      {field.type === 'textarea' && (
         <div>
          <Label htmlFor={`field-defaultValue-textarea-${field.id}`}>Default Value (Optional)</Label>
          <Textarea
            id={`field-defaultValue-textarea-${field.id}`}
            name="defaultValue"
            value={field.defaultValue as string || ''}
            onChange={handleInputChange}
            placeholder="Default text for textarea"
          />
        </div>
      )}
       {(field.type === 'text' || field.type === 'number' || field.type === 'date') && field.type !== 'textarea' && (
        <div>
          <Label htmlFor={`field-defaultValue-${field.id}`}>Default Value (Optional)</Label>
          <Input
            id={`field-defaultValue-${field.id}`}
            name="defaultValue"
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            value={field.defaultValue as string || ''}
            onChange={handleInputChange}
            placeholder="Default value for the field"
          />
        </div>
      )}


      {(field.type === 'select' || field.type === 'radio') && (
        <div className="space-y-2">
          <Label>Options</Label>
          {(field.options || []).map((option, optIndex) => (
            <div key={option.id} className="flex items-center gap-2">
              <Input
                value={option.label}
                onChange={(e) => handleOptionChange(optIndex, 'label', e.target.value)}
                placeholder="Option Label"
                className="flex-1"
              />
              <Input
                value={option.value}
                onChange={(e) => handleOptionChange(optIndex, 'value', e.target.value)}
                placeholder="Option Value"
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => removeOption(optIndex)} aria-label="Remove option">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addOption} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Option
          </Button>
        </div>
      )}
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id={`field-required-${field.id}`}
          name="required"
          checked={field.required || false}
          onCheckedChange={(checked) => onUpdateField(index, { ...field, required: !!checked })}
        />
        <Label htmlFor={`field-required-${field.id}`} className="text-sm font-medium">
          Required
        </Label>
      </div>
    </div>
  );
};
