import {
  GetCrowdfundingsDocument,
  type GetCrowdfundingsQuery,
} from '@/__generated__/repnet/graphql';
import { CONFIG } from '@/config';

export const getCrowdfundings = async () => {
  const url = CONFIG.testnet.graphqlUrl;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GetCrowdfundingsDocument,
      variables: {},
    }),
  });

  const jsonResponse = await response.json();

  const data = (jsonResponse.data as GetCrowdfundingsQuery).Crowdfunding;

  return data;
};
