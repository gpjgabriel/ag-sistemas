# AG SISTEMAS ON LINE

# Teste Técnico: Plataforma de Gestão de Networking

O objetivo deste projeto é implementar uma plataforma para gestão de grupos de networking, substituindo controles manuais por um sistema centralizado.

## Status do Projeto

- **Tarefa 1: Desenho da Arquitetura**
  - \*Consulte o arquivo ARQUITETURA.md para detalhes completos sobre o design do sistema, modelo de dados e definições de API.

- **Tarefa 2: Implementação Prática**
  - [x] Arquitetura (ARQUITETURA.md)
  - [x] Módulo Obrigatório: Fluxo de Admissão de Membros
  - [x] Módulo Opcional: (A)
  - [x] Módulo Opcional: (B) : _Em desenvolvimento_
  - [x] Testes (Unitários e Integração)

---

## 🚀 Stack Técnica

A stack deste projeto foi escolhida para atender aos requisitos obrigatórios e promover uma experiência de desenvolvimento moderna e unificada.

- **Framework Fullstack:** [Next.js](https://nextjs.org/) (com App Router)
- **Frontend:** [React](https://react.dev/)
- **Backend:** [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) (Node.js)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/) (para interação segura e tipada com o DB)
- **UI (Componentes):** [PrimeReact v10+](https://primereact.org/)
- **UI (Estilização):** [Tailwind CSS](https://tailwindcss.com/)
- **Testes:** [Jest](https://jestjs.io/) e [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🛠️ Instruções de Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Git](https://git-scm.com/)
- [Docker] Para o DB PostgreSQL (https://www.docker.com/products/docker-desktop/)

### 2. Clonar o Repositório

```bash
git clone [https://github.com/gpjgabriel/AGSISTEMASONLINE.git](https://github.com/gpjgabriel/AGSISTEMASONLINE.git)
cd AGSISTEMASONLINE
```

### 3. Instalar Dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto e o conteúdo do .env.example :

```bash
touch .env
cp .env.example .env
```

### 5. Configurar o Banco de Dados (Prisma)

Execute o comando docker run presente dentro do arquivo .env no terminal (o comando está comentado, retire o # no ínicio do comando)

```bash
docker run --name networking-db -e...
```

### 5. Configurar o Banco de Dados (Prisma)

Execute as "migrations" do Prisma para criar todas as tabelas no seu banco de dados:

```bash
npx prisma migrate dev
```

Popule o banco com dados de teste:

```bash
npm run seed
```

Executar o Projeto:

```bash
npm run dev
```

- A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

Rotas principais:

- Formulário de Intenção: [http://localhost:3000/apply](http://localhost:3000/apply)

- Área do Administrador: [http://localhost:3000/applications](http://localhost:3000/applications)

- Sistema de Indicações: [http://localhost:3000/referrals](http://localhost:3000/referrals)

## 🧪 Executando os Testes

```bash
npm run test
```
