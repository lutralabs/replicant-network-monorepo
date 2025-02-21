import { ethers, upgrades } from 'hardhat';
async function main() {
  const EESWrapper = await ethers.getContractFactory('EESWrapper');
  const eesWrapper = await upgrades.deployProxy(EESWrapper, [0]);
  await eesWrapper.waitForDeployment();
  console.log('EESWrapper deployed to: ', await eesWrapper.getAddress());
}

main();
