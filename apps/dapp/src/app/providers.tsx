'use client';
// import '@rainbow-me/rainbowkit/styles.css';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import type { ComponentProps } from 'react';

import { config, monad } from '@/wagmi';

const client = new QueryClient();

export const Providers = ({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider forcedTheme="light" {...props}>
      <PrivyProvider
        appId={process.env.PRIVY_APPID}
        config={{
          // Customize Privy's appearance in your app
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://lutralabs.io/ll-logo.svg',
          },
          defaultChain: monad,
          supportedChains: [monad],
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            showWalletUIs: true,
          },
        }}
      >
        <QueryClientProvider client={client}>
          <WagmiProvider config={config}>{children}</WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </NextThemesProvider>
  );
};
