// scripts/upgrade-box.js
const { ethers, upgrades } = require('hardhat');

const EESWRAPPER_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

async function main() {
  const EESWrapperV2 = await ethers.getContractFactory('EESWrapper');
  const eesWrapper = await upgrades.upgradeProxy(
    EESWRAPPER_ADDRESS,
    EESWrapperV2
  );
  console.log('EESWrapper upgraded');
}

main();
