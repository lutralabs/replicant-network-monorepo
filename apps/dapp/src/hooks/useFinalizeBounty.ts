import { ErrorToast, SuccessToast } from '@/components/Toast';
import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import { useWallets } from '@privy-io/react-auth';
import { useMutation } from '@tanstack/react-query';
import { simulateContract, writeContract } from '@wagmi/core';

export const useFinalizeBounty = () => {
  const { wallets } = useWallets();
  const wallet = wallets?.[0];

  return useMutation({
    mutationKey: ['finalizeBounty', wallet],
    mutationFn: async (variables: {
      id: bigint;
    }) => {
      const { id } = variables;

      if (!wallet || !wallet.address) return null;

      const result = await simulateContract(config, {
        abi: repNetManagerAbi,
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'finalize',
        args: [id],
        account: wallet.address,
      });
      const writeRes = await writeContract(config, result.request as any);
      return writeRes;
    },
    onSuccess: (data) => {
      if (data) {
        SuccessToast({ message: 'Bounty finalized successfully' });
      }
    },
    onError: (error) => {
      ErrorToast({
        error: error.message.includes('User rejected')
          ? 'User rejected the request'
          : 'Error finalizing bounty',
      });
      console.error('error', error);
    },
  });
};
