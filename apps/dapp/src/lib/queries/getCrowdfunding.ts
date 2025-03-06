import {
  GetCrowdfundingDocument,
  type GetCrowdfundingQuery,
} from '@/__generated__/repnet/graphql';
import { CONFIG } from '@/config';

export const getCrowdfunding = async (id: string) => {
  const url = CONFIG.testnet.graphqlUrl;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GetCrowdfundingDocument,
      variables: {
        id,
      },
    }),
  });

  const jsonResponse = await response.json();

  const data = (jsonResponse.data as GetCrowdfundingQuery).Crowdfunding;

  return data;
};
