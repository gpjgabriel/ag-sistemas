import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const referralSchema = z.object({
  receivedById: z.string().uuid("ID de membro receptor inválido"),
  clientName: z.string().min(3, "O nome do contato/empresa é obrigatório"),
  description: z.string().min(5, "A descrição da oportunidade é obrigatória"),
});

export async function POST(request: Request) {
  const simulatedSenderId = "3d251b00-3c81-438e-a20c-a08be0a62b01"; // ID mocado de um usuário existente (teste)

  try {
    const body = await request.json();

    const validation = referralSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues },
        { status: 400 }
      );
    }

    const { receivedById, clientName, description } = validation.data;

    const newReferral = await prisma.referral.create({
      data: {
        sentById: simulatedSenderId,
        receivedById: receivedById,
        clientName: clientName,
        description: description,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { id: newReferral.id, status: newReferral.status },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao criar indicação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
