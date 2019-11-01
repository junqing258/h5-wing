module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
      "browser": true,
      "node": true,
      "es6": true
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'react-app',
        'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint', 'react'],
    rules: {
      "@typescript-eslint/no-var-requires": 0
    },
  };