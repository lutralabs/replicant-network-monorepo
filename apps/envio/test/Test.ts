import assert from 'node:assert';
import {
  TestHelpers,
  type RepNetManager_CrowdfundingCreated,
  type RepNetManager_CrowdfundingFinalized,
  type RepNetManager_CrowdfundingFinalizedWithoutWinner,
  type RepNetManager_CrowdfundingFunded,
  type RepNetManager_OwnershipTransferred,
  type RepNetManager_SolutionSubmitted,
  type RepNetManager_Withdrawal,
  type RepNetManager_Vote,
} from 'generated';
const { MockDb, RepNetManager } = TestHelpers;

describe('RepNetManager contract CrowdfundingCreated event tests', () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for RepNetManager contract CrowdfundingCreated event
  const event = RepNetManager.CrowdfundingCreated.createMockEvent({
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  it('RepNetManager_CrowdfundingCreated is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.CrowdfundingCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    const actualRepNetManagerCrowdfundingCreated =
      mockDbUpdated.entities.RepNetManager_CrowdfundingCreated.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedRepNetManagerCrowdfundingCreated: RepNetManager_CrowdfundingCreated =
      {
        id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
        crowdfundingId: event.params.crowdfundingId,
        creator: event.params.creator.toLowerCase(),
        tokenAddress: event.params.tokenAddress.toLowerCase(),
        fundingPhaseEnd: event.params.fundingPhaseEnd,
        submissionPhaseEnd: event.params.submissionPhaseEnd,
        votingPhaseEnd: event.params.votingPhaseEnd,
        raiseCap: event.params.raiseCap,
      };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualRepNetManagerCrowdfundingCreated,
      expectedRepNetManagerCrowdfundingCreated,
      'Actual RepNetManagerCrowdfundingCreated should be the same as the expectedRepNetManagerCrowdfundingCreated'
    );
  });

  it('User entity is created correctly for creator', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.CrowdfundingCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual user entity from the mock database
    const actualUser = mockDbUpdated.entities.User.get(
      event.params.creator.toLowerCase()
    );

    // Creating the expected user entity
    const expectedUser = {
      id: event.params.creator.toLowerCase(),
    };

    // Asserting that the user entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualUser,
      expectedUser,
      'Actual User should be the same as the expected User'
    );
  });

  it('Token entity is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.CrowdfundingCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual token entity from the mock database
    const actualToken = mockDbUpdated.entities.Token.get(
      event.params.tokenAddress.toLowerCase()
    );

    // Creating the expected token entity
    const expectedToken = {
      id: event.params.tokenAddress.toLowerCase(),
      crowdfunding_id: event.params.crowdfundingId.toString(),
    };

    // Asserting that the token entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualToken,
      expectedToken,
      'Actual Token should be the same as the expected Token'
    );
  });

  it('Crowdfunding entity is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.CrowdfundingCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual crowdfunding entity from the mock database
    const actualCrowdfunding = mockDbUpdated.entities.Crowdfunding.get(
      event.params.crowdfundingId.toString()
    );

    // Creating the expected crowdfunding entity
    const expectedCrowdfunding = {
      id: event.params.crowdfundingId.toString(),
      creator_id: event.params.creator.toLowerCase(),
      token_id: event.params.tokenAddress.toLowerCase(),
      winner_id: undefined,
      fundingPhaseEnd: event.params.fundingPhaseEnd,
      submissionPhaseEnd: event.params.submissionPhaseEnd,
      votingPhaseEnd: event.params.votingPhaseEnd,
      raiseCap: event.params.raiseCap,
      finalized: false,
    };

    // Asserting that the crowdfunding entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualCrowdfunding,
      expectedCrowdfunding,
      'Actual Crowdfunding should be the same as the expected Crowdfunding'
    );
  });
});

