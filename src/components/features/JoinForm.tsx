"use client";

import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password"; // Componente de senha
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { completeRegistration } from "@/lib/api";

type JoinFormProps = {
  token: string;
  email: string;
  name: string;
};

export default function JoinForm({
  token,
  email,
  name: initialName,
}: JoinFormProps) {
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = { name, password };
      await completeRegistration(token, data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 rounded-lg bg-green-100 text-green-700 text-center">
        <h3 className="font-bold">Cadastro Concluído!</h3>
        <p>Seja bem-vindo(a). Você já pode acessar a plataforma.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
      data-testid="join-form"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <InputText id="email" value={email} disabled />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-semibold">
          Nome Completo
        </label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-semibold">
          Crie uma Senha
        </label>
        <Password
          inputId="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          feedback={false}
          className="w-full"
          inputClassName="w-full"
        />
      </div>

      {error && <Message severity="error" text={error} />}

      <Button
        type="submit"
        label="Finalizar Cadastro"
        loading={loading}
        className="w-full justify-center"
      />
    </form>
  );
}
