import React from "react";
import ReferralManager from "@/components/features/ReferralManager";
import ReferralForm from "@/components/features/ReferralForm";

export default function ReferralsPage() {
  return (
    <main className="p-6 md:p-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Sistema de Indicações</h1>
        <p className="text-gray-600">
          Gerencie suas oportunidades de negócios enviadas e recebidas.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 order-2 lg:order-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Enviar Nova Indicação</h2>
          <ReferralForm />
        </div>

        <div className="w-full lg:w-2/3 order-1 lg:order-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Minhas Oportunidades</h2>
          <ReferralManager />
        </div>
      </div>
    </main>
  );
}
