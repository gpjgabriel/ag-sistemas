// src/app/page.tsx
"use client"; // Necessário para o useRouter

import React from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation"; // Para navegação

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-center mb-4">
          Bem-vindo ao Teste Técnico
        </h1>
        <p className="text-center text-gray-700 mb-8">
          Projeto da Plataforma de Gestão de Networking.
        </p>
        <div className="mt-8 border-t pt-6 py-6 text-sm text-gray-500">
          <Button
            label="Formulário de Cadastro"
            onClick={() => router.push("/apply")}
            className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-200"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Button
            label="Acessar Área do Admin (Gestão)"
            onClick={() => router.push("/applications")}
            className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-200"
          />

          <Button
            label="Acessar Área do Membro (Indicações)"
            onClick={() => router.push("/referrals")}
            className="w-full justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-200"
          />
        </div>
      </div>
    </main>
  );
}
