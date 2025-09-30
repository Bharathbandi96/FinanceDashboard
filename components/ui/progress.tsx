'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

// const Progress = React.forwardRef<
//   React.ElementRef<typeof ProgressPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
// >(({ className, value=0, ...props }, ref) => (
//   <ProgressPrimitive.Root
//     ref={ref}
//     className={cn(
//       'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
//       className
//     )}
//     {...props}
//   >
//     <ProgressPrimitive.Indicator
//       className="h-full w-full flex-1 bg-primary transition-all"
//       style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
//     />
//   </ProgressPrimitive.Root>
// ));
// Progress.displayName = ProgressPrimitive.Root.displayName;

// export { Progress };

interface ProgressBarProps {
  value?: number | null; // 0–100
  className?: string;
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressBarProps> = ({
  value = 0,
  className,
  showLabel = false,
}) => {
  // ✅ Ensure safe value (0–100)
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value as number, 0), 100) : 0;

  return (
    <div className={cn('w-full bg-secondary rounded-full h-4 overflow-hidden', className)}>
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${safeValue}%` }}
      />
      {showLabel && (
        <span className="ml-2 text-sm text-muted-foreground">{safeValue}%</span>
      )}
    </div>
  );
};
