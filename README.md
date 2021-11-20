# Front-End do Planejador de Disciplinas

Aplicação em Página Única (*Single Page App*) feita em `React`
(usando [*hooks*](https://reactjs.org/docs/hooks-intro.html]))
e [`Material-UI`](https://next.material-ui.com/).

Instalação para desenvolvimento deve ser feito com

```bash
npm install --include=dev
```

## Estrutura do Diretório

Seguindo esse [guia](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md).

## Execução

### Modo de Desenvolvimento

Para iniciar o servidor local de desenvolvimento, faça

```bash
npm start
```

A aplicação pode ser acessada em [http://localhost:3000](http://localhost:3000).
A cada edição local, o *browser* recarrega a página automaticamente. Os erros
de execução podem ser vistos no console (janela de desenvolvimento `F12`).

#### Mock do Servidor

Algumas páginas dependem de comunicação com o servidor. Para ajudar no
desenvolvimento desses componentes, deve-se usar o servidor em Swift,
com:

```bash
git clone git@gitlab.com:disciplinas1/mc426/backend.git
cd backend
swift build -c release
```

E para executar é (também na pasta `backend/`):

```bash
swift run -c release Run -e prod
```

### Testes

Para iniciar os testes em modo iterativo:

```bash
npm test
```

Mais detalhes em [`create-react-app`](https://facebook.github.io/create-react-app/docs/running-tests).

### Modo de Produção

Para compilar a aplicação, basta

```bash
npm run build
```

Os arquivos de [JSX](https://reactjs.org/docs/introducing-jsx.html) e
[Typescript](https://www.typescriptlang.org/docs/) são transpilados para Javascript,
otimizados e minificados para uso no cliente final.

Mais detalhes em [`create-react-app`](https://facebook.github.io/create-react-app/docs/deployment).

## Guias de Desenvolvimento

### React

[`create-react-app`](https://facebook.github.io/create-react-app/docs/getting-started)

[React](https://reactjs.org)

[React API](https://reactjs.org/docs/react-api.html)

[React Hooks API](https://reactjs.org/docs/hooks-reference.html)

### Material

[Material UI](https://next.material-ui.com)

[Material Design](https://material.io)

### TypeScript

[TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

[The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

[React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)
