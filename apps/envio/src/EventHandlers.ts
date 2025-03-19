/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  type Crowdfunding,
  RepNetManager,
  type RepNetManager_CrowdfundingCreated,
  type RepNetManager_CrowdfundingFinalized,
  type RepNetManager_CrowdfundingFinalizedWithoutWinner,
  type RepNetManager_CrowdfundingFunded,
  type RepNetManager_DebugPhaseChanged,
  type RepNetManager_OwnershipTransferred,
  type RepNetManager_SolutionSubmitted,
  type RepNetManager_Vote,
  type RepNetManager_Withdrawal,
  type User,
} from 'generated';

async function ensureUserExists(
  user: User | null | undefined,
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
      developerFeePercentage: event.params.developerFeePercentage,
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
      numSubmissions: BigInt(0),
      totalRaised: BigInt(0),
      numFunders: BigInt(0),
      createdAt: BigInt(event.block.timestamp),
      fundingPhaseEnd: event.params.fundingPhaseEnd,
      submissionPhaseEnd: event.params.submissionPhaseEnd,
      votingPhaseEnd: event.params.votingPhaseEnd,
      raiseCap: event.params.raiseCap,
      developerFeePercentage: event.params.developerFeePercentage,
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
    const crowdfunding = await context.Crowdfunding.get(
      event.params.crowdfundingId.toString()
    );
    const funding = await context.Funding.get(
      `${event.params.crowdfundingId}_${event.params.sender}`
    );
    if (!user && !funding) {
      return { user: null, funding: null, crowdfunding };
    }
    if (user && !funding) {
      return { user, funding: null, crowdfunding };
    }
    if (!user && funding) {
      return { user: null, funding, crowdfunding };
    }
    return { user, funding, crowdfunding };
  },
  handler: async ({ event, context, loaderReturn }) => {
    const entity: RepNetManager_CrowdfundingFunded = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      sender: event.params.sender,
      amount: event.params.amount,
    };

    await ensureUserExists(loaderReturn!.user, context, event.params.sender);

    context.RepNetManager_CrowdfundingFunded.set(entity);

    if (loaderReturn!.funding) {
      context.Funding.set({
        ...loaderReturn!.funding,
        amount: loaderReturn!.funding.amount + event.params.amount,
      });
      context.Crowdfunding.set({
        ...loaderReturn!.crowdfunding!,
        totalRaised:
          loaderReturn!.crowdfunding!.totalRaised + event.params.amount,
      });
    } else {
      // set funding entity
      context.Crowdfunding.set({
        ...loaderReturn!.crowdfunding!,
        totalRaised:
          loaderReturn!.crowdfunding!.totalRaised + event.params.amount,
        numFunders: loaderReturn!.crowdfunding!.numFunders + BigInt(1),
      });
      context.Funding.set({
        id: `${event.params.crowdfundingId}_${event.params.sender}`,
        crowdfunding_id: event.params.crowdfundingId.toString(),
        funder_id: event.params.sender.toLowerCase(),
        amount: event.params.amount,
        timestamp: BigInt(event.block.timestamp),
      });
    }
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
    const crowdfunding = await context.Crowdfunding.get(
      event.params.crowdfundingId.toString()
    );
    if (!user) {
      return { user: null, crowdfunding };
    }
    return { user, crowdfunding };
  },
  handler: async ({ event, context, loaderReturn }) => {
    const entity: RepNetManager_SolutionSubmitted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      submissionId: event.params.submissionId,
      creator: event.params.creator.toLowerCase(),
    };
    await ensureUserExists(loaderReturn.user, context, event.params.creator);
    context.RepNetManager_SolutionSubmitted.set(entity);

    context.Crowdfunding.set({
      ...loaderReturn.crowdfunding!,
      numSubmissions: loaderReturn.crowdfunding!.numSubmissions + BigInt(1),
    });
    // set submission entity
    context.Submission.set({
      id: `${event.params.crowdfundingId}_${event.params.submissionId}`,
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
    const submission = await context.Submission.get(
      `${event.params.crowdfundingId}_${event.params.submissionId}`
    );
    if (!user) {
      return { user: null, submission: submission };
    }
    return { user, submission };
  },
  handler: async ({ event, context, loaderReturn }) => {
    const entity: RepNetManager_Vote = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      submissionId: event.params.submissionId,
      voter: event.params.voter,
      votePower: event.params.votePower,
    };
    await ensureUserExists(loaderReturn.user, context, event.params.voter);
    context.RepNetManager_Vote.set(entity);

    // set vote entity
    context.Vote.set({
      id: `${event.params.crowdfundingId}_${event.params.submissionId}_${event.params.voter}`,
      crowdfunding_id: event.params.crowdfundingId.toString(),
      submission_id: `${event.params.crowdfundingId.toString()}_${event.params.submissionId}`,
      voter_id: event.params.voter.toLowerCase(),
      votePower: event.params.votePower,
      timestamp: BigInt(event.block.timestamp),
    });
    context.Submission.set({
      ...loaderReturn.submission!,
      totalVotesPower:
        loaderReturn.submission!.totalVotesPower + event.params.votePower,
    });
  },
});

RepNetManager.DebugPhaseChanged.handlerWithLoader({
  loader: async ({ event, context }) => {
    const crowdfunding = await context.Crowdfunding.get(
      event.params.crowdfundingId.toString()
    );
    return crowdfunding;
  },
  handler: async ({ event, context, loaderReturn }) => {
    const entity: RepNetManager_DebugPhaseChanged = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      fundingPhaseEnd: event.params.fundingPhaseEnd,
      submissionPhaseEnd: event.params.submissionPhaseEnd,
      votingPhaseEnd: event.params.votingPhaseEnd,
    };

    context.RepNetManager_DebugPhaseChanged.set(entity);

    context.Crowdfunding.set({
      ...loaderReturn!,
      fundingPhaseEnd: event.params.fundingPhaseEnd,
      submissionPhaseEnd: event.params.submissionPhaseEnd,
      votingPhaseEnd: event.params.votingPhaseEnd,
    });
  },
});
