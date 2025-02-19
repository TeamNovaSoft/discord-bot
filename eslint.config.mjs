import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

const { node } = globals;
export default [
  pluginJs.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.js'],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...node,
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
      'max-lines': ["error", 250],
      'max-lines-per-function': ["error", 50],
      'import/no-dynamic-require': 'warn',
      'import/no-nodejs-modules': 'warn',

      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'prefer-const': 'error',
      'no-var': 'error',

      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',

      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
];
