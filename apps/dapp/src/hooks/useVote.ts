import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import { useWallets } from '@privy-io/react-auth';
import { useMutation } from '@tanstack/react-query';
import { simulateContract, writeContract } from '@wagmi/core';
import { toast } from 'react-toastify';
import { ErrorToast } from '@/components/Toast/ErrorToast';
import { SuccessToast } from '@/components/Toast/SuccessToast';
import { InfoToast } from '@/components/Toast/InfoToast';
import { PendingToast } from '@/components/Toast/PendingToast';

export const useVote = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  return useMutation({
    mutationKey: ['vote', wallet],
    mutationFn: async (variables: {
      model: string;
      id: bigint;
    }) => {
      const { model, id } = variables;

      if (!wallet || !wallet.address) {
        throw new Error('Wallet not connected');
      }

      try {
        // Simulate the transaction first
        const result = await simulateContract(config, {
          abi: repNetManagerAbi,
          address: process.env.CONTRACT_ADDRESS as `0x${string}`,
          functionName: 'vote',
          args: [id, model],
          account: wallet.address,
        });

        // Execute the actual transaction
        const writeRes = await writeContract(config, result.request as any);

        return writeRes;
      } catch (error) {
        // If there's an error, dismiss the pending toast
        ErrorToast({ error: error.message });
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data) {
        // Show success toast
        SuccessToast({ message: 'Your vote has been submitted successfully!' });
        console.log('Vote submitted successfully:', data);
      }
    },
    onError: (error: Error) => {
      // Show error toast with the error message
      ErrorToast({ error: error.message });
      console.error('Voting error:', error);
    },
  });
};
