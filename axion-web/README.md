# Axion Test - Frontend

Frontend do teste técnico Axion usando React + Vite + TypeScript.

## Setup

### 1. Backend (Strapi)

```bash
cd axion-test
npm install
npm run develop
```

O Strapi rodará em `http://localhost:1337`

### 2. Frontend (React)

```bash
cd axion-web
npm install
npm run dev
```

O frontend rodará em `http://localhost:5173`

### 3. Configuração

Crie o arquivo `.env` baseado no `.env.example`:

```
VITE_API_BASE_URL=http://localhost:1337
```

### 4. Credenciais de teste

- Email: `axioner@axion.company`
- Senha: `Axioner123`

## Estrutura

```
src/
├── api/          # Cliente HTTP e endpoints
├── auth/         # Autenticação e proteção de rotas
├── pages/        # Páginas (Login, People, Foods, Places)
├── components/   # Componentes reutilizáveis
└── styles/       # Estilos globais e tokens
```

## Funcionalidades

- ✅ Login com Strapi
- ✅ Proteção de rotas
- ✅ Interceptor 401 (logout automático)
- 🚧 Listas de Pessoas, Comidas e Locais
- 🚧 Ordenação asc/desc
- 🚧 Layout responsivo


```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
