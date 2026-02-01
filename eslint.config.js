// ESLint flat config - using CommonJS for compatibility
const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script', // CommonJS for build.js
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Modern JavaScript best practices
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      // Allow console in build scripts
      'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      // Code quality rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': 'error',
      radix: 'error',
      yoda: 'error',
    },
  },
  {
    files: ['build.js'],
    rules: {
      // Build scripts can use console more freely
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '*.min.js',
      'config/*/',
      '!config/example/',
    ],
  },
];
