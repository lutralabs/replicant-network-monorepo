import assert from 'node:assert';
import { TestHelpers, type RepNetManager_CrowdfundingCreated } from 'generated';
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
        raiseCap: event.params.raiseCap,
        submissionPhaseEnd: event.params.submissionPhaseEnd,
        votingPhaseEnd: event.params.votingPhaseEnd,
      };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(
      actualRepNetManagerCrowdfundingCreated,
      expectedRepNetManagerCrowdfundingCreated,
      'Actual RepNetManagerCrowdfundingCreated should be the same as the expectedRepNetManagerCrowdfundingCreated'
    );
  });
});
