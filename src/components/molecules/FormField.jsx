import { forwardRef } from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { cn } from '@/utils/cn';

const FormField = forwardRef(({ 
  label,
  type = 'text',
  error,
  required,
  className,
  options,
  children,
  ...props 
}, ref) => {
  const renderInput = () => {
    if (type === 'select') {
      return (
        <Select ref={ref} error={error} {...props}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </Select>
      );
    }
    
    if (type === 'textarea') {
      return (
        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error && 'border-error focus:ring-error'
          )}
          {...props}
        />
      );
    }
    
    return <Input ref={ref} type={type} error={error} {...props} />;
  };
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label required={required}>{label}</Label>}
      {renderInput()}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;