describe('RepNetManager contract CrowdfundingFinalized event tests', async () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for RepNetManager contract CrowdfundingFinalized event
  const event = RepNetManager.CrowdfundingFinalized.createMockEvent({
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  // Create a mock crowdfunding entity in the database
  const crowdfundingId = event.params.crowdfundingId.toString();
  const mockCrowdfunding = {
    id: crowdfundingId,
    creator_id: '0x123',
    token_id: '0x456',
    winner_id: undefined,
    fundingPhaseEnd: BigInt(1000),
    submissionPhaseEnd: BigInt(2000),
    votingPhaseEnd: BigInt(3000),
    raiseCap: BigInt(5000),
    finalized: false,
  };

  beforeEach(() => {
    // Reset the mockDb before each test
    mockDb.entities.Crowdfunding.delete(crowdfundingId);
    mockDb.entities.Crowdfunding.set(mockCrowdfunding);
  });

  it('RepNetManager_CrowdfundingFinalized is created correctly', async () => {
    // Processing the event
    const mockDbUpdated =
      await RepNetManager.CrowdfundingFinalized.processEvent({
        event,
        mockDb,
      });

    // Getting the actual entity from the mock database
    const actualRepNetManagerCrowdfundingFinalized =
      mockDbUpdated.entities.RepNetManager_CrowdfundingFinalized.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedRepNetManagerCrowdfundingFinalized: RepNetManager_CrowdfundingFinalized =
      {
        id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
        crowdfundingId: event.params.crowdfundingId,
        winner: event.params.winner,
      };

    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualRepNetManagerCrowdfundingFinalized,
      expectedRepNetManagerCrowdfundingFinalized,
      'Actual RepNetManagerCrowdfundingFinalized should be the same as the expectedRepNetManagerCrowdfundingFinalized'
    );
  });

  it('Crowdfunding entity is updated correctly with winner', async () => {
    // Ensure the Crowdfunding entity exists in the mockDb
    const newDb = mockDb.entities.Crowdfunding.set(mockCrowdfunding);

    // Processing the event
    const mockDbUpdated =
      await RepNetManager.CrowdfundingFinalized.processEvent({
        event,
        mockDb: newDb,
      });

    // Getting the actual crowdfunding entity from the mock database
    const actualCrowdfunding = mockDbUpdated.entities.Crowdfunding.get(
      event.params.crowdfundingId.toString()
    );
    // Creating the expected crowdfunding entity
    const expectedCrowdfunding = {
      ...mockCrowdfunding,
      winner_id: event.params.winner,
      finalized: true,
    };

    // Asserting that the crowdfunding entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualCrowdfunding,
      expectedCrowdfunding,
      'Actual Crowdfunding should be updated with winner and finalized set to true'
    );
  });
});

describe('RepNetManager contract CrowdfundingFinalizedWithoutWinner event tests', () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for RepNetManager contract CrowdfundingFinalizedWithoutWinner event
  const event =
    RepNetManager.CrowdfundingFinalizedWithoutWinner.createMockEvent({
      /* It mocks event fields with default values. You can overwrite them if you need */
    });

  // Create a mock crowdfunding entity in the database
  const crowdfundingId = event.params.crowdfundingId.toString();
  const mockCrowdfunding = {
    id: crowdfundingId,
    creator_id: '0x123',
    token_id: '0x456',
    winner_id: undefined,
    fundingPhaseEnd: BigInt(1000),
    submissionPhaseEnd: BigInt(2000),
    votingPhaseEnd: BigInt(3000),
    raiseCap: BigInt(5000),
    finalized: false,
  };

  beforeEach(() => {
    // Reset the mockDb before each test
    mockDb.entities.Crowdfunding.delete(crowdfundingId);
    mockDb.entities.Crowdfunding.set(mockCrowdfunding);
  });

  it('RepNetManager_CrowdfundingFinalizedWithoutWinner is created correctly', async () => {
    // Processing the event
    const mockDbUpdated =
      await RepNetManager.CrowdfundingFinalizedWithoutWinner.processEvent({
        event,
        mockDb,
      });

    // Getting the actual entity from the mock database
    const actualRepNetManagerCrowdfundingFinalizedWithoutWinner =
      mockDbUpdated.entities.RepNetManager_CrowdfundingFinalizedWithoutWinner.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedRepNetManagerCrowdfundingFinalizedWithoutWinner: RepNetManager_CrowdfundingFinalizedWithoutWinner =
      {
        id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
        crowdfundingId: event.params.crowdfundingId,
      };

    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualRepNetManagerCrowdfundingFinalizedWithoutWinner,
      expectedRepNetManagerCrowdfundingFinalizedWithoutWinner,
      'Actual RepNetManagerCrowdfundingFinalizedWithoutWinner should be the same as the expectedRepNetManagerCrowdfundingFinalizedWithoutWinner'
    );
  });

  it('Crowdfunding entity is updated correctly without winner', async () => {
    // Ensure the Crowdfunding entity exists in the mockDb
    const newDb = mockDb.entities.Crowdfunding.set(mockCrowdfunding);

    // Processing the event
    const mockDbUpdated =
      await RepNetManager.CrowdfundingFinalizedWithoutWinner.processEvent({
        event,
        mockDb: newDb,
      });

    // Getting the actual crowdfunding entity from the mock database
    const actualCrowdfunding = mockDbUpdated.entities.Crowdfunding.get(
      event.params.crowdfundingId.toString()
    );

    // Creating the expected crowdfunding entity
    const expectedCrowdfunding = {
      ...mockCrowdfunding,
      finalized: true,
    };

    // Asserting that the crowdfunding entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualCrowdfunding,
      expectedCrowdfunding,
      'Actual Crowdfunding should be updated with finalized set to true'
    );
  });
});

