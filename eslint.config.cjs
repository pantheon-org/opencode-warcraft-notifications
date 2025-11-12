module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'prefer-arrow': require('eslint-plugin-prefer-arrow'),
      sonarjs: require('eslint-plugin-sonarjs'),
      import: require('eslint-plugin-import'),
      tsdoc: require('eslint-plugin-tsdoc'),
      jsdoc: require('eslint-plugin-jsdoc'),
      prettier: require('eslint-plugin-prettier'),
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
      jsdoc: {
        mode: 'typescript',
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          tabWidth: 2,
          semi: true,
          trailingComma: 'all',
        },
      ],

      'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-statements': ['error', 30],
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',

      complexity: ['warn', 10],
      'import/max-dependencies': ['warn', { max: 10 }],
      'import/no-cycle': 'error',

      'tsdoc/syntax': 'error',

      // JSDoc rules (TypeScript-friendly)
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            ClassDeclaration: true,
            MethodDefinition: false,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
            ClassExpression: false,
          },
          publicOnly: true,
        },
      ],

      'jsdoc/require-param': 'off',
      'jsdoc/check-tag-names': 'warn',
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'no-inner-declarations': 'error',
      // Disallow nested functions (any function defined inside another function)
      'max-nested-callbacks': ['error', 0],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'tsdoc/syntax': 'off',
      'prettier/prettier': 'off',
      'max-lines': 'off',
      'max-nested-callbacks': 'off',
    },
  },
  {
    files: ['src/sound-data/*.ts', 'src/test-utils.ts'],
    rules: {
      'max-lines': 'off',
    },
  },
];
