# AG SISTEMAS ON LINE

# Teste Técnico: Plataforma de Gestão de Networking

O objetivo deste projeto é implementar uma plataforma para gestão de grupos de networking, substituindo controles manuais por um sistema centralizado.  

## Status do Projeto  

- **Tarefa 1: Desenho da Arquitetura**  
  - *Consulte o arquivo ARQUITETURA.md para detalhes completos sobre o design do sistema, modelo de dados e definições de API.  

- **Tarefa 2: Implementação Prática**  
  - [ ] Módulo Obrigatório: Fluxo de Admissão de Membros  
  - [ ] Módulo Opcional: (Ainda não iniciado)  
  - [ ] Testes (Unitários e Integração)  

---

## 🚀 Stack Técnica  

A stack deste projeto foi escolhida para atender aos requisitos obrigatórios e promover uma experiência de desenvolvimento moderna e unificada.  

* **Framework Fullstack:** [Next.js](https://nextjs.org/) (com App Router)
* **Frontend:** [React](https://react.dev/)
* **Backend:** [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) (Node.js)
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [Prisma](https://www.prisma.io/) (para interação segura e tipada com o DB)
* **UI (Componentes):** [PrimeReact v10+](https://primereact.org/)
* **UI (Estilização):** [Tailwind CSS](https://tailwindcss.com/)
* **Testes:** [Jest](https://jestjs.io/) e [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🛠️ Instruções de Instalação e Execução  

Siga os passos abaixo para configurar e executar o projeto localmente.  

### 1. Pré-requisitos  

-   [Node.js](https://nodejs.org/) (v18 ou superior)  
-   [Git](https://git-scm.com/)  
-   Um servidor PostgreSQL em execução.  

### 2. Clonar o Repositório  

```bash  
git clone [https://github.com/gpjgabriel/AGSISTEMASONLINE.git](https://github.com/gpjgabriel/AGSISTEMASONLINE.git)  
cd AGSISTEMASONLINE  
  

### 3. Instalar Dependências  

npm install  
# ou  
yarn install  
# ou  
pnpm install  


### 4. Configurar Variáveis de Ambiente  

Crie um arquivo .env na raiz do projeto:  

touch .env  

Copie o conteúdo do .env.example  

### 5. Configurar o Banco de Dados (Prisma)  

Execute as "migrations" do Prisma para criar todas as tabelas no seu banco de dados:  

npx prisma migrate dev  

(Opcional, se você criar um seed) Popule o banco com dados de teste:  

npx prisma db seed  

Executar o Projeto:  

npm run dev  

## 🧪 Executando os Testes  

npm run test  






