import { modelTokenErc20Abi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import { useWallets } from '@privy-io/react-auth';
import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';

export const useGetSymbol = (tokenAddress: string) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const walletAddress = wallet?.address;

  return useQuery({
    queryKey: ['getSymbol', tokenAddress, walletAddress],
    queryFn: async () => {
      if (!tokenAddress || !walletAddress) {
        return;
      }

      try {
        // Call the "symbol" function on the contract
        const symbol = await readContract(config, {
          abi: modelTokenErc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: 'symbol',
        });

        // Call the "name" function on the contract
        const name = await readContract(config, {
          abi: modelTokenErc20Abi,
          address: tokenAddress as `0x${string}`,
          functionName: 'name',
        });

        return { symbol, name };
      } catch (error) {
        console.error('Error getting token info:', error);
        return;
      }
    },
    enabled: tokenAddress !== undefined && walletAddress !== undefined,
  });
};
