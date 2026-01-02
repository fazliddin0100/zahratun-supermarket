'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface IndeterminateCheckboxProps
  extends React.ComponentPropsWithoutRef<typeof Checkbox> {
  indeterminate?: boolean;
}

const IndeterminateCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  IndeterminateCheckboxProps
>(({ indeterminate = false, className, checked, ...props }, ref) => {
  return (
    <Checkbox
      ref={ref}
      // Radix Checkbox `checked` tipini qabul qiladi: boolean | "indeterminate"
      checked={indeterminate ? 'indeterminate' : checked}
      className={cn(
        'data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:border-blue-600',
        className
      )}
      {...props}
    />
  );
});

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

export { IndeterminateCheckbox };
