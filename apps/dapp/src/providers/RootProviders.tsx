import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

export const RootProviders = ({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider forcedTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  );
};