describe('RepNetManager contract CrowdfundingFunded event tests', () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for RepNetManager contract CrowdfundingFunded event
  const event = RepNetManager.CrowdfundingFunded.createMockEvent({
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  it('RepNetManager_CrowdfundingFunded is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.CrowdfundingFunded.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    const actualRepNetManagerCrowdfundingFunded =
      mockDbUpdated.entities.RepNetManager_CrowdfundingFunded.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedRepNetManagerCrowdfundingFunded: RepNetManager_CrowdfundingFunded =
      {
        id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
        crowdfundingId: event.params.crowdfundingId,
        sender: event.params.sender,
        amount: event.params.amount,
      };

    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualRepNetManagerCrowdfundingFunded,
      expectedRepNetManagerCrowdfundingFunded,
      'Actual RepNetManagerCrowdfundingFunded should be the same as the expectedRepNetManagerCrowdfundingFunded'
    );
  });

  it('User entity is created correctly for funder', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.CrowdfundingFunded.processEvent({
      event,
      mockDb,
    });

    // Getting the actual user entity from the mock database
    const actualUser = mockDbUpdated.entities.User.get(
      event.params.sender.toLowerCase()
    );

    // Creating the expected user entity
    const expectedUser = {
      id: event.params.sender.toLowerCase(),
    };

    // Asserting that the user entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualUser,
      expectedUser,
      'Actual User should be the same as the expected User'
    );
  });

  it('Funding entity is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.CrowdfundingFunded.processEvent({
      event,
      mockDb,
    });

    // Getting the actual funding entity from the mock database
    const actualFunding = mockDbUpdated.entities.Funding.get(
      `${event.params.crowdfundingId}_${event.params.sender}`
    );

    // Creating the expected funding entity
    const expectedFunding = {
      id: `${event.params.crowdfundingId}_${event.params.sender}`,
      crowdfunding_id: event.params.crowdfundingId.toString(),
      funder_id: event.params.sender.toLowerCase(),
      amount: event.params.amount,
      timestamp: BigInt(event.block.timestamp),
    };

    // Asserting that the funding entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualFunding,
      expectedFunding,
      'Actual Funding should be the same as the expected Funding'
    );
  });
});

describe('RepNetManager contract OwnershipTransferred event tests', () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for RepNetManager contract OwnershipTransferred event
  const event = RepNetManager.OwnershipTransferred.createMockEvent({
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  it('RepNetManager_OwnershipTransferred is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.OwnershipTransferred.processEvent(
      {
        event,
        mockDb,
      }
    );

    // Getting the actual entity from the mock database
    const actualRepNetManagerOwnershipTransferred =
      mockDbUpdated.entities.RepNetManager_OwnershipTransferred.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedRepNetManagerOwnershipTransferred: RepNetManager_OwnershipTransferred =
      {
        id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
        previousOwner: event.params.previousOwner,
        newOwner: event.params.newOwner,
      };

    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualRepNetManagerOwnershipTransferred,
      expectedRepNetManagerOwnershipTransferred,
      'Actual RepNetManagerOwnershipTransferred should be the same as the expectedRepNetManagerOwnershipTransferred'
    );
  });
});

