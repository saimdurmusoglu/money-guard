// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

// Prettier entegrasyonu için plugin-prettier ve config-prettier ekliyoruz
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin, // Prettier plugin'ini ekle
    },
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettierConfig, // Prettier konfigürasyonunu ekle (ESLint kurallarıyla çakışanları kapatır)
      prettierPlugin.configs.recommended, // Prettier kurallarını uygula
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Ortam değişkenlerini veya global olarak tanımlanan diğer değişkenleri buraya ekleyebilirsiniz
        // Örneğin: process: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest', // 'latest' de kullanabiliriz
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }], // 'error' yerine 'warn' yaptım, daha az katı olması için
      'react-refresh/only-export-components': 'warn', // Vite'ın hot module replacement için
      'react-hooks/exhaustive-deps': 'warn', // useEffect bağımlılıklarını kontrol eder
      'react/react-in-jsx-scope': 'off', // Yeni React versiyonlarında gerekli değil
      'prettier/prettier': 'error', // Prettier kurallarına uymayanları hata olarak işaretle
      // Ek React kuralları veya özel kurallar buraya eklenebilir
    },
    settings: {
      react: {
        version: 'detect', // Yüklü React versiyonunu otomatik algıla
      },
    },
  },
]);