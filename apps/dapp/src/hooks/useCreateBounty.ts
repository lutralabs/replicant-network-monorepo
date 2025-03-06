import { ErrorToast, SuccessToast } from '@/components/Toasts';
import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import { useWallets } from '@privy-io/react-auth';
import { useMutation } from '@tanstack/react-query';
import { simulateContract, writeContract } from '@wagmi/core';
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
      description: string;
      discord: string | null;
      email: string | null;
      telegram: string | null;
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
        description,
        email,
        discord,
        telegram,
      } = variables;

      if (!wallet || !wallet.address) return null;

      const args = [
        {
          name: title,
          symbol: symbol,
          fundingPhaseEnd: BigInt(fundingPhaseEnd), // e.g. 1 week from now
          submissionPhaseEnd: BigInt(submissionPhaseEnd), // e.g. 2 weeks from now
          votingPhaseEnd: BigInt(votingPhaseEnd), // e.g. 3 weeks from now
          developerFeePercentage: BigInt(developerFeePercentage), // 5% developer fee
          raiseCap: parseEther((raiseCap ?? '0').toString()),
        },
      ];

      // result.result is the bounty contract index / id
      const result = await simulateContract(config, {
        abi: repNetManagerAbi,
        address: process.env.CONTRACT_ADDRESS as `0x${string}`,
        functionName: 'createCrowdfunding',
        args,
        value: parseEther(amount.toString()),
        account: wallet.address,
      });

      const writeRes = await writeContract(config, result.request as any);

      const response = await fetch('/api/bounty', {
        method: 'POST',
        body: JSON.stringify({
          id: Number(result.result),
          title,
          description,
          discord,
          email,
          telegram,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to store metadata');
      }

      const json = await response.json();

      if (json.error) {
        throw new Error(json.error);
      }

      return { transactionId: writeRes, bountyData: json.data };
    },
    onSuccess: (data) => {
      SuccessToast({ message: 'Bounty created successfully!' });
      if (data) {
        console.log('Success. Storing Metadata...');
        SuccessToast({ message: data.transactionId });
      }
    },
    onError: (error) => {
      console.log('error', error);
      ErrorToast({ error: error.message });
    },
  });
};
