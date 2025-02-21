import { expect } from 'chai';

describe('EESWrapper', () => {
  it('deploys and upgrades', async () => {
    const EESWrapper = await ethers.getContractFactory('EESWrapper');
    const EESWrapperV2 = await ethers.getContractFactory('EESWrapperV2');

    const instance = await upgrades.deployProxy(EESWrapper, [0]);
    const upgraded = await upgrades.upgradeProxy(
      await instance.getAddress(),
      EESWrapperV2
    );

    const value = await upgraded.getCounter();
    expect(value.toString()).to.equal('0');
  });
});
