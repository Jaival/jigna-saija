import js from '@eslint/js';
import globals from 'globals';
import next from 'eslint-config-next';
import prettier from 'eslint-config-prettier/flat';

const config = [
  js.configs.recommended,
  ...next,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      indent: [
        'warn',
        2,
        {
          SwitchCase: 1,
        },
      ],
      quotes: ['error', 'single'],
    },
  },
];

export default config;
