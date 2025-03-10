import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import { useWallets } from '@privy-io/react-auth';
import { useMutation } from '@tanstack/react-query';
import { simulateContract, writeContract } from '@wagmi/core';

export const useWithdrawFunding = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  return useMutation({
    mutationKey: ['withdrawFunding', wallet],
    mutationFn: async (variables: {
      id: bigint;
    }) => {
      const { id } = variables;

      if (!wallet || !wallet.address) return null;

      const result = await simulateContract(config, {
        abi: repNetManagerAbi,
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'withdraw',
        args: [id],
        account: wallet.address,
      });
      //console.log(result.result);
      const writeRes = await writeContract(config, result.request as any);
      return writeRes;
    },
    onSuccess: (data) => {
      if (data) {
        console.log('Success.');
      }
    },
    onError: (error) => {
      console.log('error', error);
    },
  });
};
