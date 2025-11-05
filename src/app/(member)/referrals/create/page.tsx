import React from "react";
import ReferralForm from "@/components/features/ReferralForm";

export default function CreateReferralPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Enviar Nova Indicação</h1>
          <p className="text-gray-600">
            Gere negócios para outro membro do seu grupo.
          </p>
        </header>

        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
          <ReferralForm />
        </div>
      </div>
    </main>
  );
}
