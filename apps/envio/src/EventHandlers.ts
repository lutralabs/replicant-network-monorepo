/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  RepNetManager,
  type RepNetManager_Vote,
  type RepNetManager_CrowdfundingCreated,
  type RepNetManager_CrowdfundingFinalized,
  type RepNetManager_CrowdfundingFinalizedWithoutWinner,
  type RepNetManager_CrowdfundingFunded,
  type RepNetManager_OwnershipTransferred,
  type RepNetManager_SolutionSubmitted,
  type RepNetManager_Withdrawal,
} from 'generated';

async function ensureUserExists(address: string, context: any) {
  const existingUser = await context.User.get(address.toLowerCase());
  if (!existingUser) {
    await context.User.set({
      id: address.toLowerCase(),
    });
  }
  return address.toLowerCase();
}

RepNetManager.CrowdfundingCreated.handler(async ({ event, context }) => {
  const entity: RepNetManager_CrowdfundingCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    crowdfundingId: event.params.crowdfundingId,
    creator: event.params.creator.toLowerCase(),
    tokenAddress: event.params.tokenAddress.toLowerCase(),
    fundingPhaseEnd: event.params.fundingPhaseEnd,
    submissionPhaseEnd: event.params.submissionPhaseEnd,
    votingPhaseEnd: event.params.votingPhaseEnd,
    raiseCap: event.params.raiseCap,
  };

  context.RepNetManager_CrowdfundingCreated.set(entity);

  // Ensure creator exists
  await ensureUserExists(event.params.creator.toLowerCase(), context);

  // Create Token entity
  await context.Token.set({
    id: event.params.tokenAddress.toLowerCase(),
    crowdfunding_id: event.params.crowdfundingId.toString(),
  });

  // Create Crowdfunding entity
  await context.Crowdfunding.set({
    id: event.params.crowdfundingId.toString(),
    creator_id: event.params.creator.toLowerCase(),
    token_id: event.params.tokenAddress.toLowerCase(),
    amountRaised: event.params.amountRaised,
    winner_id: undefined,
    fundingPhaseEnd: event.params.fundingPhaseEnd,
    submissionPhaseEnd: event.params.submissionPhaseEnd,
    votingPhaseEnd: event.params.votingPhaseEnd,
    raiseCap: event.params.raiseCap,
    finalized: false,
  });
});

RepNetManager.CrowdfundingFinalized.handler(async ({ event, context }) => {
  const entity: RepNetManager_CrowdfundingFinalized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    crowdfundingId: event.params.crowdfundingId,
    winner: event.params.winner,
  };

  context.RepNetManager_CrowdfundingFinalized.set(entity);
  const cfId = event.params.crowdfundingId.toString();
  const cf = await context.Crowdfunding.get(cfId);
  if (cf) {
    await context.Crowdfunding.set({
      ...cf,
      winner_id: event.params.winner,
      finalized: true,
    });
  }
});

RepNetManager.CrowdfundingFinalizedWithoutWinner.handler(
  async ({ event, context }) => {
    const entity: RepNetManager_CrowdfundingFinalizedWithoutWinner = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
    };

    context.RepNetManager_CrowdfundingFinalizedWithoutWinner.set(entity);
    const cfId = event.params.crowdfundingId.toString();
    const cf = await context.Crowdfunding.get(cfId);
    if (cf) {
      context.Crowdfunding.set({
        ...cf,
        finalized: true,
      });
    }
  }
);

RepNetManager.CrowdfundingFunded.handler(async ({ event, context }) => {
  const entity: RepNetManager_CrowdfundingFunded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    crowdfundingId: event.params.crowdfundingId,
    sender: event.params.sender,
    amount: event.params.amount,
  };

  await ensureUserExists(event.params.sender.toLowerCase(), context);

  context.RepNetManager_CrowdfundingFunded.set(entity);

  // set funding entity
  context.Funding.set({
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    crowdfunding_id: event.params.crowdfundingId.toString(),
    funder_id: event.params.sender.toLowerCase(),
    amount: event.params.amount,
    timestamp: BigInt(event.block.timestamp),
  });
});
RepNetManager.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: RepNetManager_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.RepNetManager_OwnershipTransferred.set(entity);
});

RepNetManager.SolutionSubmitted.handler(async ({ event, context }) => {
  const entity: RepNetManager_SolutionSubmitted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    crowdfundingId: event.params.crowdfundingId,
    submissionId: event.params.submissionId,
    creator: event.params.creator.toLowerCase(),
  };
  await ensureUserExists(event.params.creator.toLowerCase(), context);
  context.RepNetManager_SolutionSubmitted.set(entity);

  // set submission entity
  context.Submission.set({
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    crowdfunding_id: event.params.crowdfundingId.toString(),
    creator_id: event.params.creator.toLowerCase(),
    timestamp: BigInt(event.block.timestamp),
    totalVotesPower: BigInt(0),
  });
});

RepNetManager.Withdrawal.handler(async ({ event, context }) => {
  const entity: RepNetManager_Withdrawal = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    crowdfundingId: event.params.crowdfundingId,
    sender: event.params.sender,
    amount: event.params.amount,
  };

  context.RepNetManager_Withdrawal.set(entity);
});

RepNetManager.Vote.handler(async ({ event, context }) => {
  const entity: RepNetManager_Vote = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    crowdfundingId: event.params.crowdfundingId,
    submissionId: event.params.submissionId,
    voter: event.params.voter,
    votePower: event.params.votePower,
  };

  await ensureUserExists(event.params.voter.toLowerCase(), context);
  context.RepNetManager_Vote.set(entity);

  // set vote entity
  context.Vote.set({
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    crowdfunding_id: event.params.crowdfundingId.toString(),
    submission_id: event.params.submissionId,
    voter_id: event.params.voter.toLowerCase(),
    votePower: event.params.votePower,
    timestamp: BigInt(event.block.timestamp),
  });
});
