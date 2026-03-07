import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:3000/api-json',
  output: {
    path: 'src/shared/types/generated',
    clean: true,
  },
  plugins: [
    '@hey-api/typescript',
  ]
});