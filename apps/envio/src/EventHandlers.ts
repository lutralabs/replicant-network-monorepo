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
  type User,
  type Crowdfunding,
} from 'generated';

async function ensureUserExists(
  user: User | null,
  context: any,
  address: string
) {
  if (!user) {
    await context.User.set({
      id: address.toLowerCase(),
    });
  }
}

RepNetManager.CrowdfundingCreated.handlerWithLoader({
  loader: async ({ event, context }) => {
    const user = await context.User.get(event.params.creator.toLowerCase());
    if (!user) {
      return null;
    }
    return user;
  },
  handler: async ({ event, context, loaderReturn }) => {
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
    await ensureUserExists(loaderReturn, context, event.params.creator);

    context.RepNetManager_CrowdfundingCreated.set(entity);

    // Create Token entity
    context.Token.set({
      id: event.params.tokenAddress.toLowerCase(),
      crowdfunding_id: event.params.crowdfundingId.toString(),
    });

    // Create Crowdfunding entity
    context.Crowdfunding.set({
      id: event.params.crowdfundingId.toString(),
      creator_id: event.params.creator.toLowerCase(),
      token_id: event.params.tokenAddress.toLowerCase(),
      winner_id: undefined,
      fundingPhaseEnd: event.params.fundingPhaseEnd,
      submissionPhaseEnd: event.params.submissionPhaseEnd,
      votingPhaseEnd: event.params.votingPhaseEnd,
      raiseCap: event.params.raiseCap,
      finalized: false,
    });
  },
});

RepNetManager.CrowdfundingFinalized.handlerWithLoader({
  loader: async ({ event, context }) => {
    const user = await context.User.get(event.params.winner.toLowerCase());
    const crowdfunding = await context.Crowdfunding.get(
      event.params.crowdfundingId.toString()
    );
    if (!user) {
      return { user: null, crowdfunding };
    }
    return { user, crowdfunding };
  },
  handler: async ({ event, context, loaderReturn }) => {
    const entity: RepNetManager_CrowdfundingFinalized = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      winner: event.params.winner,
    };

    await ensureUserExists(loaderReturn.user, context, event.params.winner);
    context.RepNetManager_CrowdfundingFinalized.set(entity);
    context.Crowdfunding.set({
      ...loaderReturn.crowdfunding!,
      winner_id: event.params.winner,
      finalized: true,
    });
  },
});

RepNetManager.CrowdfundingFinalizedWithoutWinner.handlerWithLoader({
  loader: async ({ event, context }) => {
    const crowdfunding = await context.Crowdfunding.get(
      event.params.crowdfundingId.toString()
    );
    return crowdfunding;
  },
  handler: async ({ event, context, loaderReturn }) => {
    const entity: RepNetManager_CrowdfundingFinalizedWithoutWinner = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
    };

    context.RepNetManager_CrowdfundingFinalizedWithoutWinner.set(entity);
    context.Crowdfunding.set({
      ...loaderReturn!,
      finalized: true,
    });
  },
});

RepNetManager.CrowdfundingFunded.handlerWithLoader({
  loader: async ({ event, context }) => {
    const user = await context.User.get(event.params.sender.toLowerCase());
    if (!user) {
      return null;
    }
    return user;
  },
  handler: async ({ event, context, loaderReturn }) => {
    const entity: RepNetManager_CrowdfundingFunded = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      sender: event.params.sender,
      amount: event.params.amount,
    };

    await ensureUserExists(loaderReturn, context, event.params.sender);

    context.RepNetManager_CrowdfundingFunded.set(entity);

    // set funding entity
    context.Funding.set({
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfunding_id: event.params.crowdfundingId.toString(),
      funder_id: event.params.sender.toLowerCase(),
      amount: event.params.amount,
      timestamp: BigInt(event.block.timestamp),
    });
  },
});

RepNetManager.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: RepNetManager_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.RepNetManager_OwnershipTransferred.set(entity);
});

RepNetManager.SolutionSubmitted.handlerWithLoader({
  loader: async ({ event, context }) => {
    const user = await context.User.get(event.params.creator.toLowerCase());
    if (!user) {
      return null;
    }
    return user;
  },
  handler: async ({ event, context, loaderReturn }) => {
    const entity: RepNetManager_SolutionSubmitted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      submissionId: event.params.submissionId,
      creator: event.params.creator.toLowerCase(),
    };
    await ensureUserExists(loaderReturn, context, event.params.creator);
    context.RepNetManager_SolutionSubmitted.set(entity);

    // set submission entity
    context.Submission.set({
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfunding_id: event.params.crowdfundingId.toString(),
      creator_id: event.params.creator.toLowerCase(),
      timestamp: BigInt(event.block.timestamp),
      totalVotesPower: BigInt(0),
    });
  },
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

RepNetManager.Vote.handlerWithLoader({
  loader: async ({ event, context }) => {
    const user = await context.User.get(event.params.voter.toLowerCase());
    if (!user) {
      return null;
    }
    return user;
  },
  handler: async ({ event, context, loaderReturn }) => {
    const entity: RepNetManager_Vote = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      submissionId: event.params.submissionId,
      voter: event.params.voter,
      votePower: event.params.votePower,
    };
    await ensureUserExists(loaderReturn, context, event.params.voter);
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
  },
});
