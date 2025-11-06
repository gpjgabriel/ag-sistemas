import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// IDs fixos para serem copiados para o .env
const USER_ID_1 = "3d251b00-3c81-438e-a20c-a08be0a62b01";
const USER_ID_2 = "aa2a893b-a7e8-480a-b33a-a11b699264f0";
const USER_ID_3 = "bb3b893b-b7e8-480a-b33a-c11b699264f1";

async function main() {
  console.log("Iniciando o script de seed...");

  await prisma.user.deleteMany({});

  await prisma.user.createMany({
    data: [
      {
        id: USER_ID_1,
        name: "Usuario Teste-1",
        email: "usuario1@email.com",
        company: "Empresa usuario 1",
        active: true,
        role: "MEMBER",
      },
      {
        id: USER_ID_2,
        name: "Usuario Teste-2",
        email: "usuario2@email.com",
        company: "Empresa usuario 2",
        active: true,
        role: "MEMBER",
      },
      {
        id: USER_ID_3,
        name: "Usuario Teste-3",
        email: "usuario3@email.com",
        company: "Empresa usuario 3",
        active: true,
        role: "MEMBER",
      },
    ],
  });

  console.log("Seed concluído com sucesso!");
  console.log("---");
  console.log("ID do Usuário de Teste para o .env:");
  console.log(USER_ID_1);
  console.log("---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
