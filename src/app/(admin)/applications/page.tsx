import ApplicationList from "@/components/features/ApplicationList";
import React from "react";

export default function AdminApplicationsPage() {
  return (
    <main className="p-6 md:p-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Gestão de Aplicações</h1>
        <p className="text-gray-600">
          Aprove ou recuse as intenções de participação.
        </p>
      </header>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <ApplicationList />
      </div>
    </main>
  );
}
