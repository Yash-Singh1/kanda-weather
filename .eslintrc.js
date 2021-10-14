module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:unicorn/recommended'
  ],
  env: {
    commonjs: true,
    node: true,
    browser: true,
    es6: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6
  },
  parser: '@babel/eslint-parser',
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    'unicorn/prefer-module': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/prefer-array-some': 'off'
  }
};
