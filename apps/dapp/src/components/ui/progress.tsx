'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800',
        className,
      )}
      data-slot="progress"
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-linear-[90deg,#6E54FF_39%,#B4A7FB_100%] transition-all"
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
