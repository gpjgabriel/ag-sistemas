"use client";

import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Dropdown } from "primereact/dropdown"; // Para selecionar membros
import { createReferral, getActiveMembers } from "@/lib/api";

type MemberOption = { id: string; name: string; email: string };

export default function ReferralForm() {
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberOption | null>(
    null
  );
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await getActiveMembers();
        setMembers(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    loadMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!selectedMember) {
      setError("Selecione um membro para indicar.");
      setLoading(false);
      return;
    }

    try {
      const data = {
        receivedById: selectedMember.id,
        clientName: clientName,
        description: description,
      };
      await createReferral(data);

      setSuccess(true);
      setSelectedMember(null);
      setClientName("");
      setDescription("");
    } catch (err: any) {
      const msg = Array.isArray(err.message)
        ? err.message[0].message
        : err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 rounded-lg bg-green-100 text-green-700 text-center">
        <h3 className="font-bold">Indicação Enviada!</h3>
        <p>Oportunidade registrada com sucesso.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
      data-testid="referral-form"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="member" className="font-semibold">
          Membro Indicado
        </label>
        <Dropdown
          id="member"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.value)}
          options={members}
          optionLabel="name"
          placeholder="Selecione um membro"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="client" className="font-semibold">
          Empresa/Contato Indicado
        </label>
        <InputText
          id="client"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-semibold">
          Descrição da Oportunidade
        </label>
        <InputTextarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
          autoResize
        />
      </div>

      {error && <Message severity="error" text={error} />}

      <Button
        type="submit"
        label="Enviar Indicação"
        icon="pi pi-send"
        loading={loading}
      />
    </form>
  );
}
