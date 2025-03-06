import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';
import type { Bounty } from './useGetBounties';

async function fetchBounty(id: number): Promise<Bounty | null> {
  if (id === undefined || id === null) {
    throw new Error('Bounty ID is required');
  }

  console.log(`Fetching bounty with ID: ${id}`);
  const bountyId = BigInt(id);

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
    const response = await fetch(`/api/bounty?id=${id}`);
    if (response.ok) {
      const result = await response.json();
      supabaseData = result.data;
    }
  } catch (error) {
    console.error(`Error fetching metadata for bounty ${id}:`, error);
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

  return enrichedBounty;
}

export function useGetBounty(id: number) {
  const query = useQuery({
    queryKey: ['bounty', id],
    queryFn: () => fetchBounty(id),
    enabled: id !== undefined && id !== null,
    refetchInterval: 1000 * 60,
  });

  // Return in the same format as the original hook for compatibility
  return {
    bounty: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
