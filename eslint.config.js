import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

// Configuration unique du monorepo : `npm run lint` à la racine couvre l'API
// et le client. Les blocs se cumulent dans l'ordre.
export default [
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      'apps/api/src/generated/**',
      'apps/api/src/templates/email/*.html',
    ],
  },

  js.configs.recommended,

  {
    rules: {
      'no-unused-vars': [
        'error',
        {
          // `const { password: _hash, ...reste } = user` retire un champ :
          // c'est le reste qu'on veut, pas la variable.
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['apps/api/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },

  {
    files: ['apps/web/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
  },

  // Après le bloc client : vite.config.js y tomberait sinon avec les globales
  // du navigateur.
  {
    files: ['*.js', '**/*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },

  ...pluginVue.configs['flat/essential'],

  // En dernier : neutralise les règles de style que Prettier gère déjà.
  configPrettier,
];
