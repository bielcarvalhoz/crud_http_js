# Memoteca

Memoteca é um aplicativo organizador de pensamentos e frases que permite cadastrar, listar, editar e deletar pensamentos, incluindo informações como conteúdo e autoria.

## 🎓 Trabalho Acadêmico - Clean Code

Este repositório é parte de um trabalho da faculdade focado em **Clean Code** e **Testes Unitários**.

### 📋 Objetivo do Trabalho

1. Criar testes unitários ANTES da refatoração ✅
2. Refatorar o código aplicando Clean Code 🔄
3. Executar os mesmos testes DEPOIS da refatoração ⏭️
4. Comprovar que o comportamento permanece o mesmo ⏭️

### 🧪 Status dos Testes

- ✅ **18 testes criados e passando**
- ✅ **97.84% de cobertura de código**
- ✅ **Pronto para refatoração**

Para detalhes completos sobre os testes, veja [GUIA-TESTES.md](GUIA-TESTES.md)

## 🔨 Funcionalidades do projeto

`Cadastro de pensamentos`: Permite adicionar novos pensamentos à lista, inserindo informações como conteúdo e autoria.

`Listagem de pensamentos`: Exibe os pensamentos cadastrados, permitindo visualizar o texto e a autoria.

`Edição de pensamentos`: Permite editar pensamentos existentes, atualizando as informações conforme necessário.

`Exclusão de pensamentos`: Permite remover pensamentos da lista.

## ✔️ Técnicas e tecnologias utilizadas

`JavaScript`: Linguagem de programação utilizada para desenvolver a lógica do aplicativo.

`Fetch API`: Utilizada para realizar requisições HTTP para comunicação com o servidor.

`Axios`: Biblioteca usada para facilitar e simplificar as requisições HTTP.

`Node.js`: Plataforma utilizada para executar o ambiente de desenvolvimento.

`JSON Server`: Utilizado para simular um backend e facilitar o desenvolvimento e teste das operações CRUD.

`CSS`: Utilizado para estilização da interface do aplicativo.

## 📁 Link do Figma

Você pode [acessar o figma do projeto aqui](https://www.figma.com/design/Sz1gmmemxqcB3amInL4Ndp/Rebrand-Memoteca-%7C-Curso-CRUD?node-id=148-26&t=FpdmfbiM1i1s6REQ-0).

## 🛠️ Abrir e rodar o projeto

### Backend (API)

Para executar a API fake, você vai precisar do NodeJS; a versão utilizada foi a 20.12.2.

Instale o JSON Server globalmente (se ainda não estiver instalado):

```bash
npm install -g json-server
```

Para executar, abra um novo terminal e, dentro da pasta backend, execute:

```bash
npm start
```

### Frontend

Abra o arquivo `index.html` em um navegador ou use uma extensão como Live Server no VS Code.

### 🧪 Executar Testes

Para executar os testes unitários:

```bash
# Instalar dependências (primeira vez)
npm install

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch
```

**Resultado esperado:**

```
✓ 18 testes passando
✓ 97.84% de cobertura
```

## 📚 Documentação dos Testes

- [GUIA-TESTES.md](GUIA-TESTES.md) - Guia completo de testes
- [README-TESTES.md](README-TESTES.md) - Documentação técnica dos testes

## 🎯 Critérios de Avaliação (Clean Code)

- ✅ **Legibilidade:** Código organizado, nomes claros e significativos
- ✅ **Estrutura:** Redução de repetições, modularização, menor complexidade
- ✅ **Comentários:** Apenas quando necessário, documentação apropriada
- ✅ **Boas práticas:** SOLID, DRY, KISS e YAGNI

## 📊 Progresso do Trabalho

- [x] Fase 1: Criação dos testes unitários
- [x] Fase 2: Refatoração aplicando Clean Code
- [x] Fase 3: Validação com os mesmos testes
- [x] Fase 4: Documentação das melhorias

---

Acesse o backend localmente em seu navegador:

http://localhost:3000

Para executar o frontend, abra o projeto no Visual Studio Code. Com a extensão Live Server instalada, clique com o botão direito no arquivo index.html e selecione "Open with Live Server" no menu de contexto.

Acesse o frontend localmente em seu navegador:

http://localhost:5500
