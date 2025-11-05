import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const applicationSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  company: z.string().min(2, "Empresa é obrigatória"),
  reason: z.string().min(10, "A motivação é obrigatória"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = applicationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, email, company, reason } = validation.data;

    const newApplication = await prisma.application.create({
      data: { name, email, company, reason },
    });

    return NextResponse.json({ id: newApplication.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
