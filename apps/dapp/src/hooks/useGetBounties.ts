import { getCrowdfundings } from '@/lib/queries/getCrowdfundings';
import { useQuery } from '@tanstack/react-query';

type Submission = {
  id: string;
  creator_id: string;
  timestamp: string;
  totalVotesPower: string;
  votes: {
    id: string;
    votePower: string;
    voter_id: string;
    timestamp: string;
  }[];
};

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
  finalized: boolean;
  winner: string | null;
  token: string;
  submissions?: Submission[];
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
  // Get crowdfundings from GraphQL
  const crowdfundings = await getCrowdfundings();

  // Transform GraphQL data to match BountyCard type
  const bountiesData = await Promise.all(
    crowdfundings.map(async (crowdfunding) => {
      const bountyId = Number(crowdfunding.id);

      // Fetch metadata from API
      let supabaseData = null;
      try {
        const response = await fetch(`/api/bounty?id=${bountyId}`);
        if (response.ok) {
          const result = await response.json();
          supabaseData = result.data;
        }
      } catch (error) {
        console.error(`Error fetching metadata for bounty ${bountyId}:`, error);
      }

      // Convert GraphQL data to BountyCard type
      const enrichedBounty: BountyCard = {
        id: BigInt(crowdfunding.id),
        creator: crowdfunding.creator_id,
        amountRaised: BigInt(crowdfunding.totalRaised || 0),
        fundingPhaseEnd: BigInt(crowdfunding.fundingPhaseEnd || 0),
        submissionPhaseEnd: BigInt(crowdfunding.submissionPhaseEnd || 0),
        votingPhaseEnd: BigInt(crowdfunding.votingPhaseEnd || 0),
        raiseCap: BigInt(crowdfunding.raiseCap || 0),
        numSubmissions: BigInt(crowdfunding.numSubmissions || 0),
        numFunders: BigInt(crowdfunding.numFunders || 0),
        finalized: crowdfunding.finalized,
        winner: crowdfunding.winner_id ?? null,
        token: crowdfunding.token_id,
        submissions: crowdfunding.submissions,
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
    staleTime: 1000 * 5,
    refetchOnWindowFocus: true,
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
