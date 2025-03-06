/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetCrowdfunding($id: String = \"\") {\n  Crowdfunding(where: {id: {_eq: $id}}) {\n    id\n    fundingPhaseEnd\n    submissionPhaseEnd\n    votingPhaseEnd\n    totalRaised\n    numFunders\n    finalized\n    createdAt\n    winner_id\n    raiseCap\n    creator_id\n    numSubmissions\n    token_id\n    funders {\n      funder_id\n      timestamp\n      amount\n    }\n    submissions {\n      creator_id\n      id\n      votes {\n        id\n        votePower\n        voter_id\n        timestamp\n      }\n      totalVotesPower\n      timestamp\n    }\n  }\n}": typeof types.GetCrowdfundingDocument,
    "query GetCrowdfundings($finalized: Boolean) {\n  Crowdfunding(where: {finalized: {_eq: $finalized}}) {\n    id\n    fundingPhaseEnd\n    submissionPhaseEnd\n    votingPhaseEnd\n    totalRaised\n    numFunders\n    raiseCap\n    creator_id\n    numSubmissions\n  }\n}": typeof types.GetCrowdfundingsDocument,
};
const documents: Documents = {
    "query GetCrowdfunding($id: String = \"\") {\n  Crowdfunding(where: {id: {_eq: $id}}) {\n    id\n    fundingPhaseEnd\n    submissionPhaseEnd\n    votingPhaseEnd\n    totalRaised\n    numFunders\n    finalized\n    createdAt\n    winner_id\n    raiseCap\n    creator_id\n    numSubmissions\n    token_id\n    funders {\n      funder_id\n      timestamp\n      amount\n    }\n    submissions {\n      creator_id\n      id\n      votes {\n        id\n        votePower\n        voter_id\n        timestamp\n      }\n      totalVotesPower\n      timestamp\n    }\n  }\n}": types.GetCrowdfundingDocument,
    "query GetCrowdfundings($finalized: Boolean) {\n  Crowdfunding(where: {finalized: {_eq: $finalized}}) {\n    id\n    fundingPhaseEnd\n    submissionPhaseEnd\n    votingPhaseEnd\n    totalRaised\n    numFunders\n    raiseCap\n    creator_id\n    numSubmissions\n  }\n}": types.GetCrowdfundingsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCrowdfunding($id: String = \"\") {\n  Crowdfunding(where: {id: {_eq: $id}}) {\n    id\n    fundingPhaseEnd\n    submissionPhaseEnd\n    votingPhaseEnd\n    totalRaised\n    numFunders\n    finalized\n    createdAt\n    winner_id\n    raiseCap\n    creator_id\n    numSubmissions\n    token_id\n    funders {\n      funder_id\n      timestamp\n      amount\n    }\n    submissions {\n      creator_id\n      id\n      votes {\n        id\n        votePower\n        voter_id\n        timestamp\n      }\n      totalVotesPower\n      timestamp\n    }\n  }\n}"): typeof import('./graphql').GetCrowdfundingDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCrowdfundings($finalized: Boolean) {\n  Crowdfunding(where: {finalized: {_eq: $finalized}}) {\n    id\n    fundingPhaseEnd\n    submissionPhaseEnd\n    votingPhaseEnd\n    totalRaised\n    numFunders\n    raiseCap\n    creator_id\n    numSubmissions\n  }\n}"): typeof import('./graphql').GetCrowdfundingsDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
