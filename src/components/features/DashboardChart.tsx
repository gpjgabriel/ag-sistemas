"use client";

import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Skeleton } from "primereact/skeleton";
import { getDashboardChartData } from "@/lib/api";

type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
  }[];
};

export default function DashboardChart() {
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardChartData()
      .then((data) => {
        const documentStyle = getComputedStyle(document.documentElement);

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Indicações",
              data: data.referralsData,
              borderColor: documentStyle.getPropertyValue("--green-500"),
              tension: 0.4,
            },
            {
              label: "Obrigados (Negócios Fechados)",
              data: data.thanksData,
              borderColor: documentStyle.getPropertyValue("--yellow-500"),
              tension: 0.4,
            },
          ],
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  if (loading) {
    return <Skeleton height="300px" width="100%" />;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        Atividade nos Últimos 6 Meses
      </h3>
      {chartData && (
        <Chart type="line" data={chartData} options={chartOptions} />
      )}
    </div>
  );
}
