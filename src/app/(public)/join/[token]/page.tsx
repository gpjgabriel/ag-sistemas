// src/app/(public)/join/[token]/page.tsx
import React from "react";
import JoinForm from "@/components/features/JoinForm";

async function getInviteData(token: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/join/${token}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Erro ao validar convite");
    }
    return await res.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

type JoinPageProps = {
  params: Promise<{ token: string }>;
};

export default async function JoinPage({
  params: paramsPromise,
}: JoinPageProps) {
  const { token } = await paramsPromise;
  const data = await getInviteData(token);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        {data.error && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Convite Inválido
            </h1>
            <p className="text-gray-700">{data.error}</p>
            <p className="mt-4">
              Por favor, solicite um novo convite ou entre em contato com o
              administrador.
            </p>
          </div>
        )}

        {!data.error && (
          <>
            <h1 className="text-3xl font-bold text-center mb-6">
              Complete seu Cadastro
            </h1>
            <p className="text-center text-gray-700 mb-8">
              Falta pouco para você se juntar ao grupo.
            </p>
            <JoinForm token={token} email={data.email} name={data.name} />
          </>
        )}
      </div>
    </main>
  );
}
