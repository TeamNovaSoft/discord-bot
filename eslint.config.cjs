const globals = require('globals');
const pluginJs = require('@eslint/js');
const prettierPlugin = require('eslint-plugin-prettier');
const pluginJest = require('eslint-plugin-jest');

const { node } = globals;

module.exports = [
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
  {
    files: ['**/*.test.js'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
  },
];
