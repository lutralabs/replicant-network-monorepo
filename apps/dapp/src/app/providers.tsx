'use client';
// import '@rainbow-me/rainbowkit/styles.css';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import type { ComponentProps } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
          <WagmiProvider config={config}>
            {children}
            <ToastContainer
              icon={false}
              position="bottom-right"
              style={{ zIndex: 1000 }}
              autoClose={5000}
              progressClassName="bg-[hsl(var(--primary))]"
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </WagmiProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PrivyProvider>
    </NextThemesProvider>
  );
};
