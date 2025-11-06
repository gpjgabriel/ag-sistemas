import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();

    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const totalMembers = prisma.user.count({
      where: { active: true, role: "MEMBER" },
    });

    const totalReferralsThisMonth = prisma.referral.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalThanksThisMonth = prisma.thankYou.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const [members, referrals, thanks] = await prisma.$transaction([
      totalMembers,
      totalReferralsThisMonth,
      totalThanksThisMonth,
    ]);

    return NextResponse.json({
      totalMembers: members,
      totalReferralsThisMonth: referrals,
      totalThanksThisMonth: thanks,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
