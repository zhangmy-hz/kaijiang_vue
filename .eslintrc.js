module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    camelcase: [1, { properties: 'never' }],
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 0
  },

  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
