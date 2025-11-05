import ApplicationForm from "@/components/features/applicationForm";
import React from "react";

export default function ApplyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Intenção de Participação
        </h1>
        <p className="text-center text-gray-700 mb-8">
          Preencha o formulário abaixo para que nosso time possa avaliar sua
          aplicação.
        </p>
        <ApplicationForm />
      </div>
    </main>
  );
}
