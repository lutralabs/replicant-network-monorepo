export const CONFIG = {
  mainnet: {
    contractAddress: '0x0000000000000000000000000000000000000000',
    graphqlUrl: '',
  },
  testnet: {
    contractAddress: process.env.CONTRACT_ADDRESS,
    graphqlUrl: 'https://indexer.dev.hyperindex.xyz/1945022/v1/graphql',
  },
};
