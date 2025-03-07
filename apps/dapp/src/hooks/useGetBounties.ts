import { getCrowdfundings } from '@/lib/queries/getCrowdfundings';
import { useQuery } from '@tanstack/react-query';

export type BountyCard = {
  id: bigint;
  creator: string;
  amountRaised: bigint;
  fundingPhaseEnd: bigint;
  submissionPhaseEnd: bigint;
  votingPhaseEnd: bigint;
  raiseCap: bigint;
  numSubmissions: bigint;
  numFunders: bigint;
  // Supabase metadata
  title?: string;
  description?: string;
  type?: string;
  prompters?: string[];
  discord?: string | null;
  email?: string | null;
  telegram?: string | null;
};

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

      // Convert GraphQL data to Bounty type
      const enrichedBounty: BountyCard = {
        id: BigInt(crowdfunding.id),
        creator: crowdfunding.creator_id,
        amountRaised: BigInt(crowdfunding.totalRaised),
        fundingPhaseEnd: BigInt(crowdfunding.fundingPhaseEnd),
        submissionPhaseEnd: BigInt(crowdfunding.submissionPhaseEnd),
        votingPhaseEnd: BigInt(crowdfunding.votingPhaseEnd),
        raiseCap: BigInt(crowdfunding.raiseCap),
        numSubmissions: BigInt(crowdfunding.numSubmissions),
        numFunders: BigInt(crowdfunding.numFunders),
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
    })
  );

  return { bounties: bountiesData, count: bountiesData.length };
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
