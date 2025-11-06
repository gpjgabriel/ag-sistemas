// src/app/(member)/dashboard/page.tsx
import React from "react";
import StatsDashboard from "@/components/features/StatsDashboard";
import DashboardChart from "@/components/features/DashboardChart";

export default function DashboardPage() {
  return (
    <main className="p-6 md:p-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Performance</h1>
        <p className="text-gray-600">
          Indicadores de performance do grupo (Módulo Opcional B).
        </p>
      </header>

      <StatsDashboard />

      <div className="mt-8">
        <DashboardChart />
      </div>
    </main>
  );
}
