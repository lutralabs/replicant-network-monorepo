import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config, wagmiContractConfig } from '@/wagmi';
import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';
import { useReadContract } from 'wagmi';

// Extended bounty type including Supabase data
export type Bounty = {
  id: bigint;
  creator: string;
  token: string;
  finalized: boolean;
  winner: string;
  amountRaised: bigint;
  fundingPhaseEnd: bigint;
  submissionPhaseEnd: bigint;
  votingPhaseEnd: bigint;
  raiseCap: bigint;
  developerFeePercentage: bigint;
  submissionIds: `0x${string}`[];
  numSubmissions: bigint;
  numFunders: bigint;
  phase: number;
  accepted: boolean;
  // Additional blockchain data
  isActive: boolean;
  // Supabase metadata
  title?: string;
  description?: string;
  type?: string;
  prompters?: string[];
  discord?: string | null;
  email?: string | null;
  telegram?: string | null;
};

async function fetchBountiesCount() {
  const count = await readContract(config, {
    abi: repNetManagerAbi,
    functionName: 'crowdfundingId',
    address: process.env.CONTRACT_ADDRESS as `0x${string}`,
  });

  return Number(count);
}

async function fetchBounties() {
  const count = await fetchBountiesCount();
  console.log(`Fetching ${count} bounties`);

  const bountiesData = [];
  for (let i = 0; i < count; i++) {
    const bountyId = BigInt(i);

    // Fetch base bounty data from blockchain
    const bountyData = await readContract(config, {
      abi: repNetManagerAbi,
      functionName: 'crowdfunding',
      args: [bountyId],
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
    });

    // Fetch additional blockchain data
    const isActive = await readContract(config, {
      abi: repNetManagerAbi,
      functionName: 'isCrowdfundingActive',
      args: [bountyId],
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
    });

    // Fetch metadata from API
    let supabaseData = null;
    try {
      const response = await fetch(`/api/bounty?id=${i}`);
      if (response.ok) {
        const result = await response.json();
        supabaseData = result.data;
      }
    } catch (error) {
      console.error(`Error fetching metadata for bounty ${i}:`, error);
    }

    // Combine all data
    const enrichedBounty: Bounty = {
      ...bountyData,
      submissionIds: [...bountyData.submissionIds],
      isActive,
      accepted: bountyData.finalized,
      ...(supabaseData && {
        title: supabaseData.title,
        description: supabaseData.description,
        type: supabaseData.type,
        prompters: supabaseData.prompters,
        discord: supabaseData.discord,
        email: supabaseData.email,
        telegram: supabaseData.telegram,
      }),
    };

    bountiesData.push(enrichedBounty);
  }

  return { bounties: bountiesData, count };
}

export function useGetBounties() {
  const query = useQuery({
    queryKey: ['bounties'],
    queryFn: fetchBounties,
    refetchInterval: 1000 * 60,
  });

  // Return in the same format as the original hook for compatibility
  return {
    bounties: query.data?.bounties || [],
    count: query.data?.count || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
