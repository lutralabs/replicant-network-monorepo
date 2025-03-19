export const CONFIG = {
  mainnet: {
    contractAddress: '0x0000000000000000000000000000000000000000',
    graphqlUrl: '',
  },
  testnet: {
    contractAddress: process.env.CONTRACT_ADDRESS,
    graphqlUrl: 'https://indexer.hyperindex.xyz/ac9e7e9/v1/graphql',
  },
};
