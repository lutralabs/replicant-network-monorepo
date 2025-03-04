import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import { useWallets } from '@privy-io/react-auth';
import { useMutation } from '@tanstack/react-query';
import { simulateContract, writeContract } from '@wagmi/core';
import { RailSymbol } from 'lucide-react';
import { parseEther } from 'viem';

export const useCreateBounty = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  return useMutation({
    mutationKey: ['createBounty', wallet],
    mutationFn: async (variables: {
      amount: number;
      title: string;
      symbol: string;
      fundingPhaseEnd: number;
      submissionPhaseEnd: number;
      votingPhaseEnd: number;
      developerFeePercentage: number;
      raiseCap?: number;
    }) => {
      const {
        amount,
        title,
        symbol,
        fundingPhaseEnd,
        submissionPhaseEnd,
        votingPhaseEnd,
        developerFeePercentage,
        raiseCap,
      } = variables;

      if (!wallet || !wallet.address) return null;

      const args = [
        {
          name: title,
          symbol: symbol,
          fundingPhaseEnd: BigInt(fundingPhaseEnd), // 1 week from now
          submissionPhaseEnd: BigInt(submissionPhaseEnd), // 2 weeks from now
          votingPhaseEnd: BigInt(votingPhaseEnd), // 3 weeks from now
          developerFeePercentage: BigInt(developerFeePercentage), // 5% developer fee
          raiseCap: parseEther((raiseCap ?? '0').toString()),
        },
      ];

      const result = await simulateContract(config, {
        abi: repNetManagerAbi,
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'createCrowdfunding',
        args,
        value: parseEther(amount.toString()),
        account: wallet.address,
      });
      const hash = await writeContract(config, result.request as any);
      return hash;
    },
    onSuccess: (data) => {
      if (data) {
        console.log('success');
      }
    },
    onError: (error) => {
      console.log('error', error);
    },
  });
};