describe('RepNetManager contract SolutionSubmitted event tests', () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for RepNetManager contract SolutionSubmitted event
  const event = RepNetManager.SolutionSubmitted.createMockEvent({
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  it('RepNetManager_SolutionSubmitted is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.SolutionSubmitted.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    const actualRepNetManagerSolutionSubmitted =
      mockDbUpdated.entities.RepNetManager_SolutionSubmitted.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedRepNetManagerSolutionSubmitted: RepNetManager_SolutionSubmitted =
      {
        id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
        crowdfundingId: event.params.crowdfundingId,
        submissionId: event.params.submissionId,
        creator: event.params.creator.toLowerCase(),
      };

    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualRepNetManagerSolutionSubmitted,
      expectedRepNetManagerSolutionSubmitted,
      'Actual RepNetManagerSolutionSubmitted should be the same as the expectedRepNetManagerSolutionSubmitted'
    );
  });

  it('User entity is created correctly for solution creator', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.SolutionSubmitted.processEvent({
      event,
      mockDb,
    });

    // Getting the actual user entity from the mock database
    const actualUser = mockDbUpdated.entities.User.get(
      event.params.creator.toLowerCase()
    );

    // Creating the expected user entity
    const expectedUser = {
      id: event.params.creator.toLowerCase(),
    };

    // Asserting that the user entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualUser,
      expectedUser,
      'Actual User should be the same as the expected User'
    );
  });

  it('Submission entity is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.SolutionSubmitted.processEvent({
      event,
      mockDb,
    });

    // Getting the actual submission entity from the mock database
    const actualSubmission = mockDbUpdated.entities.Submission.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected submission entity
    const expectedSubmission = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfunding_id: event.params.crowdfundingId.toString(),
      creator_id: event.params.creator.toLowerCase(),
      timestamp: BigInt(event.block.timestamp),
      totalVotesPower: BigInt(0),
    };

    // Asserting that the submission entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualSubmission,
      expectedSubmission,
      'Actual Submission should be the same as the expected Submission'
    );
  });
});

describe('RepNetManager contract Withdrawal event tests', () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for RepNetManager contract Withdrawal event
  const event = RepNetManager.Withdrawal.createMockEvent({
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  it('RepNetManager_Withdrawal is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.Withdrawal.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    const actualRepNetManagerWithdrawal =
      mockDbUpdated.entities.RepNetManager_Withdrawal.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedRepNetManagerWithdrawal: RepNetManager_Withdrawal = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      sender: event.params.sender,
      amount: event.params.amount,
    };

    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualRepNetManagerWithdrawal,
      expectedRepNetManagerWithdrawal,
      'Actual RepNetManagerWithdrawal should be the same as the expectedRepNetManagerWithdrawal'
    );
  });
});

describe('RepNetManager contract Vote event tests', () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for RepNetManager contract Vote event
  const event = RepNetManager.Vote.createMockEvent({
    voter: '0x123',
    /* It mocks event fields with default values. You can overwrite them if you need */
  });

  it('RepNetManager_Vote is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.Vote.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    const actualRepNetManagerVote =
      mockDbUpdated.entities.RepNetManager_Vote.get(
        `${event.chainId}_${event.block.number}_${event.logIndex}`
      );

    // Creating the expected entity
    const expectedRepNetManagerVote: RepNetManager_Vote = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfundingId: event.params.crowdfundingId,
      submissionId: event.params.submissionId,
      voter: event.params.voter,
      votePower: event.params.votePower,
    };

    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualRepNetManagerVote,
      expectedRepNetManagerVote,
      'Actual RepNetManagerVote should be the same as the expectedRepNetManagerVote'
    );
  });

  it('User entity is created correctly for voter', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.Vote.processEvent({
      event,
      mockDb,
    });

    // Getting the actual user entity from the mock database
    const actualUser = mockDbUpdated.entities.User.get(
      event.params.voter.toLowerCase()
    );

    // Creating the expected user entity
    const expectedUser = {
      id: event.params.voter.toLowerCase(),
    };

    // Asserting that the user entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualUser,
      expectedUser,
      'Actual User should be the same as the expected User'
    );
  });

  it('Vote entity is created correctly', async () => {
    // Processing the event
    const mockDbUpdated = await RepNetManager.Vote.processEvent({
      event,
      mockDb,
    });

    // Getting the actual vote entity from the mock database
    const actualVote = mockDbUpdated.entities.Vote.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected vote entity
    const expectedVote = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      crowdfunding_id: event.params.crowdfundingId.toString(),
      submission_id: event.params.submissionId,
      voter_id: event.params.voter.toLowerCase(),
      votePower: event.params.votePower,
      timestamp: BigInt(event.block.timestamp),
    };

    // Asserting that the vote entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualVote,
      expectedVote,
      'Actual Vote should be the same as the expected Vote'
    );
  });
});
