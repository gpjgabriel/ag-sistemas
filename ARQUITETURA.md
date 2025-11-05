# AG SISTEMAS ON LINE  

# Documento de Arquitetura: Plataforma de Gestão de Networking  

Este documento detalha a arquitetura planejada para a Plataforma de Gestão de Grupos de Networking.

## 1. Visão Geral e Escolhas Tecnológicas  

A solução será desenvolvida como uma aplicação web "fullstack", utilizando o Next.js para renderizar tanto o frontend (React) quanto o backend (API Routes Node.js).

* **Stack Principal:**
    * **Frontend:** Next.js (App Router) e React.
    * **Backend:** Next.js API Routes (Node.js).
    * **Banco de Dados:** PostgreSQL.
    * **ORM:** Prisma (para interação segura e tipada com o DB).
    * **Testes:** Jest e React Testing Library.
    * **UI (Estilização):** PrimeReact (v10+) e Tailwind CSS.  

* **Justificativa da Stack de UI (PrimeReact + Tailwind):**
    Escolha feita pela robustez da biblioteca de componentes do PrimeReact com a velocidade de desenvolvimento do Tailwind CSS. Isso garante que todos os componentes sejam estilizados exclusivamente com classes utilitárias do Tailwind, promovendo um código limpo, consistente e fácil de manter.

* **Justificativa do Banco de Dados (PostgreSQL):**
    A escolha pelo PostgreSQL se baseia na natureza altamente relacional dos dados. Funcionalidades como indicações entre membros, controle de presença, reuniões 1-a-1 e controle financeiro exigem integridade referencial e transações ACID, que são nativas em sistemas SQL.

---

## 2. Diagrama da Arquitetura (Entregável 1)  

Este diagrama ilustra os componentes centrais da solução e seu fluxo de comunicação.   

