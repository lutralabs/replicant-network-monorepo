import { NextResponse } from 'next/server';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { repNetManagerAbi } from '@/generated/RepNetManager';
import { defineChain } from 'viem';
import { config } from '@/wagmi';

// Contract address for RepNetManager
const REP_NET_MANAGER_ADDRESS = '0x123456789abcdef123456789abcdef123456789a'; // Replace with actual contract address

// Private key for contract interaction
// WARNING: Never use hardcoded private keys in production!
// This is for development/demo purposes only
const PRIVATE_KEY = '0x0'; // This would be replaced with an actual private key in a secure environment

// Define CrowdfundingPhase enum to match contract
enum CrowdfundingPhase {
  Funding = 0,
  Submission = 1,
  Voting = 2,
  Completed = 3,
  Failed = 4,
}

// Helper function to get the next phase
function getNextPhase(currentPhase: string): CrowdfundingPhase {
  switch (currentPhase) {
    case 'crowdfunding':
      return CrowdfundingPhase.Submission;
    case 'submissions':
      return CrowdfundingPhase.Voting;
    case 'voting':
      return CrowdfundingPhase.Completed;
    default:
      throw new Error(`Cannot advance from phase: ${currentPhase}`);
  }
}

export async function POST(request: Request) {
  // Only allow this in testnet environments
  if (process.env.NEXT_PUBLIC_NETWORK_ENV !== 'testnet') {
    return NextResponse.json(
      { error: 'This endpoint is only available in testnet environment' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { bountyId, currentPhase } = body;

    if (!bountyId) {
      return NextResponse.json(
        { error: 'Bounty ID is required' },
        { status: 400 }
      );
    }

    // Step 4: Setup wallet with private key for contract interaction
    const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
    const client = createWalletClient({
      account,
      chain: config.chains[0], // Use the first chain from config
      transport: http(),
    });

    // Get next phase from current phase
    const nextPhase = getNextPhase(currentPhase);

    // Call the _changePhase function
    const transactionHash = await client.writeContract({
      address: REP_NET_MANAGER_ADDRESS as `0x${string}`,
      abi: repNetManagerAbi,
      functionName: '_changePhase',
      args: [BigInt(bountyId), nextPhase],
      chain: config.chains[0],
      account,
    });

    return NextResponse.json({
      success: true,
      transactionHash,
      message: `Phase changed from ${currentPhase} to ${CrowdfundingPhase[nextPhase]}`,
    });
  } catch (error) {
    console.error('Error changing bounty phase:', error);
    return NextResponse.json(
      { error: `Failed to change phase: ${error.message}` },
      { status: 500 }
    );
  }
}
