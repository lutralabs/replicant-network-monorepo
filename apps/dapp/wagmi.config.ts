import { defineConfig } from '@wagmi/cli';
import { foundry } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/generated/RepNetManager.ts',
  contracts: [],
  plugins: [
    foundry({
      project: '../../contracts',
      include: ['RepNetManager.json'],
    }),
  ],
});
