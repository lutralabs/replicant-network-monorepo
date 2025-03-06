/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  contract_type: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamp: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** columns and relationships of "Crowdfunding" */
export type Crowdfunding = {
  __typename?: 'Crowdfunding';
  createdAt: Scalars['numeric']['output'];
  /** An object relationship */
  creator?: Maybe<User>;
  creator_id: Scalars['String']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  finalized: Scalars['Boolean']['output'];
  /** An array relationship */
  funders: Array<Funding>;
  fundingPhaseEnd: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  numFunders: Scalars['numeric']['output'];
  numSubmissions: Scalars['numeric']['output'];
  raiseCap: Scalars['numeric']['output'];
  submissionPhaseEnd: Scalars['numeric']['output'];
  /** An array relationship */
  submissions: Array<Submission>;
  /** An object relationship */
  token?: Maybe<Token>;
  token_id: Scalars['String']['output'];
  totalRaised: Scalars['numeric']['output'];
  votingPhaseEnd: Scalars['numeric']['output'];
  /** An object relationship */
  winner?: Maybe<User>;
  winner_id?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "Crowdfunding" */
export type CrowdfundingFundersArgs = {
  distinct_on?: InputMaybe<Array<Funding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Funding_Order_By>>;
  where?: InputMaybe<Funding_Bool_Exp>;
};


/** columns and relationships of "Crowdfunding" */
export type CrowdfundingSubmissionsArgs = {
  distinct_on?: InputMaybe<Array<Submission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submission_Order_By>>;
  where?: InputMaybe<Submission_Bool_Exp>;
};

/** order by aggregate values of table "Crowdfunding" */
export type Crowdfunding_Aggregate_Order_By = {
  avg?: InputMaybe<Crowdfunding_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Crowdfunding_Max_Order_By>;
  min?: InputMaybe<Crowdfunding_Min_Order_By>;
  stddev?: InputMaybe<Crowdfunding_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Crowdfunding_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Crowdfunding_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Crowdfunding_Sum_Order_By>;
  var_pop?: InputMaybe<Crowdfunding_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Crowdfunding_Var_Samp_Order_By>;
  variance?: InputMaybe<Crowdfunding_Variance_Order_By>;
};

/** order by avg() on columns of table "Crowdfunding" */
export type Crowdfunding_Avg_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Crowdfunding". All fields are combined with a logical 'AND'. */
export type Crowdfunding_Bool_Exp = {
  _and?: InputMaybe<Array<Crowdfunding_Bool_Exp>>;
  _not?: InputMaybe<Crowdfunding_Bool_Exp>;
  _or?: InputMaybe<Array<Crowdfunding_Bool_Exp>>;
  createdAt?: InputMaybe<Numeric_Comparison_Exp>;
  creator?: InputMaybe<User_Bool_Exp>;
  creator_id?: InputMaybe<String_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  finalized?: InputMaybe<Boolean_Comparison_Exp>;
  funders?: InputMaybe<Funding_Bool_Exp>;
  fundingPhaseEnd?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  numFunders?: InputMaybe<Numeric_Comparison_Exp>;
  numSubmissions?: InputMaybe<Numeric_Comparison_Exp>;
  raiseCap?: InputMaybe<Numeric_Comparison_Exp>;
  submissionPhaseEnd?: InputMaybe<Numeric_Comparison_Exp>;
  submissions?: InputMaybe<Submission_Bool_Exp>;
  token?: InputMaybe<Token_Bool_Exp>;
  token_id?: InputMaybe<String_Comparison_Exp>;
  totalRaised?: InputMaybe<Numeric_Comparison_Exp>;
  votingPhaseEnd?: InputMaybe<Numeric_Comparison_Exp>;
  winner?: InputMaybe<User_Bool_Exp>;
  winner_id?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "Crowdfunding" */
export type Crowdfunding_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  creator_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  token_id?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
  winner_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Crowdfunding" */
export type Crowdfunding_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  creator_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  token_id?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
  winner_id?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Crowdfunding". */
export type Crowdfunding_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  creator?: InputMaybe<User_Order_By>;
  creator_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  finalized?: InputMaybe<Order_By>;
  funders_aggregate?: InputMaybe<Funding_Aggregate_Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  submissions_aggregate?: InputMaybe<Submission_Aggregate_Order_By>;
  token?: InputMaybe<Token_Order_By>;
  token_id?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
  winner?: InputMaybe<User_Order_By>;
  winner_id?: InputMaybe<Order_By>;
};

/** select columns of table "Crowdfunding" */
export enum Crowdfunding_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CreatorId = 'creator_id',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Finalized = 'finalized',
  /** column name */
  FundingPhaseEnd = 'fundingPhaseEnd',
  /** column name */
  Id = 'id',
  /** column name */
  NumFunders = 'numFunders',
  /** column name */
  NumSubmissions = 'numSubmissions',
  /** column name */
  RaiseCap = 'raiseCap',
  /** column name */
  SubmissionPhaseEnd = 'submissionPhaseEnd',
  /** column name */
  TokenId = 'token_id',
  /** column name */
  TotalRaised = 'totalRaised',
  /** column name */
  VotingPhaseEnd = 'votingPhaseEnd',
  /** column name */
  WinnerId = 'winner_id'
}

/** order by stddev() on columns of table "Crowdfunding" */
export type Crowdfunding_Stddev_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Crowdfunding" */
export type Crowdfunding_Stddev_Pop_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Crowdfunding" */
export type Crowdfunding_Stddev_Samp_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Crowdfunding" */
export type Crowdfunding_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Crowdfunding_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Crowdfunding_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['numeric']['input']>;
  creator_id?: InputMaybe<Scalars['String']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  finalized?: InputMaybe<Scalars['Boolean']['input']>;
  fundingPhaseEnd?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  numFunders?: InputMaybe<Scalars['numeric']['input']>;
  numSubmissions?: InputMaybe<Scalars['numeric']['input']>;
  raiseCap?: InputMaybe<Scalars['numeric']['input']>;
  submissionPhaseEnd?: InputMaybe<Scalars['numeric']['input']>;
  token_id?: InputMaybe<Scalars['String']['input']>;
  totalRaised?: InputMaybe<Scalars['numeric']['input']>;
  votingPhaseEnd?: InputMaybe<Scalars['numeric']['input']>;
  winner_id?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "Crowdfunding" */
export type Crowdfunding_Sum_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Crowdfunding" */
export type Crowdfunding_Var_Pop_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Crowdfunding" */
export type Crowdfunding_Var_Samp_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Crowdfunding" */
export type Crowdfunding_Variance_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  numFunders?: InputMaybe<Order_By>;
  numSubmissions?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  totalRaised?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** columns and relationships of "Funding" */
export type Funding = {
  __typename?: 'Funding';
  amount: Scalars['numeric']['output'];
  /** An object relationship */
  crowdfunding?: Maybe<Crowdfunding>;
  crowdfunding_id: Scalars['String']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  /** An object relationship */
  funder?: Maybe<User>;
  funder_id: Scalars['String']['output'];
  id: Scalars['String']['output'];
  timestamp: Scalars['numeric']['output'];
};

/** order by aggregate values of table "Funding" */
export type Funding_Aggregate_Order_By = {
  avg?: InputMaybe<Funding_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Funding_Max_Order_By>;
  min?: InputMaybe<Funding_Min_Order_By>;
  stddev?: InputMaybe<Funding_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Funding_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Funding_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Funding_Sum_Order_By>;
  var_pop?: InputMaybe<Funding_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Funding_Var_Samp_Order_By>;
  variance?: InputMaybe<Funding_Variance_Order_By>;
};