```mermaid  
graph TD  
    subgraph "Cliente (Browser)"  
        U(Usuário/Membro)  
        A(Administrador)  
    end  

    subgraph "Aplicação Next.js (Vercel/Servidor)"  
        F[Frontend (React / Next.js Pages)]  
        B[Backend (Next.js API Routes)]  
    end  

    subgraph "Serviços"  
        DB[(PostgreSQL DB)]  
        ORM[Prisma Client]  
    end

    U -- HTTPs --> F
    A -- HTTPs --> F
    F -- "Busca/Envio de dados (fetch)" --> B
    B -- "Query" --> ORM
    ORM -- "TCP/IP" --> DB

## 3. Modelo de Dados  (Entregável 2)

// schema.prisma  

datasource db {  
  provider = "postgresql"  
  url      = env("DATABASE_URL")  
}

generator client {  
  provider = "prisma-client-js"  
}  
  
// Tabela para o formulário público de intenção  
model Application {  
  id        String   @id @default(uuid())  
  name      String  
  email     String   @unique  
  company   String  
  reason    String   // "Por que você quer participar?"  
  status    String   @default("PENDING") // PENDING, APPROVED, REJECTED  
  createdAt DateTime @default(now())  
}

// Tabela de usuários (Membros e Admins)  
model User {  
  id            String    @id @default(uuid())  
  name          String  
  email         String    @unique  
  // ... outros campos do cadastro completo  
  role          String    @default("MEMBER") // MEMBER, ADMIN  
  active        Boolean   @default(true) // Membros ativos  
  createdAt     DateTime  @default(now())  
  
  invitation    Invite?   @relation(fields: [inviteId], references: [id])  
  inviteId      String?   @unique  

  sentReferrals Referral[] @relation("SentBy")  
  receivedReferrals Referral[] @relation("ReceivedBy")  
  thanksSent    ThankYou[] @relation("ThanksFrom")  
  thanksReceived ThankYou[] @relation("ThanksTo")  
}

// Tabela para o convite de cadastro completo  
model Invite {  
  id          String      @id @default(uuid())  
  token       String      @unique @default(cuid()) // Token único  
  email       String  
  status      String      @default("PENDING") // PENDING, COMPLETED  
  expiresAt   DateTime  
  createdAt   DateTime    @default(now())  
  
  application Application @relation(fields: [applicationId], references: [id])  
  applicationId String  
  
  user        User?  
}

// Tabela para o sistema de indicações (Opcional A)  
model Referral {  
  id          String   @id @default(uuid())  
  description String   // Descrição da Oportunidade  
  clientName  String   // Empresa/Contato Indicado  
  status      String   @default("NEW") // NEW, CONTACTED, CLOSED, REJECTED  
  createdAt   DateTime @default(now())  

  sentBy      User     @relation("SentBy", fields: [sentById], references: [id])  
  sentById    String  

  receivedBy  User     @relation("ReceivedBy", fields: [receivedById], references: [id])  
  receivedById String   // Membro Indicado  
}

// Tabela para "Obrigados"  
model ThankYou {  
  id        String   @id @default(uuid())  
  amount    Float    // Valor do negócio fechado  
  message   String  
  createdAt DateTime @default(now())  

  from      User     @relation("ThanksFrom", fields: [fromId], references: [id])  
  fromId    String  

  to        User     @relation("ThanksTo", fields: [toId], references: [id])  
  toId      String  
}  


## 4. Estrutura de Componentes  (Entregável 3)

A organização das pastas no frontend seguirá o padrão do Next.js App Router.

src/  
├── app/  
│   ├── (public)/                 # Rotas públicas  
│   │   ├── apply/                # Página de Intenção  
│   │   │   └── page.js
│   │   └── join/[token]/         # Página de Cadastro Completo  
│   │       └── page.js
│   ├── (admin)/                  # Rotas privadas de admin  
│   │   ├── applications/         # Lista de intenções  
│   │   │   └── page.js
│   ├── (member)/                 # Rotas privadas de membros  
│   │   ├── dashboard/            # Dashboard Opcional B  
│   │   ├── referrals/            # Página de Indicações Opcional A  
│   │   └── layout.js            # Layout autenticado  
│   ├── api/                      # Backend API Routes  
│   └── layout.js                # Layout raiz (onde o PrimeReactProvider será configurado)  
│  
├── components/
│   ├── features/                 # Componentes "inteligentes", com lógica de negócio,  
│   │   │                         # que importam e usam componentes do PrimeReact.  
│   │   ├── ApplicationForm.jsx   # (usará InputText, Button, etc. do PrimeReact)  
│   │   ├── ApplicationList.jsx   # (usará DataTable do PrimeReact)  
│   │   ├── ReferralForm.jsx  
│   │   └── StatsDashboard.jsx    # (usará Card e Chart do PrimeReact)  
│   └── layout/                   # Componentes de layout (Header, Sidebar, etc)  
│  
├── lib/                          # Lógica de "negócio" (ex: Prisma client, auth)  
│   └── prisma.jsx  
│  
├── context/                      # Contexto global  
│   └── AppProviders.jsx          # Wrapper para o PrimeReactProvider e outros contextos  
│  
└── tailwind.config.js            # Arquivo onde o preset do PrimeReact será configurado  


## 5. Definição da API  (Entregável 4)  

A API seguirá o padrão REST. Abaixo estão as definições para 3 funcionalidades essenciais, conforme solicitado.  

  1. (Aplicação) Enviar Intenção de Participação  
  Rota: POST /api/applications  

  Request Body:
  {  
    "name": "Ana Silva",  
    "email": "ana.silva@empresa.com",  
    "company": "Empresa X",  
    "reason": "Quero expandir meu networking."  
  }  

  Response (201 Created):  
  {  
    "id": "uuid-gerado-123"  
  }  

  2. (Admin) Listar Intenções Pendentes  
  Rota: GET /api/admin/applications  

  Response (200 OK):  
  {  
    "applications": [  
      {  
        "id": "uuid-gerado-123",  
        "name": "Ana Silva",  
        "email": "ana.silva@empresa.com",  
        "company": "Empresa X",  
        "status": "PENDING",  
        "createdAt": "2025-11-05T10:00:00Z"  
      }  
    ]  
  }  

  3. (Membro) Criar Nova Indicação  
  Rota: POST /api/referrals  

  Request Body:  
  {  
    "receivedById": "uuid-membro-indicado",  
    "clientName": "Contato Indicado LTDA",  
    "description": "Oportunidade de negócio para..."  
  }  

  Response (201 Created):  
  {  
    "id": "uuid-referral-789",  
    "status": "NEW"  
  }  


  

