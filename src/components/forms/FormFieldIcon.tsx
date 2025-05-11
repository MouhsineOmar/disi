import type { FormFieldType } from '@/types';
import { CaseSensitive, AlignLeft, Hash, CalendarDays, ChevronDownSquare, CheckSquare, CircleDot, Icon } from 'lucide-react';

interface FormFieldIconProps {
  type: FormFieldType;
  className?: string;
}

export const FormFieldIcon: React.FC<FormFieldIconProps> = ({ type, className }) => {
  const defaultClassName = "h-4 w-4 text-muted-foreground";
  const mergedClassName = `${defaultClassName} ${className || ''}`;

  switch (type) {
    case 'text':
      return <CaseSensitive className={mergedClassName} />;
    case 'textarea':
      return <AlignLeft className={mergedClassName} />;
    case 'number':
      return <Hash className={mergedClassName} />;
    case 'date':
      return <CalendarDays className={mergedClassName} />;
    case 'select':
      return <ChevronDownSquare className={mergedClassName} />;
    case 'checkbox':
      return <CheckSquare className={mergedClassName} />;
    case 'radio':
      return <CircleDot className={mergedClassName} />;
    default:
      const _exhaustiveCheck: never = type;
      return <Icon className={mergedClassName} />; // Fallback icon
  }
};
