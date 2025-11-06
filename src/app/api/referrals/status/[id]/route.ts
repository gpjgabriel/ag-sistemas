import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const validStatuses = ["NEW", "CONTACTED", "CLOSED", "REJECTED"] as const;

const statusSchema = z.object({
  newStatus: z.enum(validStatuses),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const simulatedUserId = "SEU_ID_REAL_AQUI_DO_BANCO";

  try {
    const body = await request.json();
    const validation = statusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }
    const { newStatus } = validation.data;

    // Verifica se a indicação existe e se o usuário logado é o receptor
    const referral = await prisma.referral.findUnique({ where: { id } });

    if (!referral) {
      return NextResponse.json(
        { error: "Indicação não encontrada" },
        { status: 404 }
      );
    }
    // Se o usuário logado NÃO for o receptor, ele não pode alterar o status.
    if (referral.receivedById !== simulatedUserId) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const updatedReferral = await prisma.referral.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json(updatedReferral);
  } catch (error: any) {
    console.error(`Erro ao atualizar indicação ${id}:`, error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
