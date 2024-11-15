import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';

const { node, browser } = globals;

export default [
  pluginJs.configs.recommended,
  {
    files: ['**/*.js'],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...node,
        ...browser,
        filePath: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-process-env': 'off',
      'no-process-exit': 'off',
      'no-sync': 'off',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',

      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'prefer-const': 'error',
      'no-var': 'error',

      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',

      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
];
