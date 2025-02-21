import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-foundry';
import '@openzeppelin/hardhat-upgrades';
import '@nomicfoundation/hardhat-ignition-ethers';
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  paths: {
    sources: './src',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.16',
      },
      {
        version: '0.8.15',
      },
      {
        version: '0.8.2',
      },
      {
        version: '0.8.21',
      },
    ],
  },
  networks: {
    sepolia: {
      chainId: 11155111,
      url: `${
        process.env.SEPOLIA_RPC_URL ||
        'https://ethereum-sepolia-rpc.publicnode.com'
      }`,
      accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY}`],
    },
    amoy: {
      chainId: 80002,
      url: `${
        process.env.AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/'
      }`,
      accounts: [`0x${process.env.AMOY_PRIVATE_KEY}`],
    },
    local: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
  },
  ignition: {
    strategyConfig: {
      create2: {
        salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
    },
  },
  gasReporter: {
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_KEY,
    enabled: !!process.env.REPORT_GAS,
    token: 'MATIC',
  },
};

export default config;
