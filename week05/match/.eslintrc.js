module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'max-len': 'off',
    'guard-for-in': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'no-continue': 'off',
    'no-mixed-operators': 'off',
    'no-labels': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
    'max-classes-per-file': 'off',
    'consistent-return': 'off',
    'no-console': 0,
  },
};
