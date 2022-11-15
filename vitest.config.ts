import { defineConfig } from 'vitest/config'

import tsconfigPaths from 'vite-tsconfig-paths'
// import typescript from '@rollup/plugin-typescript'
import swc from 'rollup-plugin-swc'

export default defineConfig({
  test: {
    // ...
  },
  plugins: [tsconfigPaths(), swc({
    jsc: {
      parser: {
        syntax: 'typescript',
        // tsx: true, // If you use react
        dynamicImport: true,
        decorators: true
      },
      target: 'es2021',
      transform: {
        decoratorMetadata: true
      }
    }
  })],
  esbuild: false
})
