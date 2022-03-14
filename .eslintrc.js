module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['standard', 'prettier/standard'],
  plugins: ['spellcheck'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  ignorePatterns: ['.eslintrc.js', 'db/migrations', 'db/seeders', 'data/*.js'],
  rules: {
    'space-before-function-paren': 2,
    'linebreak-style': ['error', 'unix'],
    'spellcheck/spell-checker': [
      2,
      {
        comments: true,
        strings: true,
        identifiers: true,
        lang: 'en_US',
        skipWords: [
          'fastify',
          'sequelize',
          'timestamps',
          'req',
          'endregion',
          'cors',
          'gte',
          'lte',
          'enums',
          'fs',
          'readdir',
          'str'
        ],
        //        skipIfMatch: ['', ''],
        //        skipWordIfMatch: ['', ''],
        ignoreRequire: true
      }
    ]
  }
}
