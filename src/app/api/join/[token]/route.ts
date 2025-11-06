import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(
  request: Request,

  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    // Valida o convite
    const invite = await prisma.invite.findUnique({
      where: {
        token: token,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: { application: true },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Convite inválido ou expirado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: invite.application.email,
      name: invite.application.name,
    });
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

const joinSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Valida o convite
    const invite = await prisma.invite.findFirst({
      where: {
        token: token,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      include: { application: true },
    });

    if (!invite) {
      return NextResponse.json(
        { error: "Convite inválido ou expirado." },
        { status: 404 }
      );
    }

    // Valida os dados do formulário
    const body = await request.json();
    const validation = joinSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues },
        { status: 400 }
      );
    }

    const user = await prisma.$transaction(async (tx) => {
      // Cria o usuário
      const newUser = await tx.user.create({
        data: {
          name: validation.data.name,
          email: invite.application.email,
          active: true,
          role: "MEMBER",
          inviteId: invite.id,
        },
      });

      // Marca o convite como 'COMPLETED'
      await tx.invite.update({
        where: { id: invite.id },
        data: {
          status: "COMPLETED",
        },
      });

      return newUser;
    });

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json(
        { error: "Email já está cadastrado." },
        { status: 409 }
      );
    }
    console.error("Erro ao finalizar cadastro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
