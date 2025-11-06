// src/app/api/admin/applications/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { status } = await request.json();

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    let updatedApplication;

    if (status === "APPROVED") {
      const application = await prisma.application.findUnique({
        where: { id },
      });

      if (!application) {
        return NextResponse.json(
          { error: "Aplicação não encontrada" },
          { status: 404 }
        );
      }
      if (application.status !== "PENDING") {
        return NextResponse.json(
          { error: "Aplicação já processada" },
          { status: 409 }
        );
      }

      const invite = await prisma.invite.create({
        data: {
          email: application.email,
          applicationId: application.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      updatedApplication = await prisma.application.update({
        where: { id },
        data: { status: "APPROVED" },
      });

      const inviteLink = `http://localhost:3000/join/${invite.token}`;
      console.log(`Para: ${invite.email}`);
      console.log(`Link: ${inviteLink}`);
    } else {
      updatedApplication = await prisma.application.update({
        where: { id },
        data: { status: "REJECTED" },
      });
    }

    return NextResponse.json(updatedApplication);
  } catch (error: any) {
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("applicationId")
    ) {
      return NextResponse.json(
        { error: "Um convite para esta aplicação já existe" },
        { status: 409 }
      );
    }

    console.error(`Erro ao atualizar aplicação ${id}:`, error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
