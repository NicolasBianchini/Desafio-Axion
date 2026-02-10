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

---

# Teste Técnico

## Introdução
Para o desenvolvimento das atividades mais frequentes no seu dia a dia, acreditamos que seja interessante que você domine tanto o desenvolvimento front-end quanto o back-end. Mas fique tranquilo, dominar os dois lados não é tão assustador quanto parece.

Por aqui nós desenvolvemos muito para a WEB. Isso quer dizer que você deve se familiarizar com termos como Cloud, APIs, Arquitetura Server-Client e tudo o que envolva o deploy e a manutenção de uma aplicação WEB.

Dentro de nossos projetos, a construção de páginas com login, listas e exibição de detalhes são bastante frequentes. O correto funcionamento de páginas como essas exige desenvolvimento de um bom front-end e de uma boa comunicação com um servidor, que se comunicará com o banco de dados e proverá os dados necessários.

Com “bom” queremos expressar nossa constante preocupação com a estruturação, organização e desempenho do código nos projetos que desenvolvemos.

---

## Sobre React Js e Next Js ⚛️
React é uma biblioteca JavaScript utilizada para o desenvolvimento de interfaces web. Ela é baseada na criação de componentes, gerenciamento de seus estados e visualização sensível a mudanças nos dados ou nos estados. A ideia é que esses componentes sejam simples, reajam a mudanças e se comuniquem com outros componentes. Com isso, conseguimos construir interfaces complexas, escrevendo códigos enxutos, que sejam fáceis de manter e que sejam reutilizáveis. Muitas empresas e projetos estão usando React por aí, então provavelmente você encontre bastante suporte da comunidade na internet para te ajudar a resolver os problemas que você encontrar, mas aqui já vai o link da [documentação da biblioteca](https://reactjs.org/).

Já o Next Js é um framework criado a partir do React e que tem como objetivo agilizar o desenvolvimento de projetos front-end, removendo algumas barreiras de desenvolvimento. Você poderá encontrar mais informações sobre o Next Js em sua [documentação oficial](https://nextjs.org/docs).

---

## Sobre o Strapi.io
Strapi é um headless CMS (Content Management System) de código aberto que dá liberdade aos desenvolvedores para escolher quais tecnologias e frameworks serão utilizadas juntamente do painel administrativo, do próprio Strapi. Através desse painel é possível gerenciar todo o conteúdo de uma aplicação de acordo com as configurações realizadas dentro da API, que pode ser adaptada de acordo com o seu projeto.

É possível encontrar mais detalhes sobre o Strapi e como começar a utilizá-lo em sua [documentação oficial](https://strapi.io/documentation).

---

## Teste 🧪
Criamos um protótipo de um site e seu desafio é desenvolvê-lo utilizando React e integrá-lo com uma API. O protótipo consiste em uma página de login e algumas páginas com listas, not so hard! 🙂 Esperamos conseguir ver as listas apenas após o login efetuado. Criamos uma API, utilizando o Strapi, que servirá para você criar usuários, realizar login e coletar os dados para compor as listas. O projeto da API pode ser baixado no seguinte link: [Axion Test API](https://github.com/AxionCompany/axion-test). Lá você encontra mais informações sobre o projeto, como executá-lo localmente e especificações do layout.

Outra característica interessante para se tornar um Axioner é a forma com que você lida com os desafios, o quanto você consegue se auto-organizar, aprender por conta própria e multiplicar esse conhecimento com seus companheiros de equipe.

---

## Estimativa de Tempo ⏱️
Esperamos que você consiga resolver o teste dentro do intervalo de 5 dias após o envio do mesmo.

---

## O que será avaliado?
Iremos avaliar como você resolveu problemas como:

- Login e gerenciamento de senha;
- Gerenciamento de usuário;
- Armazenamento de sessão;
- Armazenamento das informações do front-end;
- Gerenciamento dos arquivos do projeto;
- Versionamento do código fonte;
- Utilização da biblioteca React, através ou não do framework Next.js;
- Fidelidade ao layout.

Lembramos que você não precisa se limitar a esses pontos durante a resolução do desafio. Nós queremos entender principalmente como você pensa enquanto tenta resolver os problemas.

---

## Passo a Passo 🐾
1. Clonar os repositórios.
2. Estudar layout, funcionalidades e esclarecer dúvidas.
3. Implementar o projeto.
4. Enviar seu projeto (tanto Front-end quanto Back-end) para o GitHub (ou GitLab).
5. Enviar os links dos repositórios para o e-mail hiring@dex.company.

---

Boa sorte! 🚀
