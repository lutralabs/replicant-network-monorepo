import { repNetManagerAbi } from '@/generated/RepNetManager';
import { config } from '@/wagmi';
import { simulateContract, writeContract } from '@wagmi/core';
import { NextResponse } from 'next/server';
import { http, createPublicClient, createWalletClient, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;
// Define CrowdfundingPhase enum to match contract
enum CrowdfundingPhase {
  Funding = 0,
  Submission = 1,
  Voting = 2,
  Completed = 3,
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
    const account = privateKeyToAccount(`0x${PRIVATE_KEY}` as `0x${string}`);

    const client = createWalletClient({
      account,
      chain: config.chains[0],
      transport: http(),
    });

    const publicClient = createPublicClient({
      chain: config.chains[0],
      transport: http(),
    });

    console.log('ACCOUNT ADDRESS', account.address.toString());
    console.log('PK', PRIVATE_KEY);
    console.log('CAddr', process.env.CONTRACT_ADDRESS);

    // Get next phase from current phase
    const nextPhase = getNextPhase(currentPhase);

    // Call the _changePhase function
    const result = await publicClient.simulateContract({
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
      abi: repNetManagerAbi,
      functionName: '_changePhase',
      args: [BigInt(bountyId), Number(nextPhase)],
      account: account,
    });

    const transactionHash = await client.writeContract(result.request as any);

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
