import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createPublicClient, defineChain, http } from 'viem';

export const monad = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Testnet Explorer',
      url: 'http://testnet.monadexplorer.com/',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [monad],
  ssr: false,
});

export const publicClient = createPublicClient({
  chain: monad,
  transport: http(),
});
