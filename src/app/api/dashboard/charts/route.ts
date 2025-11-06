import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// obter a data de 6 meses atrás
function getSixMonthsAgo() {
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  date.setDate(1); // dia de inicio
  return date;
}

// formatar a data ("aaaa-mm")
function formatDateAsYearMonth(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}

export async function GET() {
  try {
    const sixMonthsAgo = getSixMonthsAgo();

    // Busca Indicações dos últimos 6 meses
    const referrals = await prisma.referral.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    // Busca "Obrigados" dos últimos 6 meses
    const thanks = await prisma.thankYou.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    });

    // Agrupa os dados por Mês
    const labelsMap: { [key: string]: { referrals: number; thanks: number } } =
      {};

    // Preenche o mapa com os meses
    for (let i = 0; i <= 6; i++) {
      const date = new Date(
        sixMonthsAgo.getFullYear(),
        sixMonthsAgo.getMonth() + i,
        1
      );
      const label = formatDateAsYearMonth(date);
      labelsMap[label] = { referrals: 0, thanks: 0 };
    }

    referrals.forEach((ref) => {
      const label = formatDateAsYearMonth(ref.createdAt);
      if (labelsMap[label]) {
        labelsMap[label].referrals += 1;
      }
    });

    thanks.forEach((thk) => {
      const label = formatDateAsYearMonth(thk.createdAt);
      if (labelsMap[label]) {
        labelsMap[label].thanks += 1;
      }
    });

    // Formata para o Chart.js
    const labels = Object.keys(labelsMap);
    const referralsData = labels.map((label) => labelsMap[label].referrals);
    const thanksData = labels.map((label) => labelsMap[label].thanks);

    return NextResponse.json({ labels, referralsData, thanksData });
  } catch (error) {
    console.error("Erro ao buscar dados do gráfico:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
