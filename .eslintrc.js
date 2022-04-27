module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/consistent-type-definitions': ['error', 'type']
  },
  ignorePatterns: [
    '**/*.js'
  ]
}
