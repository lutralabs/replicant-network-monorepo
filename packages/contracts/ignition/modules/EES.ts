import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('EES', (m) => {
  const ees = m.contract('EESCore', [0]);

  m.call(ees, 'getCounter', []);

  return { ees };
});
