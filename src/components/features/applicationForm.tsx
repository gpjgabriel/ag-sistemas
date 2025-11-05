"use client";

import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

export default function ApplicationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="p-4 rounded-lg bg-green-100 text-green-700 text-center">
        <h3 className="font-bold">Inscrição Recebida!</h3>
        <p>Obrigado pelo seu interesse. Entraremos em contato em breve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-semibold">
          Nome Completo
        </label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <InputText
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="company" className="font-semibold">
          Empresa
        </label>
        <InputText
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="reason" className="font-semibold">
          Por que você quer participar?
        </label>
        <InputTextarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={5}
          className="w-full"
          required
          autoResize
        />
      </div>

      {error && <Message severity="error" text={error} />}

      <Button
        type="submit"
        label="Enviar Intenção"
        icon="pi pi-check"
        loading={loading}
        disabled={loading}
        className="w-full justify-center"
      />
    </form>
  );
}
