'use client';

import { Toaster } from 'sonner';
import { useTheme } from '@/providers/ThemeProvider';

export function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme}
      richColors
    />
  );
}

