import { getCrowdfunding } from '@/lib/queries/getCrowdfunding';
import { useQuery } from '@tanstack/react-query';

// Submission type from GraphQL data
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

// Funder type from GraphQL data
type Funder = {
  funder_id: string;
  timestamp: string;
  amount: string;
};

// Extended bounty type including both GraphQL and Supabase data
export type Bounty = {
  // Core bounty data
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
  created_at: bigint;

  // Additional data from GraphQL
  submissions?: Submission[];
  funders?: Funder[];

  // Supabase metadata
  title?: string;
  description?: string;
  type?: string;
  prompters?: string[];
  discord?: string | null;
  email?: string | null;
  telegram?: string | null;
  github?: string | null;
  additionalLinks?: string[] | null;
};

async function fetchBounty(id: number): Promise<Bounty | null> {
  if (id === undefined || id === null) {
    throw new Error('Bounty ID is required');
  }

  console.log(`Fetching bounty with ID: ${id}`);
  const bountyId = BigInt(id).toString();

  try {
    // Fetch base bounty data from GraphQL
    const crowdfundingData = await getCrowdfunding(bountyId);

    if (!crowdfundingData || crowdfundingData.length === 0) {
      console.error('No bounty data found with ID:', id);
      return null;
    }

    const crowdfunding = crowdfundingData[0];

    // Extract submission IDs from the submissions array
    const submissionIds =
      crowdfunding.submissions?.map((sub) => sub.id as `0x${string}`) || [];

    // Determine the current phase based on timestamps
    const now = BigInt(Math.floor(Date.now() / 1000));
    let phase = 0; // Default to funding phase
    if (now > BigInt(crowdfunding.fundingPhaseEnd)) {
      phase = 1; // Submission phase
      if (now > BigInt(crowdfunding.submissionPhaseEnd)) {
        phase = 2; // Voting phase
        if (now > BigInt(crowdfunding.votingPhaseEnd)) {
          phase = 3; // Finalized phase
        }
      }
    }

    // Map GraphQL data to Bounty structure
    const bountyData: Bounty = {
      id: BigInt(crowdfunding.id),
      creator: crowdfunding.creator_id,
      token: crowdfunding.token_id,
      finalized: crowdfunding.finalized,
      winner: crowdfunding.winner_id || '',
      amountRaised: BigInt(crowdfunding.totalRaised || 0),
      fundingPhaseEnd: BigInt(crowdfunding.fundingPhaseEnd),
      submissionPhaseEnd: BigInt(crowdfunding.submissionPhaseEnd),
      votingPhaseEnd: BigInt(crowdfunding.votingPhaseEnd),
      raiseCap: BigInt(crowdfunding.raiseCap),
      developerFeePercentage: BigInt(0), // This field isn't in the GraphQL data
      submissionIds: submissionIds,
      numSubmissions: BigInt(crowdfunding.numSubmissions),
      numFunders: BigInt(crowdfunding.numFunders),
      phase: phase,
      accepted: crowdfunding.finalized,
      created_at: BigInt(crowdfunding.createdAt),

      // Include full submission and funder data
      submissions: crowdfunding.submissions,
      funders: crowdfunding.funders,
    };

    // Fetch metadata from Supabase via API
    const supabaseData = await fetchSupabaseMetadata(id);

    // Combine all data
    const enrichedBounty: Bounty = {
      ...bountyData,
      ...(supabaseData && {
        title: supabaseData.title,
        description: supabaseData.description,
        type: supabaseData.type,
        prompters: supabaseData.prompters,
        discord: supabaseData.discord,
        email: supabaseData.email,
        telegram: supabaseData.telegram,
        github: supabaseData.github,
        additionalLinks: supabaseData.additionalLinks,
      }),
    };

    return enrichedBounty;
  } catch (error) {
    console.error(`Error fetching bounty data for ID ${id}:`, error);
    throw error;
  }
}

async function fetchSupabaseMetadata(id: number) {
  try {
    const response = await fetch(`/api/bounty?id=${id}`);
    if (!response.ok) {
      console.error(`Failed to fetch metadata: ${response.status}`);
      return null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching metadata for bounty ${id}:`, error);
    return null;
  }
}

export function useGetBounty(id: number) {
  const query = useQuery({
    queryKey: ['bounty', id],
    queryFn: () => fetchBounty(id),
    enabled: id !== undefined && id !== null,
    refetchInterval: 1000 * 60, // Refetch every minute
  });

  return {
    bounty: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
