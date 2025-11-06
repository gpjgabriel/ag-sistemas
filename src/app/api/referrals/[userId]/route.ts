import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> } // O ID do membro logado (simulado)
) {
  const { userId } = await params;

  try {
    const referrals = await prisma.referral.findMany({
      where: {
        OR: [{ sentById: userId }, { receivedById: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sentBy: { select: { id: true, name: true, company: true } },
        receivedBy: { select: { id: true, name: true, company: true } },
      },
    });

    return NextResponse.json(referrals);
  } catch (error) {
    console.error("Erro ao buscar indicações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