/** order by avg() on columns of table "Funding" */
export type Funding_Avg_Order_By = {
  amount?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Funding". All fields are combined with a logical 'AND'. */
export type Funding_Bool_Exp = {
  _and?: InputMaybe<Array<Funding_Bool_Exp>>;
  _not?: InputMaybe<Funding_Bool_Exp>;
  _or?: InputMaybe<Array<Funding_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  crowdfunding?: InputMaybe<Crowdfunding_Bool_Exp>;
  crowdfunding_id?: InputMaybe<String_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  funder?: InputMaybe<User_Bool_Exp>;
  funder_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  timestamp?: InputMaybe<Numeric_Comparison_Exp>;
};

/** order by max() on columns of table "Funding" */
export type Funding_Max_Order_By = {
  amount?: InputMaybe<Order_By>;
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  funder_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Funding" */
export type Funding_Min_Order_By = {
  amount?: InputMaybe<Order_By>;
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  funder_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Funding". */
export type Funding_Order_By = {
  amount?: InputMaybe<Order_By>;
  crowdfunding?: InputMaybe<Crowdfunding_Order_By>;
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  funder?: InputMaybe<User_Order_By>;
  funder_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** select columns of table "Funding" */
export enum Funding_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  CrowdfundingId = 'crowdfunding_id',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  FunderId = 'funder_id',
  /** column name */
  Id = 'id',
  /** column name */
  Timestamp = 'timestamp'
}

/** order by stddev() on columns of table "Funding" */
export type Funding_Stddev_Order_By = {
  amount?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Funding" */
export type Funding_Stddev_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Funding" */
export type Funding_Stddev_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Funding" */
export type Funding_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Funding_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Funding_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  crowdfunding_id?: InputMaybe<Scalars['String']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  funder_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "Funding" */
export type Funding_Sum_Order_By = {
  amount?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Funding" */
export type Funding_Var_Pop_Order_By = {
  amount?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Funding" */
export type Funding_Var_Samp_Order_By = {
  amount?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Funding" */
export type Funding_Variance_Order_By = {
  amount?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** columns and relationships of "RepNetManager_CrowdfundingCreated" */
export type RepNetManager_CrowdfundingCreated = {
  __typename?: 'RepNetManager_CrowdfundingCreated';
  creator: Scalars['String']['output'];
  crowdfundingId: Scalars['numeric']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  fundingPhaseEnd: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  raiseCap: Scalars['numeric']['output'];
  submissionPhaseEnd: Scalars['numeric']['output'];
  tokenAddress: Scalars['String']['output'];
  votingPhaseEnd: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "RepNetManager_CrowdfundingCreated". All fields are combined with a logical 'AND'. */
export type RepNetManager_CrowdfundingCreated_Bool_Exp = {
  _and?: InputMaybe<Array<RepNetManager_CrowdfundingCreated_Bool_Exp>>;
  _not?: InputMaybe<RepNetManager_CrowdfundingCreated_Bool_Exp>;
  _or?: InputMaybe<Array<RepNetManager_CrowdfundingCreated_Bool_Exp>>;
  creator?: InputMaybe<String_Comparison_Exp>;
  crowdfundingId?: InputMaybe<Numeric_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  fundingPhaseEnd?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  raiseCap?: InputMaybe<Numeric_Comparison_Exp>;
  submissionPhaseEnd?: InputMaybe<Numeric_Comparison_Exp>;
  tokenAddress?: InputMaybe<String_Comparison_Exp>;
  votingPhaseEnd?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "RepNetManager_CrowdfundingCreated". */
export type RepNetManager_CrowdfundingCreated_Order_By = {
  creator?: InputMaybe<Order_By>;
  crowdfundingId?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  raiseCap?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  tokenAddress?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** select columns of table "RepNetManager_CrowdfundingCreated" */
export enum RepNetManager_CrowdfundingCreated_Select_Column {
  /** column name */
  Creator = 'creator',
  /** column name */
  CrowdfundingId = 'crowdfundingId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  FundingPhaseEnd = 'fundingPhaseEnd',
  /** column name */
  Id = 'id',
  /** column name */
  RaiseCap = 'raiseCap',
  /** column name */
  SubmissionPhaseEnd = 'submissionPhaseEnd',
  /** column name */
  TokenAddress = 'tokenAddress',
  /** column name */
  VotingPhaseEnd = 'votingPhaseEnd'
}

/** Streaming cursor of the table "RepNetManager_CrowdfundingCreated" */
export type RepNetManager_CrowdfundingCreated_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RepNetManager_CrowdfundingCreated_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RepNetManager_CrowdfundingCreated_Stream_Cursor_Value_Input = {
  creator?: InputMaybe<Scalars['String']['input']>;
  crowdfundingId?: InputMaybe<Scalars['numeric']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  fundingPhaseEnd?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  raiseCap?: InputMaybe<Scalars['numeric']['input']>;
  submissionPhaseEnd?: InputMaybe<Scalars['numeric']['input']>;
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  votingPhaseEnd?: InputMaybe<Scalars['numeric']['input']>;
};

/** columns and relationships of "RepNetManager_CrowdfundingFinalized" */
export type RepNetManager_CrowdfundingFinalized = {
  __typename?: 'RepNetManager_CrowdfundingFinalized';
  crowdfundingId: Scalars['numeric']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  winner: Scalars['String']['output'];
};

/** columns and relationships of "RepNetManager_CrowdfundingFinalizedWithoutWinner" */
export type RepNetManager_CrowdfundingFinalizedWithoutWinner = {
  __typename?: 'RepNetManager_CrowdfundingFinalizedWithoutWinner';
  crowdfundingId: Scalars['numeric']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "RepNetManager_CrowdfundingFinalizedWithoutWinner". All fields are combined with a logical 'AND'. */
export type RepNetManager_CrowdfundingFinalizedWithoutWinner_Bool_Exp = {
  _and?: InputMaybe<Array<RepNetManager_CrowdfundingFinalizedWithoutWinner_Bool_Exp>>;
  _not?: InputMaybe<RepNetManager_CrowdfundingFinalizedWithoutWinner_Bool_Exp>;
  _or?: InputMaybe<Array<RepNetManager_CrowdfundingFinalizedWithoutWinner_Bool_Exp>>;
  crowdfundingId?: InputMaybe<Numeric_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "RepNetManager_CrowdfundingFinalizedWithoutWinner". */
export type RepNetManager_CrowdfundingFinalizedWithoutWinner_Order_By = {
  crowdfundingId?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** select columns of table "RepNetManager_CrowdfundingFinalizedWithoutWinner" */
export enum RepNetManager_CrowdfundingFinalizedWithoutWinner_Select_Column {
  /** column name */
  CrowdfundingId = 'crowdfundingId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id'
}

/** Streaming cursor of the table "RepNetManager_CrowdfundingFinalizedWithoutWinner" */
export type RepNetManager_CrowdfundingFinalizedWithoutWinner_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RepNetManager_CrowdfundingFinalizedWithoutWinner_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RepNetManager_CrowdfundingFinalizedWithoutWinner_Stream_Cursor_Value_Input = {
  crowdfundingId?: InputMaybe<Scalars['numeric']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "RepNetManager_CrowdfundingFinalized". All fields are combined with a logical 'AND'. */
export type RepNetManager_CrowdfundingFinalized_Bool_Exp = {
  _and?: InputMaybe<Array<RepNetManager_CrowdfundingFinalized_Bool_Exp>>;
  _not?: InputMaybe<RepNetManager_CrowdfundingFinalized_Bool_Exp>;
  _or?: InputMaybe<Array<RepNetManager_CrowdfundingFinalized_Bool_Exp>>;
  crowdfundingId?: InputMaybe<Numeric_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  winner?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "RepNetManager_CrowdfundingFinalized". */
export type RepNetManager_CrowdfundingFinalized_Order_By = {
  crowdfundingId?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  winner?: InputMaybe<Order_By>;
};

/** select columns of table "RepNetManager_CrowdfundingFinalized" */
export enum RepNetManager_CrowdfundingFinalized_Select_Column {
  /** column name */
  CrowdfundingId = 'crowdfundingId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  Winner = 'winner'
}

/** Streaming cursor of the table "RepNetManager_CrowdfundingFinalized" */
export type RepNetManager_CrowdfundingFinalized_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RepNetManager_CrowdfundingFinalized_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RepNetManager_CrowdfundingFinalized_Stream_Cursor_Value_Input = {
  crowdfundingId?: InputMaybe<Scalars['numeric']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  winner?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "RepNetManager_CrowdfundingFunded" */
export type RepNetManager_CrowdfundingFunded = {
  __typename?: 'RepNetManager_CrowdfundingFunded';
  amount: Scalars['numeric']['output'];
  crowdfundingId: Scalars['numeric']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  sender: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "RepNetManager_CrowdfundingFunded". All fields are combined with a logical 'AND'. */
export type RepNetManager_CrowdfundingFunded_Bool_Exp = {
  _and?: InputMaybe<Array<RepNetManager_CrowdfundingFunded_Bool_Exp>>;
  _not?: InputMaybe<RepNetManager_CrowdfundingFunded_Bool_Exp>;
  _or?: InputMaybe<Array<RepNetManager_CrowdfundingFunded_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  crowdfundingId?: InputMaybe<Numeric_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  sender?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "RepNetManager_CrowdfundingFunded". */
export type RepNetManager_CrowdfundingFunded_Order_By = {
  amount?: InputMaybe<Order_By>;
  crowdfundingId?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** select columns of table "RepNetManager_CrowdfundingFunded" */
export enum RepNetManager_CrowdfundingFunded_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  CrowdfundingId = 'crowdfundingId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  Sender = 'sender'
}

/** Streaming cursor of the table "RepNetManager_CrowdfundingFunded" */
export type RepNetManager_CrowdfundingFunded_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RepNetManager_CrowdfundingFunded_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RepNetManager_CrowdfundingFunded_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  crowdfundingId?: InputMaybe<Scalars['numeric']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "RepNetManager_DebugPhaseChanged" */
export type RepNetManager_DebugPhaseChanged = {
  __typename?: 'RepNetManager_DebugPhaseChanged';
  crowdfundingId: Scalars['numeric']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  fundingPhaseEnd: Scalars['numeric']['output'];
  id: Scalars['String']['output'];
  submissionPhaseEnd: Scalars['numeric']['output'];
  votingPhaseEnd: Scalars['numeric']['output'];
};

/** Boolean expression to filter rows from the table "RepNetManager_DebugPhaseChanged". All fields are combined with a logical 'AND'. */
export type RepNetManager_DebugPhaseChanged_Bool_Exp = {
  _and?: InputMaybe<Array<RepNetManager_DebugPhaseChanged_Bool_Exp>>;
  _not?: InputMaybe<RepNetManager_DebugPhaseChanged_Bool_Exp>;
  _or?: InputMaybe<Array<RepNetManager_DebugPhaseChanged_Bool_Exp>>;
  crowdfundingId?: InputMaybe<Numeric_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  fundingPhaseEnd?: InputMaybe<Numeric_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  submissionPhaseEnd?: InputMaybe<Numeric_Comparison_Exp>;
  votingPhaseEnd?: InputMaybe<Numeric_Comparison_Exp>;
};

/** Ordering options when selecting data from "RepNetManager_DebugPhaseChanged". */
export type RepNetManager_DebugPhaseChanged_Order_By = {
  crowdfundingId?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  fundingPhaseEnd?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  submissionPhaseEnd?: InputMaybe<Order_By>;
  votingPhaseEnd?: InputMaybe<Order_By>;
};

/** select columns of table "RepNetManager_DebugPhaseChanged" */
export enum RepNetManager_DebugPhaseChanged_Select_Column {
  /** column name */
  CrowdfundingId = 'crowdfundingId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  FundingPhaseEnd = 'fundingPhaseEnd',
  /** column name */
  Id = 'id',
  /** column name */
  SubmissionPhaseEnd = 'submissionPhaseEnd',
  /** column name */
  VotingPhaseEnd = 'votingPhaseEnd'
}

/** Streaming cursor of the table "RepNetManager_DebugPhaseChanged" */
export type RepNetManager_DebugPhaseChanged_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RepNetManager_DebugPhaseChanged_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RepNetManager_DebugPhaseChanged_Stream_Cursor_Value_Input = {
  crowdfundingId?: InputMaybe<Scalars['numeric']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  fundingPhaseEnd?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  submissionPhaseEnd?: InputMaybe<Scalars['numeric']['input']>;
  votingPhaseEnd?: InputMaybe<Scalars['numeric']['input']>;
};

/** columns and relationships of "RepNetManager_OwnershipTransferred" */
export type RepNetManager_OwnershipTransferred = {
  __typename?: 'RepNetManager_OwnershipTransferred';
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  newOwner: Scalars['String']['output'];
  previousOwner: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "RepNetManager_OwnershipTransferred". All fields are combined with a logical 'AND'. */
export type RepNetManager_OwnershipTransferred_Bool_Exp = {
  _and?: InputMaybe<Array<RepNetManager_OwnershipTransferred_Bool_Exp>>;
  _not?: InputMaybe<RepNetManager_OwnershipTransferred_Bool_Exp>;
  _or?: InputMaybe<Array<RepNetManager_OwnershipTransferred_Bool_Exp>>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  newOwner?: InputMaybe<String_Comparison_Exp>;
  previousOwner?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "RepNetManager_OwnershipTransferred". */
export type RepNetManager_OwnershipTransferred_Order_By = {
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  newOwner?: InputMaybe<Order_By>;
  previousOwner?: InputMaybe<Order_By>;
};

/** select columns of table "RepNetManager_OwnershipTransferred" */
export enum RepNetManager_OwnershipTransferred_Select_Column {
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  NewOwner = 'newOwner',
  /** column name */
  PreviousOwner = 'previousOwner'
}

/** Streaming cursor of the table "RepNetManager_OwnershipTransferred" */
export type RepNetManager_OwnershipTransferred_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RepNetManager_OwnershipTransferred_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RepNetManager_OwnershipTransferred_Stream_Cursor_Value_Input = {
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  newOwner?: InputMaybe<Scalars['String']['input']>;
  previousOwner?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "RepNetManager_SolutionSubmitted" */
export type RepNetManager_SolutionSubmitted = {
  __typename?: 'RepNetManager_SolutionSubmitted';
  creator: Scalars['String']['output'];
  crowdfundingId: Scalars['numeric']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  submissionId: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "RepNetManager_SolutionSubmitted". All fields are combined with a logical 'AND'. */
export type RepNetManager_SolutionSubmitted_Bool_Exp = {
  _and?: InputMaybe<Array<RepNetManager_SolutionSubmitted_Bool_Exp>>;
  _not?: InputMaybe<RepNetManager_SolutionSubmitted_Bool_Exp>;
  _or?: InputMaybe<Array<RepNetManager_SolutionSubmitted_Bool_Exp>>;
  creator?: InputMaybe<String_Comparison_Exp>;
  crowdfundingId?: InputMaybe<Numeric_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  submissionId?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "RepNetManager_SolutionSubmitted". */
export type RepNetManager_SolutionSubmitted_Order_By = {
  creator?: InputMaybe<Order_By>;
  crowdfundingId?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  submissionId?: InputMaybe<Order_By>;
};

/** select columns of table "RepNetManager_SolutionSubmitted" */
export enum RepNetManager_SolutionSubmitted_Select_Column {
  /** column name */
  Creator = 'creator',
  /** column name */
  CrowdfundingId = 'crowdfundingId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  SubmissionId = 'submissionId'
}

/** Streaming cursor of the table "RepNetManager_SolutionSubmitted" */
export type RepNetManager_SolutionSubmitted_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RepNetManager_SolutionSubmitted_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RepNetManager_SolutionSubmitted_Stream_Cursor_Value_Input = {
  creator?: InputMaybe<Scalars['String']['input']>;
  crowdfundingId?: InputMaybe<Scalars['numeric']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  submissionId?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "RepNetManager_Vote" */
export type RepNetManager_Vote = {
  __typename?: 'RepNetManager_Vote';
  crowdfundingId: Scalars['numeric']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  submissionId: Scalars['String']['output'];
  votePower: Scalars['numeric']['output'];
  voter: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "RepNetManager_Vote". All fields are combined with a logical 'AND'. */
export type RepNetManager_Vote_Bool_Exp = {
  _and?: InputMaybe<Array<RepNetManager_Vote_Bool_Exp>>;
  _not?: InputMaybe<RepNetManager_Vote_Bool_Exp>;
  _or?: InputMaybe<Array<RepNetManager_Vote_Bool_Exp>>;
  crowdfundingId?: InputMaybe<Numeric_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  submissionId?: InputMaybe<String_Comparison_Exp>;
  votePower?: InputMaybe<Numeric_Comparison_Exp>;
  voter?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "RepNetManager_Vote". */
export type RepNetManager_Vote_Order_By = {
  crowdfundingId?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  submissionId?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
  voter?: InputMaybe<Order_By>;
};

/** select columns of table "RepNetManager_Vote" */
export enum RepNetManager_Vote_Select_Column {
  /** column name */
  CrowdfundingId = 'crowdfundingId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  SubmissionId = 'submissionId',
  /** column name */
  VotePower = 'votePower',
  /** column name */
  Voter = 'voter'
}

/** Streaming cursor of the table "RepNetManager_Vote" */
export type RepNetManager_Vote_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RepNetManager_Vote_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RepNetManager_Vote_Stream_Cursor_Value_Input = {
  crowdfundingId?: InputMaybe<Scalars['numeric']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  submissionId?: InputMaybe<Scalars['String']['input']>;
  votePower?: InputMaybe<Scalars['numeric']['input']>;
  voter?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "RepNetManager_Withdrawal" */
export type RepNetManager_Withdrawal = {
  __typename?: 'RepNetManager_Withdrawal';
  amount: Scalars['numeric']['output'];
  crowdfundingId: Scalars['numeric']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  sender: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "RepNetManager_Withdrawal". All fields are combined with a logical 'AND'. */
export type RepNetManager_Withdrawal_Bool_Exp = {
  _and?: InputMaybe<Array<RepNetManager_Withdrawal_Bool_Exp>>;
  _not?: InputMaybe<RepNetManager_Withdrawal_Bool_Exp>;
  _or?: InputMaybe<Array<RepNetManager_Withdrawal_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  crowdfundingId?: InputMaybe<Numeric_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  sender?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "RepNetManager_Withdrawal". */
export type RepNetManager_Withdrawal_Order_By = {
  amount?: InputMaybe<Order_By>;
  crowdfundingId?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  sender?: InputMaybe<Order_By>;
};

/** select columns of table "RepNetManager_Withdrawal" */
export enum RepNetManager_Withdrawal_Select_Column {
  /** column name */
  Amount = 'amount',
  /** column name */
  CrowdfundingId = 'crowdfundingId',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  Sender = 'sender'
}

/** Streaming cursor of the table "RepNetManager_Withdrawal" */
export type RepNetManager_Withdrawal_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: RepNetManager_Withdrawal_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type RepNetManager_Withdrawal_Stream_Cursor_Value_Input = {
  amount?: InputMaybe<Scalars['numeric']['input']>;
  crowdfundingId?: InputMaybe<Scalars['numeric']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "Submission" */
export type Submission = {
  __typename?: 'Submission';
  /** An object relationship */
  creator?: Maybe<User>;
  creator_id: Scalars['String']['output'];
  /** An object relationship */
  crowdfunding?: Maybe<Crowdfunding>;
  crowdfunding_id: Scalars['String']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  timestamp: Scalars['numeric']['output'];
  totalVotesPower: Scalars['numeric']['output'];
  /** An array relationship */
  votes: Array<Vote>;
};


/** columns and relationships of "Submission" */
export type SubmissionVotesArgs = {
  distinct_on?: InputMaybe<Array<Vote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Order_By>>;
  where?: InputMaybe<Vote_Bool_Exp>;
};

/** order by aggregate values of table "Submission" */
export type Submission_Aggregate_Order_By = {
  avg?: InputMaybe<Submission_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Submission_Max_Order_By>;
  min?: InputMaybe<Submission_Min_Order_By>;
  stddev?: InputMaybe<Submission_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Submission_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Submission_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Submission_Sum_Order_By>;
  var_pop?: InputMaybe<Submission_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Submission_Var_Samp_Order_By>;
  variance?: InputMaybe<Submission_Variance_Order_By>;
};

/** order by avg() on columns of table "Submission" */
export type Submission_Avg_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Submission". All fields are combined with a logical 'AND'. */
export type Submission_Bool_Exp = {
  _and?: InputMaybe<Array<Submission_Bool_Exp>>;
  _not?: InputMaybe<Submission_Bool_Exp>;
  _or?: InputMaybe<Array<Submission_Bool_Exp>>;
  creator?: InputMaybe<User_Bool_Exp>;
  creator_id?: InputMaybe<String_Comparison_Exp>;
  crowdfunding?: InputMaybe<Crowdfunding_Bool_Exp>;
  crowdfunding_id?: InputMaybe<String_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  timestamp?: InputMaybe<Numeric_Comparison_Exp>;
  totalVotesPower?: InputMaybe<Numeric_Comparison_Exp>;
  votes?: InputMaybe<Vote_Bool_Exp>;
};

/** order by max() on columns of table "Submission" */
export type Submission_Max_Order_By = {
  creator_id?: InputMaybe<Order_By>;
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Submission" */
export type Submission_Min_Order_By = {
  creator_id?: InputMaybe<Order_By>;
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Submission". */
export type Submission_Order_By = {
  creator?: InputMaybe<User_Order_By>;
  creator_id?: InputMaybe<Order_By>;
  crowdfunding?: InputMaybe<Crowdfunding_Order_By>;
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
  votes_aggregate?: InputMaybe<Vote_Aggregate_Order_By>;
};

/** select columns of table "Submission" */
export enum Submission_Select_Column {
  /** column name */
  CreatorId = 'creator_id',
  /** column name */
  CrowdfundingId = 'crowdfunding_id',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  Timestamp = 'timestamp',
  /** column name */
  TotalVotesPower = 'totalVotesPower'
}

/** order by stddev() on columns of table "Submission" */
export type Submission_Stddev_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Submission" */
export type Submission_Stddev_Pop_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Submission" */
export type Submission_Stddev_Samp_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Submission" */
export type Submission_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Submission_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Submission_Stream_Cursor_Value_Input = {
  creator_id?: InputMaybe<Scalars['String']['input']>;
  crowdfunding_id?: InputMaybe<Scalars['String']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['numeric']['input']>;
  totalVotesPower?: InputMaybe<Scalars['numeric']['input']>;
};

/** order by sum() on columns of table "Submission" */
export type Submission_Sum_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Submission" */
export type Submission_Var_Pop_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Submission" */
export type Submission_Var_Samp_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Submission" */
export type Submission_Variance_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  totalVotesPower?: InputMaybe<Order_By>;
};

/** columns and relationships of "Token" */
export type Token = {
  __typename?: 'Token';
  /** An object relationship */
  crowdfunding?: Maybe<Crowdfunding>;
  crowdfunding_id: Scalars['String']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "Token". All fields are combined with a logical 'AND'. */
export type Token_Bool_Exp = {
  _and?: InputMaybe<Array<Token_Bool_Exp>>;
  _not?: InputMaybe<Token_Bool_Exp>;
  _or?: InputMaybe<Array<Token_Bool_Exp>>;
  crowdfunding?: InputMaybe<Crowdfunding_Bool_Exp>;
  crowdfunding_id?: InputMaybe<String_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "Token". */
export type Token_Order_By = {
  crowdfunding?: InputMaybe<Crowdfunding_Order_By>;
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** select columns of table "Token" */
export enum Token_Select_Column {
  /** column name */
  CrowdfundingId = 'crowdfunding_id',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id'
}

/** Streaming cursor of the table "Token" */
export type Token_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Token_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Token_Stream_Cursor_Value_Input = {
  crowdfunding_id?: InputMaybe<Scalars['String']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "User" */
export type User = {
  __typename?: 'User';
  /** An array relationship */
  createdCrowdfundings: Array<Crowdfunding>;
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  /** An array relationship */
  fundedCrowdfundings: Array<Funding>;
  id: Scalars['String']['output'];
  /** An array relationship */
  submissions: Array<Submission>;
  /** An array relationship */
  wonCrowdfundings: Array<Crowdfunding>;
};


/** columns and relationships of "User" */
export type UserCreatedCrowdfundingsArgs = {
  distinct_on?: InputMaybe<Array<Crowdfunding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Crowdfunding_Order_By>>;
  where?: InputMaybe<Crowdfunding_Bool_Exp>;
};


/** columns and relationships of "User" */
export type UserFundedCrowdfundingsArgs = {
  distinct_on?: InputMaybe<Array<Funding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Funding_Order_By>>;
  where?: InputMaybe<Funding_Bool_Exp>;
};


/** columns and relationships of "User" */
export type UserSubmissionsArgs = {
  distinct_on?: InputMaybe<Array<Submission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submission_Order_By>>;
  where?: InputMaybe<Submission_Bool_Exp>;
};


/** columns and relationships of "User" */
export type UserWonCrowdfundingsArgs = {
  distinct_on?: InputMaybe<Array<Crowdfunding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Crowdfunding_Order_By>>;
  where?: InputMaybe<Crowdfunding_Bool_Exp>;
};

/** Boolean expression to filter rows from the table "User". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  createdCrowdfundings?: InputMaybe<Crowdfunding_Bool_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  fundedCrowdfundings?: InputMaybe<Funding_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  submissions?: InputMaybe<Submission_Bool_Exp>;
  wonCrowdfundings?: InputMaybe<Crowdfunding_Bool_Exp>;
};

/** Ordering options when selecting data from "User". */
export type User_Order_By = {
  createdCrowdfundings_aggregate?: InputMaybe<Crowdfunding_Aggregate_Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  fundedCrowdfundings_aggregate?: InputMaybe<Funding_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  submissions_aggregate?: InputMaybe<Submission_Aggregate_Order_By>;
  wonCrowdfundings_aggregate?: InputMaybe<Crowdfunding_Aggregate_Order_By>;
};

/** select columns of table "User" */
export enum User_Select_Column {
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id'
}

/** Streaming cursor of the table "User" */
export type User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Stream_Cursor_Value_Input = {
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "Vote" */
export type Vote = {
  __typename?: 'Vote';
  /** An object relationship */
  crowdfunding?: Maybe<Crowdfunding>;
  crowdfunding_id: Scalars['String']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  id: Scalars['String']['output'];
  /** An object relationship */
  submission?: Maybe<Submission>;
  submission_id: Scalars['String']['output'];
  timestamp: Scalars['numeric']['output'];
  votePower: Scalars['numeric']['output'];
  /** An object relationship */
  voter?: Maybe<User>;
  voter_id: Scalars['String']['output'];
};

/** order by aggregate values of table "Vote" */
export type Vote_Aggregate_Order_By = {
  avg?: InputMaybe<Vote_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Vote_Max_Order_By>;
  min?: InputMaybe<Vote_Min_Order_By>;
  stddev?: InputMaybe<Vote_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Vote_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Vote_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Vote_Sum_Order_By>;
  var_pop?: InputMaybe<Vote_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Vote_Var_Samp_Order_By>;
  variance?: InputMaybe<Vote_Variance_Order_By>;
};

/** order by avg() on columns of table "Vote" */
export type Vote_Avg_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "Vote". All fields are combined with a logical 'AND'. */
export type Vote_Bool_Exp = {
  _and?: InputMaybe<Array<Vote_Bool_Exp>>;
  _not?: InputMaybe<Vote_Bool_Exp>;
  _or?: InputMaybe<Array<Vote_Bool_Exp>>;
  crowdfunding?: InputMaybe<Crowdfunding_Bool_Exp>;
  crowdfunding_id?: InputMaybe<String_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  submission?: InputMaybe<Submission_Bool_Exp>;
  submission_id?: InputMaybe<String_Comparison_Exp>;
  timestamp?: InputMaybe<Numeric_Comparison_Exp>;
  votePower?: InputMaybe<Numeric_Comparison_Exp>;
  voter?: InputMaybe<User_Bool_Exp>;
  voter_id?: InputMaybe<String_Comparison_Exp>;
};

/** order by max() on columns of table "Vote" */
export type Vote_Max_Order_By = {
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  submission_id?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
  voter_id?: InputMaybe<Order_By>;
};

/** order by min() on columns of table "Vote" */
export type Vote_Min_Order_By = {
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  submission_id?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
  voter_id?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "Vote". */
export type Vote_Order_By = {
  crowdfunding?: InputMaybe<Crowdfunding_Order_By>;
  crowdfunding_id?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  submission?: InputMaybe<Submission_Order_By>;
  submission_id?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
  voter?: InputMaybe<User_Order_By>;
  voter_id?: InputMaybe<Order_By>;
};

/** select columns of table "Vote" */
export enum Vote_Select_Column {
  /** column name */
  CrowdfundingId = 'crowdfunding_id',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  Id = 'id',
  /** column name */
  SubmissionId = 'submission_id',
  /** column name */
  Timestamp = 'timestamp',
  /** column name */
  VotePower = 'votePower',
  /** column name */
  VoterId = 'voter_id'
}

/** order by stddev() on columns of table "Vote" */
export type Vote_Stddev_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
};

/** order by stddev_pop() on columns of table "Vote" */
export type Vote_Stddev_Pop_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
};

/** order by stddev_samp() on columns of table "Vote" */
export type Vote_Stddev_Samp_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "Vote" */
export type Vote_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vote_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vote_Stream_Cursor_Value_Input = {
  crowdfunding_id?: InputMaybe<Scalars['String']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  submission_id?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['numeric']['input']>;
  votePower?: InputMaybe<Scalars['numeric']['input']>;
  voter_id?: InputMaybe<Scalars['String']['input']>;
};

/** order by sum() on columns of table "Vote" */
export type Vote_Sum_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
};

/** order by var_pop() on columns of table "Vote" */
export type Vote_Var_Pop_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
};

/** order by var_samp() on columns of table "Vote" */
export type Vote_Var_Samp_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
};

/** order by variance() on columns of table "Vote" */
export type Vote_Variance_Order_By = {
  timestamp?: InputMaybe<Order_By>;
  votePower?: InputMaybe<Order_By>;
};

/** columns and relationships of "chain_metadata" */
export type Chain_Metadata = {
  __typename?: 'chain_metadata';
  block_height: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  end_block?: Maybe<Scalars['Int']['output']>;
  first_event_block_number?: Maybe<Scalars['Int']['output']>;
  is_hyper_sync: Scalars['Boolean']['output'];
  latest_fetched_block_number: Scalars['Int']['output'];
  latest_processed_block?: Maybe<Scalars['Int']['output']>;
  num_batches_fetched: Scalars['Int']['output'];
  num_events_processed?: Maybe<Scalars['Int']['output']>;
  start_block: Scalars['Int']['output'];
  timestamp_caught_up_to_head_or_endblock?: Maybe<Scalars['timestamptz']['output']>;
};

/** Boolean expression to filter rows from the table "chain_metadata". All fields are combined with a logical 'AND'. */
export type Chain_Metadata_Bool_Exp = {
  _and?: InputMaybe<Array<Chain_Metadata_Bool_Exp>>;
  _not?: InputMaybe<Chain_Metadata_Bool_Exp>;
  _or?: InputMaybe<Array<Chain_Metadata_Bool_Exp>>;
  block_height?: InputMaybe<Int_Comparison_Exp>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  end_block?: InputMaybe<Int_Comparison_Exp>;
  first_event_block_number?: InputMaybe<Int_Comparison_Exp>;
  is_hyper_sync?: InputMaybe<Boolean_Comparison_Exp>;
  latest_fetched_block_number?: InputMaybe<Int_Comparison_Exp>;
  latest_processed_block?: InputMaybe<Int_Comparison_Exp>;
  num_batches_fetched?: InputMaybe<Int_Comparison_Exp>;
  num_events_processed?: InputMaybe<Int_Comparison_Exp>;
  start_block?: InputMaybe<Int_Comparison_Exp>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** Ordering options when selecting data from "chain_metadata". */
export type Chain_Metadata_Order_By = {
  block_height?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
  end_block?: InputMaybe<Order_By>;
  first_event_block_number?: InputMaybe<Order_By>;
  is_hyper_sync?: InputMaybe<Order_By>;
  latest_fetched_block_number?: InputMaybe<Order_By>;
  latest_processed_block?: InputMaybe<Order_By>;
  num_batches_fetched?: InputMaybe<Order_By>;
  num_events_processed?: InputMaybe<Order_By>;
  start_block?: InputMaybe<Order_By>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Order_By>;
};

/** select columns of table "chain_metadata" */
export enum Chain_Metadata_Select_Column {
  /** column name */
  BlockHeight = 'block_height',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  EndBlock = 'end_block',
  /** column name */
  FirstEventBlockNumber = 'first_event_block_number',
  /** column name */
  IsHyperSync = 'is_hyper_sync',
  /** column name */
  LatestFetchedBlockNumber = 'latest_fetched_block_number',
  /** column name */
  LatestProcessedBlock = 'latest_processed_block',
  /** column name */
  NumBatchesFetched = 'num_batches_fetched',
  /** column name */
  NumEventsProcessed = 'num_events_processed',
  /** column name */
  StartBlock = 'start_block',
  /** column name */
  TimestampCaughtUpToHeadOrEndblock = 'timestamp_caught_up_to_head_or_endblock'
}

/** Streaming cursor of the table "chain_metadata" */
export type Chain_Metadata_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Chain_Metadata_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Chain_Metadata_Stream_Cursor_Value_Input = {
  block_height?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  end_block?: InputMaybe<Scalars['Int']['input']>;
  first_event_block_number?: InputMaybe<Scalars['Int']['input']>;
  is_hyper_sync?: InputMaybe<Scalars['Boolean']['input']>;
  latest_fetched_block_number?: InputMaybe<Scalars['Int']['input']>;
  latest_processed_block?: InputMaybe<Scalars['Int']['input']>;
  num_batches_fetched?: InputMaybe<Scalars['Int']['input']>;
  num_events_processed?: InputMaybe<Scalars['Int']['input']>;
  start_block?: InputMaybe<Scalars['Int']['input']>;
  timestamp_caught_up_to_head_or_endblock?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Boolean expression to compare columns of type "contract_type". All fields are combined with logical 'AND'. */
export type Contract_Type_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['contract_type']['input']>;
  _gt?: InputMaybe<Scalars['contract_type']['input']>;
  _gte?: InputMaybe<Scalars['contract_type']['input']>;
  _in?: InputMaybe<Array<Scalars['contract_type']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['contract_type']['input']>;
  _lte?: InputMaybe<Scalars['contract_type']['input']>;
  _neq?: InputMaybe<Scalars['contract_type']['input']>;
  _nin?: InputMaybe<Array<Scalars['contract_type']['input']>>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "dynamic_contract_registry" */
export type Dynamic_Contract_Registry = {
  __typename?: 'dynamic_contract_registry';
  chain_id: Scalars['Int']['output'];
  contract_address: Scalars['String']['output'];
  contract_type: Scalars['contract_type']['output'];
  id: Scalars['String']['output'];
  is_pre_registered: Scalars['Boolean']['output'];
  registering_event_block_number: Scalars['Int']['output'];
  registering_event_block_timestamp: Scalars['Int']['output'];
  registering_event_contract_name: Scalars['String']['output'];
  registering_event_log_index: Scalars['Int']['output'];
  registering_event_name: Scalars['String']['output'];
  registering_event_src_address: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "dynamic_contract_registry". All fields are combined with a logical 'AND'. */
export type Dynamic_Contract_Registry_Bool_Exp = {
  _and?: InputMaybe<Array<Dynamic_Contract_Registry_Bool_Exp>>;
  _not?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>;
  _or?: InputMaybe<Array<Dynamic_Contract_Registry_Bool_Exp>>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  contract_address?: InputMaybe<String_Comparison_Exp>;
  contract_type?: InputMaybe<Contract_Type_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  is_pre_registered?: InputMaybe<Boolean_Comparison_Exp>;
  registering_event_block_number?: InputMaybe<Int_Comparison_Exp>;
  registering_event_block_timestamp?: InputMaybe<Int_Comparison_Exp>;
  registering_event_contract_name?: InputMaybe<String_Comparison_Exp>;
  registering_event_log_index?: InputMaybe<Int_Comparison_Exp>;
  registering_event_name?: InputMaybe<String_Comparison_Exp>;
  registering_event_src_address?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "dynamic_contract_registry". */
export type Dynamic_Contract_Registry_Order_By = {
  chain_id?: InputMaybe<Order_By>;
  contract_address?: InputMaybe<Order_By>;
  contract_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_pre_registered?: InputMaybe<Order_By>;
  registering_event_block_number?: InputMaybe<Order_By>;
  registering_event_block_timestamp?: InputMaybe<Order_By>;
  registering_event_contract_name?: InputMaybe<Order_By>;
  registering_event_log_index?: InputMaybe<Order_By>;
  registering_event_name?: InputMaybe<Order_By>;
  registering_event_src_address?: InputMaybe<Order_By>;
};

/** select columns of table "dynamic_contract_registry" */
export enum Dynamic_Contract_Registry_Select_Column {
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  ContractAddress = 'contract_address',
  /** column name */
  ContractType = 'contract_type',
  /** column name */
  Id = 'id',
  /** column name */
  IsPreRegistered = 'is_pre_registered',
  /** column name */
  RegisteringEventBlockNumber = 'registering_event_block_number',
  /** column name */
  RegisteringEventBlockTimestamp = 'registering_event_block_timestamp',
  /** column name */
  RegisteringEventContractName = 'registering_event_contract_name',
  /** column name */
  RegisteringEventLogIndex = 'registering_event_log_index',
  /** column name */
  RegisteringEventName = 'registering_event_name',
  /** column name */
  RegisteringEventSrcAddress = 'registering_event_src_address'
}

/** Streaming cursor of the table "dynamic_contract_registry" */
export type Dynamic_Contract_Registry_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dynamic_Contract_Registry_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dynamic_Contract_Registry_Stream_Cursor_Value_Input = {
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  contract_address?: InputMaybe<Scalars['String']['input']>;
  contract_type?: InputMaybe<Scalars['contract_type']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  is_pre_registered?: InputMaybe<Scalars['Boolean']['input']>;
  registering_event_block_number?: InputMaybe<Scalars['Int']['input']>;
  registering_event_block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  registering_event_contract_name?: InputMaybe<Scalars['String']['input']>;
  registering_event_log_index?: InputMaybe<Scalars['Int']['input']>;
  registering_event_name?: InputMaybe<Scalars['String']['input']>;
  registering_event_src_address?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "end_of_block_range_scanned_data" */
export type End_Of_Block_Range_Scanned_Data = {
  __typename?: 'end_of_block_range_scanned_data';
  block_hash: Scalars['String']['output'];
  block_number: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
};

/** Boolean expression to filter rows from the table "end_of_block_range_scanned_data". All fields are combined with a logical 'AND'. */
export type End_Of_Block_Range_Scanned_Data_Bool_Exp = {
  _and?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Bool_Exp>>;
  _not?: InputMaybe<End_Of_Block_Range_Scanned_Data_Bool_Exp>;
  _or?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Bool_Exp>>;
  block_hash?: InputMaybe<String_Comparison_Exp>;
  block_number?: InputMaybe<Int_Comparison_Exp>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
};

/** Ordering options when selecting data from "end_of_block_range_scanned_data". */
export type End_Of_Block_Range_Scanned_Data_Order_By = {
  block_hash?: InputMaybe<Order_By>;
  block_number?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
};

/** select columns of table "end_of_block_range_scanned_data" */
export enum End_Of_Block_Range_Scanned_Data_Select_Column {
  /** column name */
  BlockHash = 'block_hash',
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  ChainId = 'chain_id'
}

/** Streaming cursor of the table "end_of_block_range_scanned_data" */
export type End_Of_Block_Range_Scanned_Data_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: End_Of_Block_Range_Scanned_Data_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type End_Of_Block_Range_Scanned_Data_Stream_Cursor_Value_Input = {
  block_hash?: InputMaybe<Scalars['String']['input']>;
  block_number?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
};

/** columns and relationships of "event_sync_state" */
export type Event_Sync_State = {
  __typename?: 'event_sync_state';
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  is_pre_registering_dynamic_contracts: Scalars['Boolean']['output'];
  log_index: Scalars['Int']['output'];
};

/** Boolean expression to filter rows from the table "event_sync_state". All fields are combined with a logical 'AND'. */
export type Event_Sync_State_Bool_Exp = {
  _and?: InputMaybe<Array<Event_Sync_State_Bool_Exp>>;
  _not?: InputMaybe<Event_Sync_State_Bool_Exp>;
  _or?: InputMaybe<Array<Event_Sync_State_Bool_Exp>>;
  block_number?: InputMaybe<Int_Comparison_Exp>;
  block_timestamp?: InputMaybe<Int_Comparison_Exp>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  is_pre_registering_dynamic_contracts?: InputMaybe<Boolean_Comparison_Exp>;
  log_index?: InputMaybe<Int_Comparison_Exp>;
};

/** Ordering options when selecting data from "event_sync_state". */
export type Event_Sync_State_Order_By = {
  block_number?: InputMaybe<Order_By>;
  block_timestamp?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
  is_pre_registering_dynamic_contracts?: InputMaybe<Order_By>;
  log_index?: InputMaybe<Order_By>;
};

/** select columns of table "event_sync_state" */
export enum Event_Sync_State_Select_Column {
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  IsPreRegisteringDynamicContracts = 'is_pre_registering_dynamic_contracts',
  /** column name */
  LogIndex = 'log_index'
}

/** Streaming cursor of the table "event_sync_state" */
export type Event_Sync_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Event_Sync_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Event_Sync_State_Stream_Cursor_Value_Input = {
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  is_pre_registering_dynamic_contracts?: InputMaybe<Scalars['Boolean']['input']>;
  log_index?: InputMaybe<Scalars['Int']['input']>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "persisted_state" */
export type Persisted_State = {
  __typename?: 'persisted_state';
  abi_files_hash: Scalars['String']['output'];
  config_hash: Scalars['String']['output'];
  envio_version: Scalars['String']['output'];
  handler_files_hash: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  schema_hash: Scalars['String']['output'];
};

/** Boolean expression to filter rows from the table "persisted_state". All fields are combined with a logical 'AND'. */
export type Persisted_State_Bool_Exp = {
  _and?: InputMaybe<Array<Persisted_State_Bool_Exp>>;
  _not?: InputMaybe<Persisted_State_Bool_Exp>;
  _or?: InputMaybe<Array<Persisted_State_Bool_Exp>>;
  abi_files_hash?: InputMaybe<String_Comparison_Exp>;
  config_hash?: InputMaybe<String_Comparison_Exp>;
  envio_version?: InputMaybe<String_Comparison_Exp>;
  handler_files_hash?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  schema_hash?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "persisted_state". */
export type Persisted_State_Order_By = {
  abi_files_hash?: InputMaybe<Order_By>;
  config_hash?: InputMaybe<Order_By>;
  envio_version?: InputMaybe<Order_By>;
  handler_files_hash?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  schema_hash?: InputMaybe<Order_By>;
};

/** select columns of table "persisted_state" */
export enum Persisted_State_Select_Column {
  /** column name */
  AbiFilesHash = 'abi_files_hash',
  /** column name */
  ConfigHash = 'config_hash',
  /** column name */
  EnvioVersion = 'envio_version',
  /** column name */
  HandlerFilesHash = 'handler_files_hash',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaHash = 'schema_hash'
}

/** Streaming cursor of the table "persisted_state" */
export type Persisted_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Persisted_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Persisted_State_Stream_Cursor_Value_Input = {
  abi_files_hash?: InputMaybe<Scalars['String']['input']>;
  config_hash?: InputMaybe<Scalars['String']['input']>;
  envio_version?: InputMaybe<Scalars['String']['input']>;
  handler_files_hash?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  schema_hash?: InputMaybe<Scalars['String']['input']>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "Crowdfunding" */
  Crowdfunding: Array<Crowdfunding>;
  /** fetch data from the table: "Crowdfunding" using primary key columns */
  Crowdfunding_by_pk?: Maybe<Crowdfunding>;
  /** fetch data from the table: "Funding" */
  Funding: Array<Funding>;
  /** fetch data from the table: "Funding" using primary key columns */
  Funding_by_pk?: Maybe<Funding>;
  /** fetch data from the table: "RepNetManager_CrowdfundingCreated" */
  RepNetManager_CrowdfundingCreated: Array<RepNetManager_CrowdfundingCreated>;
  /** fetch data from the table: "RepNetManager_CrowdfundingCreated" using primary key columns */
  RepNetManager_CrowdfundingCreated_by_pk?: Maybe<RepNetManager_CrowdfundingCreated>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFinalized" */
  RepNetManager_CrowdfundingFinalized: Array<RepNetManager_CrowdfundingFinalized>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFinalizedWithoutWinner" */
  RepNetManager_CrowdfundingFinalizedWithoutWinner: Array<RepNetManager_CrowdfundingFinalizedWithoutWinner>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFinalizedWithoutWinner" using primary key columns */
  RepNetManager_CrowdfundingFinalizedWithoutWinner_by_pk?: Maybe<RepNetManager_CrowdfundingFinalizedWithoutWinner>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFinalized" using primary key columns */
  RepNetManager_CrowdfundingFinalized_by_pk?: Maybe<RepNetManager_CrowdfundingFinalized>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFunded" */
  RepNetManager_CrowdfundingFunded: Array<RepNetManager_CrowdfundingFunded>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFunded" using primary key columns */
  RepNetManager_CrowdfundingFunded_by_pk?: Maybe<RepNetManager_CrowdfundingFunded>;
  /** fetch data from the table: "RepNetManager_DebugPhaseChanged" */
  RepNetManager_DebugPhaseChanged: Array<RepNetManager_DebugPhaseChanged>;
  /** fetch data from the table: "RepNetManager_DebugPhaseChanged" using primary key columns */
  RepNetManager_DebugPhaseChanged_by_pk?: Maybe<RepNetManager_DebugPhaseChanged>;
  /** fetch data from the table: "RepNetManager_OwnershipTransferred" */
  RepNetManager_OwnershipTransferred: Array<RepNetManager_OwnershipTransferred>;
  /** fetch data from the table: "RepNetManager_OwnershipTransferred" using primary key columns */
  RepNetManager_OwnershipTransferred_by_pk?: Maybe<RepNetManager_OwnershipTransferred>;
  /** fetch data from the table: "RepNetManager_SolutionSubmitted" */
  RepNetManager_SolutionSubmitted: Array<RepNetManager_SolutionSubmitted>;
  /** fetch data from the table: "RepNetManager_SolutionSubmitted" using primary key columns */
  RepNetManager_SolutionSubmitted_by_pk?: Maybe<RepNetManager_SolutionSubmitted>;
  /** fetch data from the table: "RepNetManager_Vote" */
  RepNetManager_Vote: Array<RepNetManager_Vote>;
  /** fetch data from the table: "RepNetManager_Vote" using primary key columns */
  RepNetManager_Vote_by_pk?: Maybe<RepNetManager_Vote>;
  /** fetch data from the table: "RepNetManager_Withdrawal" */
  RepNetManager_Withdrawal: Array<RepNetManager_Withdrawal>;
  /** fetch data from the table: "RepNetManager_Withdrawal" using primary key columns */
  RepNetManager_Withdrawal_by_pk?: Maybe<RepNetManager_Withdrawal>;
  /** fetch data from the table: "Submission" */
  Submission: Array<Submission>;
  /** fetch data from the table: "Submission" using primary key columns */
  Submission_by_pk?: Maybe<Submission>;
  /** fetch data from the table: "Token" */
  Token: Array<Token>;
  /** fetch data from the table: "Token" using primary key columns */
  Token_by_pk?: Maybe<Token>;
  /** fetch data from the table: "User" */
  User: Array<User>;
  /** fetch data from the table: "User" using primary key columns */
  User_by_pk?: Maybe<User>;
  /** fetch data from the table: "Vote" */
  Vote: Array<Vote>;
  /** fetch data from the table: "Vote" using primary key columns */
  Vote_by_pk?: Maybe<Vote>;
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<Chain_Metadata>;
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk?: Maybe<Chain_Metadata>;
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: Array<Dynamic_Contract_Registry>;
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: Maybe<Dynamic_Contract_Registry>;
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data: Array<End_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk?: Maybe<End_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table: "event_sync_state" */
  event_sync_state: Array<Event_Sync_State>;
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk?: Maybe<Event_Sync_State>;
  /** fetch data from the table: "persisted_state" */
  persisted_state: Array<Persisted_State>;
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk?: Maybe<Persisted_State>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>;
};


export type Query_RootCrowdfundingArgs = {
  distinct_on?: InputMaybe<Array<Crowdfunding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Crowdfunding_Order_By>>;
  where?: InputMaybe<Crowdfunding_Bool_Exp>;
};


export type Query_RootCrowdfunding_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootFundingArgs = {
  distinct_on?: InputMaybe<Array<Funding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Funding_Order_By>>;
  where?: InputMaybe<Funding_Bool_Exp>;
};


export type Query_RootFunding_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRepNetManager_CrowdfundingCreatedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_CrowdfundingCreated_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_CrowdfundingCreated_Order_By>>;
  where?: InputMaybe<RepNetManager_CrowdfundingCreated_Bool_Exp>;
};


export type Query_RootRepNetManager_CrowdfundingCreated_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRepNetManager_CrowdfundingFinalizedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_CrowdfundingFinalized_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_CrowdfundingFinalized_Order_By>>;
  where?: InputMaybe<RepNetManager_CrowdfundingFinalized_Bool_Exp>;
};


export type Query_RootRepNetManager_CrowdfundingFinalizedWithoutWinnerArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_CrowdfundingFinalizedWithoutWinner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_CrowdfundingFinalizedWithoutWinner_Order_By>>;
  where?: InputMaybe<RepNetManager_CrowdfundingFinalizedWithoutWinner_Bool_Exp>;
};


export type Query_RootRepNetManager_CrowdfundingFinalizedWithoutWinner_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRepNetManager_CrowdfundingFinalized_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRepNetManager_CrowdfundingFundedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_CrowdfundingFunded_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_CrowdfundingFunded_Order_By>>;
  where?: InputMaybe<RepNetManager_CrowdfundingFunded_Bool_Exp>;
};


export type Query_RootRepNetManager_CrowdfundingFunded_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRepNetManager_DebugPhaseChangedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_DebugPhaseChanged_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_DebugPhaseChanged_Order_By>>;
  where?: InputMaybe<RepNetManager_DebugPhaseChanged_Bool_Exp>;
};


export type Query_RootRepNetManager_DebugPhaseChanged_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRepNetManager_OwnershipTransferredArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_OwnershipTransferred_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_OwnershipTransferred_Order_By>>;
  where?: InputMaybe<RepNetManager_OwnershipTransferred_Bool_Exp>;
};


export type Query_RootRepNetManager_OwnershipTransferred_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRepNetManager_SolutionSubmittedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_SolutionSubmitted_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_SolutionSubmitted_Order_By>>;
  where?: InputMaybe<RepNetManager_SolutionSubmitted_Bool_Exp>;
};


export type Query_RootRepNetManager_SolutionSubmitted_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRepNetManager_VoteArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_Vote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_Vote_Order_By>>;
  where?: InputMaybe<RepNetManager_Vote_Bool_Exp>;
};


export type Query_RootRepNetManager_Vote_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootRepNetManager_WithdrawalArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_Withdrawal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_Withdrawal_Order_By>>;
  where?: InputMaybe<RepNetManager_Withdrawal_Bool_Exp>;
};


export type Query_RootRepNetManager_Withdrawal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootSubmissionArgs = {
  distinct_on?: InputMaybe<Array<Submission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submission_Order_By>>;
  where?: InputMaybe<Submission_Bool_Exp>;
};


export type Query_RootSubmission_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootTokenArgs = {
  distinct_on?: InputMaybe<Array<Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Token_Order_By>>;
  where?: InputMaybe<Token_Bool_Exp>;
};


export type Query_RootToken_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootVoteArgs = {
  distinct_on?: InputMaybe<Array<Vote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Order_By>>;
  where?: InputMaybe<Vote_Bool_Exp>;
};


export type Query_RootVote_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Chain_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Chain_Metadata_Order_By>>;
  where?: InputMaybe<Chain_Metadata_Bool_Exp>;
};


export type Query_RootChain_Metadata_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
};


export type Query_RootDynamic_Contract_RegistryArgs = {
  distinct_on?: InputMaybe<Array<Dynamic_Contract_Registry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dynamic_Contract_Registry_Order_By>>;
  where?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>;
};


export type Query_RootDynamic_Contract_Registry_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Query_RootEnd_Of_Block_Range_Scanned_DataArgs = {
  distinct_on?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Order_By>>;
  where?: InputMaybe<End_Of_Block_Range_Scanned_Data_Bool_Exp>;
};


export type Query_RootEnd_Of_Block_Range_Scanned_Data_By_PkArgs = {
  block_number: Scalars['Int']['input'];
  chain_id: Scalars['Int']['input'];
};


export type Query_RootEvent_Sync_StateArgs = {
  distinct_on?: InputMaybe<Array<Event_Sync_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Event_Sync_State_Order_By>>;
  where?: InputMaybe<Event_Sync_State_Bool_Exp>;
};


export type Query_RootEvent_Sync_State_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
};


export type Query_RootPersisted_StateArgs = {
  distinct_on?: InputMaybe<Array<Persisted_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Persisted_State_Order_By>>;
  where?: InputMaybe<Persisted_State_Bool_Exp>;
};


export type Query_RootPersisted_State_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};


export type Query_RootRaw_Events_By_PkArgs = {
  serial: Scalars['Int']['input'];
};

/** columns and relationships of "raw_events" */
export type Raw_Events = {
  __typename?: 'raw_events';
  block_fields: Scalars['jsonb']['output'];
  block_hash: Scalars['String']['output'];
  block_number: Scalars['Int']['output'];
  block_timestamp: Scalars['Int']['output'];
  chain_id: Scalars['Int']['output'];
  contract_name: Scalars['String']['output'];
  db_write_timestamp?: Maybe<Scalars['timestamp']['output']>;
  event_id: Scalars['numeric']['output'];
  event_name: Scalars['String']['output'];
  log_index: Scalars['Int']['output'];
  params: Scalars['jsonb']['output'];
  serial: Scalars['Int']['output'];
  src_address: Scalars['String']['output'];
  transaction_fields: Scalars['jsonb']['output'];
};


/** columns and relationships of "raw_events" */
export type Raw_EventsBlock_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "raw_events" */
export type Raw_EventsParamsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "raw_events" */
export type Raw_EventsTransaction_FieldsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to filter rows from the table "raw_events". All fields are combined with a logical 'AND'. */
export type Raw_Events_Bool_Exp = {
  _and?: InputMaybe<Array<Raw_Events_Bool_Exp>>;
  _not?: InputMaybe<Raw_Events_Bool_Exp>;
  _or?: InputMaybe<Array<Raw_Events_Bool_Exp>>;
  block_fields?: InputMaybe<Jsonb_Comparison_Exp>;
  block_hash?: InputMaybe<String_Comparison_Exp>;
  block_number?: InputMaybe<Int_Comparison_Exp>;
  block_timestamp?: InputMaybe<Int_Comparison_Exp>;
  chain_id?: InputMaybe<Int_Comparison_Exp>;
  contract_name?: InputMaybe<String_Comparison_Exp>;
  db_write_timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  event_id?: InputMaybe<Numeric_Comparison_Exp>;
  event_name?: InputMaybe<String_Comparison_Exp>;
  log_index?: InputMaybe<Int_Comparison_Exp>;
  params?: InputMaybe<Jsonb_Comparison_Exp>;
  serial?: InputMaybe<Int_Comparison_Exp>;
  src_address?: InputMaybe<String_Comparison_Exp>;
  transaction_fields?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** Ordering options when selecting data from "raw_events". */
export type Raw_Events_Order_By = {
  block_fields?: InputMaybe<Order_By>;
  block_hash?: InputMaybe<Order_By>;
  block_number?: InputMaybe<Order_By>;
  block_timestamp?: InputMaybe<Order_By>;
  chain_id?: InputMaybe<Order_By>;
  contract_name?: InputMaybe<Order_By>;
  db_write_timestamp?: InputMaybe<Order_By>;
  event_id?: InputMaybe<Order_By>;
  event_name?: InputMaybe<Order_By>;
  log_index?: InputMaybe<Order_By>;
  params?: InputMaybe<Order_By>;
  serial?: InputMaybe<Order_By>;
  src_address?: InputMaybe<Order_By>;
  transaction_fields?: InputMaybe<Order_By>;
};

/** select columns of table "raw_events" */
export enum Raw_Events_Select_Column {
  /** column name */
  BlockFields = 'block_fields',
  /** column name */
  BlockHash = 'block_hash',
  /** column name */
  BlockNumber = 'block_number',
  /** column name */
  BlockTimestamp = 'block_timestamp',
  /** column name */
  ChainId = 'chain_id',
  /** column name */
  ContractName = 'contract_name',
  /** column name */
  DbWriteTimestamp = 'db_write_timestamp',
  /** column name */
  EventId = 'event_id',
  /** column name */
  EventName = 'event_name',
  /** column name */
  LogIndex = 'log_index',
  /** column name */
  Params = 'params',
  /** column name */
  Serial = 'serial',
  /** column name */
  SrcAddress = 'src_address',
  /** column name */
  TransactionFields = 'transaction_fields'
}

/** Streaming cursor of the table "raw_events" */
export type Raw_Events_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Raw_Events_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Raw_Events_Stream_Cursor_Value_Input = {
  block_fields?: InputMaybe<Scalars['jsonb']['input']>;
  block_hash?: InputMaybe<Scalars['String']['input']>;
  block_number?: InputMaybe<Scalars['Int']['input']>;
  block_timestamp?: InputMaybe<Scalars['Int']['input']>;
  chain_id?: InputMaybe<Scalars['Int']['input']>;
  contract_name?: InputMaybe<Scalars['String']['input']>;
  db_write_timestamp?: InputMaybe<Scalars['timestamp']['input']>;
  event_id?: InputMaybe<Scalars['numeric']['input']>;
  event_name?: InputMaybe<Scalars['String']['input']>;
  log_index?: InputMaybe<Scalars['Int']['input']>;
  params?: InputMaybe<Scalars['jsonb']['input']>;
  serial?: InputMaybe<Scalars['Int']['input']>;
  src_address?: InputMaybe<Scalars['String']['input']>;
  transaction_fields?: InputMaybe<Scalars['jsonb']['input']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "Crowdfunding" */
  Crowdfunding: Array<Crowdfunding>;
  /** fetch data from the table: "Crowdfunding" using primary key columns */
  Crowdfunding_by_pk?: Maybe<Crowdfunding>;
  /** fetch data from the table in a streaming manner: "Crowdfunding" */
  Crowdfunding_stream: Array<Crowdfunding>;
  /** fetch data from the table: "Funding" */
  Funding: Array<Funding>;
  /** fetch data from the table: "Funding" using primary key columns */
  Funding_by_pk?: Maybe<Funding>;
  /** fetch data from the table in a streaming manner: "Funding" */
  Funding_stream: Array<Funding>;
  /** fetch data from the table: "RepNetManager_CrowdfundingCreated" */
  RepNetManager_CrowdfundingCreated: Array<RepNetManager_CrowdfundingCreated>;
  /** fetch data from the table: "RepNetManager_CrowdfundingCreated" using primary key columns */
  RepNetManager_CrowdfundingCreated_by_pk?: Maybe<RepNetManager_CrowdfundingCreated>;
  /** fetch data from the table in a streaming manner: "RepNetManager_CrowdfundingCreated" */
  RepNetManager_CrowdfundingCreated_stream: Array<RepNetManager_CrowdfundingCreated>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFinalized" */
  RepNetManager_CrowdfundingFinalized: Array<RepNetManager_CrowdfundingFinalized>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFinalizedWithoutWinner" */
  RepNetManager_CrowdfundingFinalizedWithoutWinner: Array<RepNetManager_CrowdfundingFinalizedWithoutWinner>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFinalizedWithoutWinner" using primary key columns */
  RepNetManager_CrowdfundingFinalizedWithoutWinner_by_pk?: Maybe<RepNetManager_CrowdfundingFinalizedWithoutWinner>;
  /** fetch data from the table in a streaming manner: "RepNetManager_CrowdfundingFinalizedWithoutWinner" */
  RepNetManager_CrowdfundingFinalizedWithoutWinner_stream: Array<RepNetManager_CrowdfundingFinalizedWithoutWinner>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFinalized" using primary key columns */
  RepNetManager_CrowdfundingFinalized_by_pk?: Maybe<RepNetManager_CrowdfundingFinalized>;
  /** fetch data from the table in a streaming manner: "RepNetManager_CrowdfundingFinalized" */
  RepNetManager_CrowdfundingFinalized_stream: Array<RepNetManager_CrowdfundingFinalized>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFunded" */
  RepNetManager_CrowdfundingFunded: Array<RepNetManager_CrowdfundingFunded>;
  /** fetch data from the table: "RepNetManager_CrowdfundingFunded" using primary key columns */
  RepNetManager_CrowdfundingFunded_by_pk?: Maybe<RepNetManager_CrowdfundingFunded>;
  /** fetch data from the table in a streaming manner: "RepNetManager_CrowdfundingFunded" */
  RepNetManager_CrowdfundingFunded_stream: Array<RepNetManager_CrowdfundingFunded>;
  /** fetch data from the table: "RepNetManager_DebugPhaseChanged" */
  RepNetManager_DebugPhaseChanged: Array<RepNetManager_DebugPhaseChanged>;
  /** fetch data from the table: "RepNetManager_DebugPhaseChanged" using primary key columns */
  RepNetManager_DebugPhaseChanged_by_pk?: Maybe<RepNetManager_DebugPhaseChanged>;
  /** fetch data from the table in a streaming manner: "RepNetManager_DebugPhaseChanged" */
  RepNetManager_DebugPhaseChanged_stream: Array<RepNetManager_DebugPhaseChanged>;
  /** fetch data from the table: "RepNetManager_OwnershipTransferred" */
  RepNetManager_OwnershipTransferred: Array<RepNetManager_OwnershipTransferred>;
  /** fetch data from the table: "RepNetManager_OwnershipTransferred" using primary key columns */
  RepNetManager_OwnershipTransferred_by_pk?: Maybe<RepNetManager_OwnershipTransferred>;
  /** fetch data from the table in a streaming manner: "RepNetManager_OwnershipTransferred" */
  RepNetManager_OwnershipTransferred_stream: Array<RepNetManager_OwnershipTransferred>;
  /** fetch data from the table: "RepNetManager_SolutionSubmitted" */
  RepNetManager_SolutionSubmitted: Array<RepNetManager_SolutionSubmitted>;
  /** fetch data from the table: "RepNetManager_SolutionSubmitted" using primary key columns */
  RepNetManager_SolutionSubmitted_by_pk?: Maybe<RepNetManager_SolutionSubmitted>;
  /** fetch data from the table in a streaming manner: "RepNetManager_SolutionSubmitted" */
  RepNetManager_SolutionSubmitted_stream: Array<RepNetManager_SolutionSubmitted>;
  /** fetch data from the table: "RepNetManager_Vote" */
  RepNetManager_Vote: Array<RepNetManager_Vote>;
  /** fetch data from the table: "RepNetManager_Vote" using primary key columns */
  RepNetManager_Vote_by_pk?: Maybe<RepNetManager_Vote>;
  /** fetch data from the table in a streaming manner: "RepNetManager_Vote" */
  RepNetManager_Vote_stream: Array<RepNetManager_Vote>;
  /** fetch data from the table: "RepNetManager_Withdrawal" */
  RepNetManager_Withdrawal: Array<RepNetManager_Withdrawal>;
  /** fetch data from the table: "RepNetManager_Withdrawal" using primary key columns */
  RepNetManager_Withdrawal_by_pk?: Maybe<RepNetManager_Withdrawal>;
  /** fetch data from the table in a streaming manner: "RepNetManager_Withdrawal" */
  RepNetManager_Withdrawal_stream: Array<RepNetManager_Withdrawal>;
  /** fetch data from the table: "Submission" */
  Submission: Array<Submission>;
  /** fetch data from the table: "Submission" using primary key columns */
  Submission_by_pk?: Maybe<Submission>;
  /** fetch data from the table in a streaming manner: "Submission" */
  Submission_stream: Array<Submission>;
  /** fetch data from the table: "Token" */
  Token: Array<Token>;
  /** fetch data from the table: "Token" using primary key columns */
  Token_by_pk?: Maybe<Token>;
  /** fetch data from the table in a streaming manner: "Token" */
  Token_stream: Array<Token>;
  /** fetch data from the table: "User" */
  User: Array<User>;
  /** fetch data from the table: "User" using primary key columns */
  User_by_pk?: Maybe<User>;
  /** fetch data from the table in a streaming manner: "User" */
  User_stream: Array<User>;
  /** fetch data from the table: "Vote" */
  Vote: Array<Vote>;
  /** fetch data from the table: "Vote" using primary key columns */
  Vote_by_pk?: Maybe<Vote>;
  /** fetch data from the table in a streaming manner: "Vote" */
  Vote_stream: Array<Vote>;
  /** fetch data from the table: "chain_metadata" */
  chain_metadata: Array<Chain_Metadata>;
  /** fetch data from the table: "chain_metadata" using primary key columns */
  chain_metadata_by_pk?: Maybe<Chain_Metadata>;
  /** fetch data from the table in a streaming manner: "chain_metadata" */
  chain_metadata_stream: Array<Chain_Metadata>;
  /** fetch data from the table: "dynamic_contract_registry" */
  dynamic_contract_registry: Array<Dynamic_Contract_Registry>;
  /** fetch data from the table: "dynamic_contract_registry" using primary key columns */
  dynamic_contract_registry_by_pk?: Maybe<Dynamic_Contract_Registry>;
  /** fetch data from the table in a streaming manner: "dynamic_contract_registry" */
  dynamic_contract_registry_stream: Array<Dynamic_Contract_Registry>;
  /** fetch data from the table: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data: Array<End_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table: "end_of_block_range_scanned_data" using primary key columns */
  end_of_block_range_scanned_data_by_pk?: Maybe<End_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table in a streaming manner: "end_of_block_range_scanned_data" */
  end_of_block_range_scanned_data_stream: Array<End_Of_Block_Range_Scanned_Data>;
  /** fetch data from the table: "event_sync_state" */
  event_sync_state: Array<Event_Sync_State>;
  /** fetch data from the table: "event_sync_state" using primary key columns */
  event_sync_state_by_pk?: Maybe<Event_Sync_State>;
  /** fetch data from the table in a streaming manner: "event_sync_state" */
  event_sync_state_stream: Array<Event_Sync_State>;
  /** fetch data from the table: "persisted_state" */
  persisted_state: Array<Persisted_State>;
  /** fetch data from the table: "persisted_state" using primary key columns */
  persisted_state_by_pk?: Maybe<Persisted_State>;
  /** fetch data from the table in a streaming manner: "persisted_state" */
  persisted_state_stream: Array<Persisted_State>;
  /** fetch data from the table: "raw_events" */
  raw_events: Array<Raw_Events>;
  /** fetch data from the table: "raw_events" using primary key columns */
  raw_events_by_pk?: Maybe<Raw_Events>;
  /** fetch data from the table in a streaming manner: "raw_events" */
  raw_events_stream: Array<Raw_Events>;
};


export type Subscription_RootCrowdfundingArgs = {
  distinct_on?: InputMaybe<Array<Crowdfunding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Crowdfunding_Order_By>>;
  where?: InputMaybe<Crowdfunding_Bool_Exp>;
};


export type Subscription_RootCrowdfunding_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootCrowdfunding_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Crowdfunding_Stream_Cursor_Input>>;
  where?: InputMaybe<Crowdfunding_Bool_Exp>;
};


export type Subscription_RootFundingArgs = {
  distinct_on?: InputMaybe<Array<Funding_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Funding_Order_By>>;
  where?: InputMaybe<Funding_Bool_Exp>;
};


export type Subscription_RootFunding_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootFunding_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Funding_Stream_Cursor_Input>>;
  where?: InputMaybe<Funding_Bool_Exp>;
};


export type Subscription_RootRepNetManager_CrowdfundingCreatedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_CrowdfundingCreated_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_CrowdfundingCreated_Order_By>>;
  where?: InputMaybe<RepNetManager_CrowdfundingCreated_Bool_Exp>;
};


export type Subscription_RootRepNetManager_CrowdfundingCreated_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRepNetManager_CrowdfundingCreated_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RepNetManager_CrowdfundingCreated_Stream_Cursor_Input>>;
  where?: InputMaybe<RepNetManager_CrowdfundingCreated_Bool_Exp>;
};


export type Subscription_RootRepNetManager_CrowdfundingFinalizedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_CrowdfundingFinalized_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_CrowdfundingFinalized_Order_By>>;
  where?: InputMaybe<RepNetManager_CrowdfundingFinalized_Bool_Exp>;
};


export type Subscription_RootRepNetManager_CrowdfundingFinalizedWithoutWinnerArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_CrowdfundingFinalizedWithoutWinner_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_CrowdfundingFinalizedWithoutWinner_Order_By>>;
  where?: InputMaybe<RepNetManager_CrowdfundingFinalizedWithoutWinner_Bool_Exp>;
};


export type Subscription_RootRepNetManager_CrowdfundingFinalizedWithoutWinner_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRepNetManager_CrowdfundingFinalizedWithoutWinner_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RepNetManager_CrowdfundingFinalizedWithoutWinner_Stream_Cursor_Input>>;
  where?: InputMaybe<RepNetManager_CrowdfundingFinalizedWithoutWinner_Bool_Exp>;
};


export type Subscription_RootRepNetManager_CrowdfundingFinalized_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRepNetManager_CrowdfundingFinalized_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RepNetManager_CrowdfundingFinalized_Stream_Cursor_Input>>;
  where?: InputMaybe<RepNetManager_CrowdfundingFinalized_Bool_Exp>;
};


export type Subscription_RootRepNetManager_CrowdfundingFundedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_CrowdfundingFunded_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_CrowdfundingFunded_Order_By>>;
  where?: InputMaybe<RepNetManager_CrowdfundingFunded_Bool_Exp>;
};


export type Subscription_RootRepNetManager_CrowdfundingFunded_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRepNetManager_CrowdfundingFunded_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RepNetManager_CrowdfundingFunded_Stream_Cursor_Input>>;
  where?: InputMaybe<RepNetManager_CrowdfundingFunded_Bool_Exp>;
};


export type Subscription_RootRepNetManager_DebugPhaseChangedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_DebugPhaseChanged_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_DebugPhaseChanged_Order_By>>;
  where?: InputMaybe<RepNetManager_DebugPhaseChanged_Bool_Exp>;
};


export type Subscription_RootRepNetManager_DebugPhaseChanged_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRepNetManager_DebugPhaseChanged_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RepNetManager_DebugPhaseChanged_Stream_Cursor_Input>>;
  where?: InputMaybe<RepNetManager_DebugPhaseChanged_Bool_Exp>;
};


export type Subscription_RootRepNetManager_OwnershipTransferredArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_OwnershipTransferred_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_OwnershipTransferred_Order_By>>;
  where?: InputMaybe<RepNetManager_OwnershipTransferred_Bool_Exp>;
};


export type Subscription_RootRepNetManager_OwnershipTransferred_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRepNetManager_OwnershipTransferred_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RepNetManager_OwnershipTransferred_Stream_Cursor_Input>>;
  where?: InputMaybe<RepNetManager_OwnershipTransferred_Bool_Exp>;
};


export type Subscription_RootRepNetManager_SolutionSubmittedArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_SolutionSubmitted_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_SolutionSubmitted_Order_By>>;
  where?: InputMaybe<RepNetManager_SolutionSubmitted_Bool_Exp>;
};


export type Subscription_RootRepNetManager_SolutionSubmitted_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRepNetManager_SolutionSubmitted_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RepNetManager_SolutionSubmitted_Stream_Cursor_Input>>;
  where?: InputMaybe<RepNetManager_SolutionSubmitted_Bool_Exp>;
};


export type Subscription_RootRepNetManager_VoteArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_Vote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_Vote_Order_By>>;
  where?: InputMaybe<RepNetManager_Vote_Bool_Exp>;
};


export type Subscription_RootRepNetManager_Vote_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRepNetManager_Vote_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RepNetManager_Vote_Stream_Cursor_Input>>;
  where?: InputMaybe<RepNetManager_Vote_Bool_Exp>;
};


export type Subscription_RootRepNetManager_WithdrawalArgs = {
  distinct_on?: InputMaybe<Array<RepNetManager_Withdrawal_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RepNetManager_Withdrawal_Order_By>>;
  where?: InputMaybe<RepNetManager_Withdrawal_Bool_Exp>;
};


export type Subscription_RootRepNetManager_Withdrawal_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootRepNetManager_Withdrawal_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RepNetManager_Withdrawal_Stream_Cursor_Input>>;
  where?: InputMaybe<RepNetManager_Withdrawal_Bool_Exp>;
};


export type Subscription_RootSubmissionArgs = {
  distinct_on?: InputMaybe<Array<Submission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Submission_Order_By>>;
  where?: InputMaybe<Submission_Bool_Exp>;
};


export type Subscription_RootSubmission_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootSubmission_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Submission_Stream_Cursor_Input>>;
  where?: InputMaybe<Submission_Bool_Exp>;
};


export type Subscription_RootTokenArgs = {
  distinct_on?: InputMaybe<Array<Token_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Token_Order_By>>;
  where?: InputMaybe<Token_Bool_Exp>;
};


export type Subscription_RootToken_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootToken_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Token_Stream_Cursor_Input>>;
  where?: InputMaybe<Token_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootUser_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootVoteArgs = {
  distinct_on?: InputMaybe<Array<Vote_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vote_Order_By>>;
  where?: InputMaybe<Vote_Bool_Exp>;
};


export type Subscription_RootVote_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootVote_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vote_Stream_Cursor_Input>>;
  where?: InputMaybe<Vote_Bool_Exp>;
};


export type Subscription_RootChain_MetadataArgs = {
  distinct_on?: InputMaybe<Array<Chain_Metadata_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Chain_Metadata_Order_By>>;
  where?: InputMaybe<Chain_Metadata_Bool_Exp>;
};


export type Subscription_RootChain_Metadata_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
};


export type Subscription_RootChain_Metadata_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Chain_Metadata_Stream_Cursor_Input>>;
  where?: InputMaybe<Chain_Metadata_Bool_Exp>;
};


export type Subscription_RootDynamic_Contract_RegistryArgs = {
  distinct_on?: InputMaybe<Array<Dynamic_Contract_Registry_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Dynamic_Contract_Registry_Order_By>>;
  where?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>;
};


export type Subscription_RootDynamic_Contract_Registry_By_PkArgs = {
  id: Scalars['String']['input'];
};


export type Subscription_RootDynamic_Contract_Registry_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Dynamic_Contract_Registry_Stream_Cursor_Input>>;
  where?: InputMaybe<Dynamic_Contract_Registry_Bool_Exp>;
};


export type Subscription_RootEnd_Of_Block_Range_Scanned_DataArgs = {
  distinct_on?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<End_Of_Block_Range_Scanned_Data_Order_By>>;
  where?: InputMaybe<End_Of_Block_Range_Scanned_Data_Bool_Exp>;
};


export type Subscription_RootEnd_Of_Block_Range_Scanned_Data_By_PkArgs = {
  block_number: Scalars['Int']['input'];
  chain_id: Scalars['Int']['input'];
};


export type Subscription_RootEnd_Of_Block_Range_Scanned_Data_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<End_Of_Block_Range_Scanned_Data_Stream_Cursor_Input>>;
  where?: InputMaybe<End_Of_Block_Range_Scanned_Data_Bool_Exp>;
};


export type Subscription_RootEvent_Sync_StateArgs = {
  distinct_on?: InputMaybe<Array<Event_Sync_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Event_Sync_State_Order_By>>;
  where?: InputMaybe<Event_Sync_State_Bool_Exp>;
};


export type Subscription_RootEvent_Sync_State_By_PkArgs = {
  chain_id: Scalars['Int']['input'];
};


export type Subscription_RootEvent_Sync_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Event_Sync_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Event_Sync_State_Bool_Exp>;
};


export type Subscription_RootPersisted_StateArgs = {
  distinct_on?: InputMaybe<Array<Persisted_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Persisted_State_Order_By>>;
  where?: InputMaybe<Persisted_State_Bool_Exp>;
};


export type Subscription_RootPersisted_State_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootPersisted_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Persisted_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Persisted_State_Bool_Exp>;
};


export type Subscription_RootRaw_EventsArgs = {
  distinct_on?: InputMaybe<Array<Raw_Events_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Raw_Events_Order_By>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};


export type Subscription_RootRaw_Events_By_PkArgs = {
  serial: Scalars['Int']['input'];
};


export type Subscription_RootRaw_Events_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Raw_Events_Stream_Cursor_Input>>;
  where?: InputMaybe<Raw_Events_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

export type GetCrowdfundingQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCrowdfundingQuery = { __typename?: 'query_root', Crowdfunding: Array<{ __typename?: 'Crowdfunding', id: string, fundingPhaseEnd: any, submissionPhaseEnd: any, votingPhaseEnd: any, totalRaised: any, numFunders: any, finalized: boolean, createdAt: any, winner_id?: string | null, raiseCap: any, creator_id: string, numSubmissions: any, token_id: string, funders: Array<{ __typename?: 'Funding', funder_id: string, timestamp: any, amount: any }>, submissions: Array<{ __typename?: 'Submission', creator_id: string, id: string, totalVotesPower: any, timestamp: any, votes: Array<{ __typename?: 'Vote', id: string, votePower: any, voter_id: string, timestamp: any }> }> }> };

export type GetCrowdfundingsQueryVariables = Exact<{
  finalized?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetCrowdfundingsQuery = { __typename?: 'query_root', Crowdfunding: Array<{ __typename?: 'Crowdfunding', id: string, fundingPhaseEnd: any, submissionPhaseEnd: any, votingPhaseEnd: any, totalRaised: any, numFunders: any, raiseCap: any, creator_id: string, numSubmissions: any }> };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];

  constructor(private value: string, public __meta__?: Record<string, any> | undefined) {
    super(value);
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const GetCrowdfundingDocument = new TypedDocumentString(`
    query GetCrowdfunding($id: String = "") {
  Crowdfunding(where: {id: {_eq: $id}}) {
    id
    fundingPhaseEnd
    submissionPhaseEnd
    votingPhaseEnd
    totalRaised
    numFunders
    finalized
    createdAt
    winner_id
    raiseCap
    creator_id
    numSubmissions
    token_id
    funders {
      funder_id
      timestamp
      amount
    }
    submissions {
      creator_id
      id
      votes {
        id
        votePower
        voter_id
        timestamp
      }
      totalVotesPower
      timestamp
    }
  }
}
    `) as unknown as TypedDocumentString<GetCrowdfundingQuery, GetCrowdfundingQueryVariables>;
export const GetCrowdfundingsDocument = new TypedDocumentString(`
    query GetCrowdfundings($finalized: Boolean) {
  Crowdfunding(where: {finalized: {_eq: $finalized}}) {
    id
    fundingPhaseEnd
    submissionPhaseEnd
    votingPhaseEnd
    totalRaised
    numFunders
    raiseCap
    creator_id
    numSubmissions
  }
}
    `) as unknown as TypedDocumentString<GetCrowdfundingsQuery, GetCrowdfundingsQueryVariables>;