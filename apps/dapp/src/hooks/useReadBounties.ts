import { config, wagmiContractConfig } from '@/wagmi';
import { useReadContract } from 'wagmi';
import { readContract } from '@wagmi/core';
import { useState, useEffect } from 'react';

export type Bounty = {
  id: bigint;
  creator: string;
  token: string;
  accepted: boolean;
  amountRaised: bigint;
  fundingPhaseEnd: bigint;
  submissionPhaseEnd: bigint;
  votingPhaseEnd: bigint;
  raiseCap: bigint;
  developerFeePercentage: bigint;
  // Additional data
  isActive: boolean;
  totalRaised: bigint;
  totalFunders: bigint;
  phase: number;
};

export function useReadBounties() {
  const { data: numberOfBounties, isLoading: isLoadingCount } = useReadContract(
    {
      ...wagmiContractConfig,
      functionName: 'crowdfundingId',
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
    }
  );

  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBounties = async () => {
      if (numberOfBounties !== undefined) {
        setIsLoading(true);
        try {
          const count = Number(numberOfBounties);
          console.log(`Fetching ${count} bounties`);

          const bountiesData = [];
          for (let i = 0; i < count; i++) {
            const bountyId = BigInt(i);

            // Fetch base bounty data
            const bountyData = await readContract(config, {
              abi: wagmiContractConfig.abi,
              functionName: 'getCrowdfunding',
              args: [bountyId],
              address: process.env.CONTRACT_ADDRESS as `0x${string}`,
            });

            // Fetch additional data for the bounty
            const isActive = await readContract(config, {
              abi: wagmiContractConfig.abi,
              functionName: 'isCrowdfundingActive',
              args: [bountyId],
              address: process.env.CONTRACT_ADDRESS as `0x${string}`,
            });

            const totalRaised = await readContract(config, {
              abi: wagmiContractConfig.abi,
              functionName: 'getTotalRaised',
              args: [bountyId],
              address: process.env.CONTRACT_ADDRESS as `0x${string}`,
            });

            const totalFunders = await readContract(config, {
              abi: wagmiContractConfig.abi,
              functionName: 'getTotalFunders',
              args: [bountyId],
              address: process.env.CONTRACT_ADDRESS as `0x${string}`,
            });

            const phase = await readContract(config, {
              abi: wagmiContractConfig.abi,
              functionName: 'getCrowdfundingPhase',
              args: [bountyId],
              address: process.env.CONTRACT_ADDRESS as `0x${string}`,
            });

            // Combine all data
            const enrichedBounty = {
              ...bountyData,
              isActive,
              totalRaised,
              totalFunders,
              phase,
            };

            bountiesData.push(enrichedBounty);
          }

          setBounties(bountiesData);
          console.log('Enriched Bounties:', bountiesData);
        } catch (error) {
          console.error('Error fetching bounties:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBounties();
  }, [numberOfBounties]);

  return {
    bounties,
    isLoading: isLoading || isLoadingCount,
    count: numberOfBounties ? Number(numberOfBounties) : 0,
  };
}
