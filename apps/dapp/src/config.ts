export const CONFIG = {
  mainnet: {
    contractAddress: '0x0000000000000000000000000000000000000000',
    graphqlUrl: '',
  },
  testnet: {
    contractAddress: process.env.CONTRACT_ADDRESS,
    graphqlUrl: 'https://indexer.dev.hyperindex.xyz/fdb5c9c/v1/graphql',
  },
};
