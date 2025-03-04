import { createConfig } from '@privy-io/wagmi';
import { http, defineChain } from 'viem';
import { repNetManagerAbi } from './generated/RepNetManager';

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

export const config = createConfig({
  chains: [monad], // Pass your required chains as an array
  transports: {
    [monad.id]: http(),
  },
});

export const wagmiContractConfig = {
  address: process.env.CONTRACT_ADDRESS,
  abi: repNetManagerAbi,
};
