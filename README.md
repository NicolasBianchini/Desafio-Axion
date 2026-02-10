# Projeto Axian

## Desafio
Este projeto foi desenvolvido como parte de um desafio técnico para avaliar habilidades em desenvolvimento full-stack. O objetivo principal é demonstrar a capacidade de criar uma aplicação funcional que integre um backend robusto com um frontend moderno, utilizando tecnologias amplamente adotadas no mercado.

---

## Versões Utilizadas

### Ferramentas e Tecnologias

#### Backend (axion-test)
- **Node.Js**: v14
- **Strapi**: v4.0.8

#### Frontend (axion-web)
- **Node.Js**: v22

---

## Descrição
O Projeto Axian é uma aplicação composta por uma API e uma interface web. O objetivo do projeto é fornecer funcionalidades para gerenciar dados relacionados a alimentos, pessoas e lugares, além de oferecer uma interface amigável para interação com esses dados.

---

## Estrutura do Projeto

A estrutura do projeto está organizada em dois diretórios principais:

1. **axion-test**: Contém a API desenvolvida em Node.js com Strapi.
2. **axion-web**: Contém a interface web desenvolvida em React com Vite.

### Estrutura de Pastas

#### axion-test

```
axion-test/
├── api/                # Contém as APIs para diferentes recursos
│   ├── foods/          # API para gerenciar alimentos
│   │   ├── config/     # Configurações específicas da API de alimentos
│   │   ├── controllers/ # Controladores da API de alimentos
│   │   ├── models/     # Modelos de dados da API de alimentos
│   │   └── services/   # Serviços da API de alimentos
│   ├── people/         # API para gerenciar pessoas
│   ├── places/         # API para gerenciar lugares
├── build/              # Arquivos gerados após o build
├── config/             # Configurações globais do projeto
│   ├── database.js     # Configuração do banco de dados
│   ├── server.js       # Configuração do servidor
├── extensions/         # Extensões do Strapi
├── public/             # Arquivos públicos
├── scripts/            # Scripts utilitários
│   └── seed.js         # Script para popular o banco de dados
```

#### axion-web

```
axion-web/
├── public/             # Arquivos públicos da aplicação web
├── src/                # Código-fonte da aplicação
│   ├── api/            # Configuração do cliente para chamadas à API
│   ├── auth/           # Serviços e lógica de autenticação
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── styles/         # Estilos globais e específicos
│   └── main.tsx        # Arquivo principal da aplicação
├── vite.config.ts      # Configuração do Vite
├── tsconfig.json       # Configuração do TypeScript
```

---

## Tecnologias Utilizadas

### Backend (axion-test)
- **Node.js**
- **Strapi**
- **SQLite** (pode ser substituído por outro banco de dados)

### Frontend (axion-web)
- **React**
- **Vite**
- **TypeScript**

---

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 22 ou superior)
- Gerenciador de pacotes npm ou yarn

### Passos para Executar

#### Backend
1. Navegue até o diretório `axion-test`:
   ```bash
   cd axion-test
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run develop
   ```

#### Frontend
1. Navegue até o diretório `axion-web`:
   ```bash
   cd axion-web
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## Funcionalidades

### Backend
- Gerenciamento de alimentos, pessoas e lugares.
- Autenticação e autorização de usuários.
- API para alteração de senha.

### Frontend
- Interface amigável para gerenciar alimentos, pessoas e lugares.
- Sistema de login e autenticação.
- Rotas protegidas para usuários autenticados.
