import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', destructuredArrayIgnorePattern: '^[A-Z]' }],
    },
  },
  {
    // Vercel functions and build config run in Node.
    files: ['api/**/*.js', 'vite.config.js', 'scripts/**/*.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    // Mock registries map content keys to components; they're static and don't need fast refresh.
    files: ['src/v2/ui/mocks.jsx', 'src/v2/ui/mocks/**/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    // React Three Fiber: mutating the camera / DOM nodes inside useFrame is the intended pattern.
    files: ['src/v2/scene/**/*.jsx', 'src/v2/film/**/*.jsx'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
])
