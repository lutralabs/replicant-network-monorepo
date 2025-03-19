import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import { useWallets } from '@privy-io/react-auth';
import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';

export const useHasVoted = (bountyId: number | undefined) => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const walletAddress = wallet?.address;

  console.log('Checking if user has voted:', bountyId, walletAddress);

  return useQuery({
    queryKey: ['hasVoted', bountyId, walletAddress],
    queryFn: async () => {
      console.log('here....');
      if (bountyId === null || !walletAddress) {
        return true;
      }

      try {
        // Call the hasVoted function on the contract
        const hasVoted = await readContract(config, {
          abi: repNetManagerAbi,
          address: process.env.CONTRACT_ADDRESS as `0x${string}`,
          functionName: 'hasVoted',
          args: [BigInt(bountyId), walletAddress as `0x${string}`],
        });

        console.log('Has voted:', hasVoted);

        return hasVoted as boolean;
      } catch (error) {
        console.error('Error checking voting status:', error);
        return false;
      }
    },
    enabled: bountyId !== undefined && walletAddress !== undefined,
  });
};
