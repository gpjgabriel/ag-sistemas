"use client";

import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { getDashboardStats } from "@/lib/api";

type StatsData = {
  totalMembers: number;
  totalReferralsThisMonth: number;
  totalThanksThisMonth: number;
};

const cardDefinitions = [
  {
    key: "totalMembers",
    title: "Membros Ativos",
    icon: (
      <i className="pi pi-users text-blue-500" style={{ fontSize: "1.5rem" }} />
    ),
    colorClasses: {
      border: "bg-blue-500",
      text: "text-blue-500",
    },
  },
  {
    key: "totalReferralsThisMonth",
    title: "Indicações (Mês)",
    icon: (
      <i className="pi pi-send text-green-500" style={{ fontSize: "1.5rem" }} />
    ),
    colorClasses: {
      border: "bg-green-500",
      text: "text-green-500",
    },
  },
  {
    key: "totalThanksThisMonth",
    title: '"Obrigados" (Mês)',
    icon: (
      <i
        className="pi pi-gift text-yellow-500"
        style={{ fontSize: "1.5rem" }}
      />
    ),
    colorClasses: {
      border: "bg-yellow-500",
      text: "text-yellow-500",
    },
  },
];

export default function StatsDashboard() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((stats) => setData(stats))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <Skeleton width="40%" height="1.5rem" className="mb-2" />
        <Skeleton width="60%" height="3rem" />
      </div>
      <div className="h-2 bg-gray-200" />
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cardDefinitions.map((card) => {
        const value = data ? data[card.key as keyof StatsData] : 0;
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="flex justify-between items-center p-4">
              <h4 className="font-bold text-gray-600 text-lg">{card.title}</h4>
              <Button
                icon={card.icon}
                className={`p-button-text p-button-rounded ${card.colorClasses.text}`}
              />
            </div>

            <div className="p-4 pt-0">
              <p className={`text-4xl font-bold ${card.colorClasses.text}`}>
                {value}
              </p>
            </div>
            <div className={`h-2 ${card.colorClasses.border}`} />
          </div>
        );
      })}
    </div>
  );
}
