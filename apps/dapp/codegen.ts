import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  generates: {
    './src/__generated__/repnet/': {
      documents: './src/lib/graphql/*.graphql',
      config: {
        documentMode: 'string',
      },
      schema: 'https://indexer.dev.hyperindex.xyz/b906ee3/v1/graphql',
      preset: 'client',
      plugins: [],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
