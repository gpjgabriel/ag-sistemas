// src/components/features/ReferralManager.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast"; // Importação adicionada
import { getMemberReferrals, updateReferralStatus } from "@/lib/api";
import type { Referral, User } from "@prisma/client";

type ReferralStatus = "NEW" | "CONTACTED" | "CLOSED" | "REJECTED";
const referralStatuses: ReferralStatus[] = [
  "NEW",
  "CONTACTED",
  "CLOSED",
  "REJECTED",
];

const statusOptions = [
  { label: "Novo", value: "NEW" },
  { label: "Em Contato", value: "CONTACTED" },
  { label: "Fechado", value: "CLOSED" },
  { label: "Recusado", value: "REJECTED" },
];

interface FullReferral extends Referral {
  sentBy: { name: string; id: string };
  receivedBy: { name: string; id: string };
}

const severityMap: {
  [key in ReferralStatus]: "warning" | "success" | "danger" | "info";
} = {
  NEW: "info",
  CONTACTED: "warning",
  CLOSED: "success",
  REJECTED: "danger",
};

const statusClasses: { [key in ReferralStatus]: string } = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-yellow-100 text-yellow-800",
  CLOSED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const CURRENT_USER_ID = "3d251b00-3c81-438e-a20c-a08be0a62b01"; // ID do usuário Teste

export default function ReferralManager() {
  const [allReferrals, setAllReferrals] = useState<FullReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const data = await getMemberReferrals(CURRENT_USER_ID);
      setAllReferrals(data);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erro de Carregamento",
        detail: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const statusBodyTemplate = (rowData: FullReferral) => {
    const statusKey = rowData.status as ReferralStatus;

    const severity = severityMap[statusKey];
    const colorClasses = statusClasses[statusKey];

    const displayValue =
      statusOptions.find((opt) => opt.value === rowData.status)?.label ||
      rowData.status;

    return (
      <Tag
        value={displayValue}
        severity={severity}
        className={`text-xs px-2 py-1 rounded-full font-semibold ${colorClasses}`}
      />
    );
  };

  const statusEditTemplate = (rowData: FullReferral) => {
    const handleStatusChange = async (newStatus: ReferralStatus) => {
      try {
        const updated = await updateReferralStatus(rowData.id, newStatus);

        setAllReferrals((prev) =>
          prev.map((r) =>
            r.id === updated.id ? { ...r, status: updated.status } : r
          )
        );
        toast.current?.show({
          severity: "success",
          summary: "Status Atualizado",
          detail: `Status alterado para ${newStatus}`,
        });
      } catch (err: any) {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: err.message,
        });
      }
    };

    return (
      <Dropdown
        value={rowData.status}
        options={statusOptions}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => handleStatusChange(e.value as ReferralStatus)}
        className="w-full"
        placeholder="Atualizar Status"
      />
    );
  };

  const sentReferrals = (allReferrals || []).filter(
    (r) => r.sentBy.id === CURRENT_USER_ID
  );
  const receivedReferrals = (allReferrals || []).filter(
    (r) => r.receivedBy.id === CURRENT_USER_ID
  );

  return (
    <TabView
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <TabPanel header={`Recebidas (${receivedReferrals.length})`}>
        <p className="mb-4 text-gray-700">
          Estas são as indicações que você deve acompanhar e atualizar.
        </p>
        <DataTable
          value={receivedReferrals}
          loading={loading}
          dataKey="id"
          emptyMessage="Nenhuma indicação recebida."
          data-testid="referral-table"
        >
          <Column field="sentBy.name" header="Enviado Por" />
          <Column field="clientName" header="Contato/Empresa" />
          <Column field="description" header="Detalhes" />
          <Column header="Status" body={statusEditTemplate} />
        </DataTable>
      </TabPanel>

      <TabPanel header={`Enviadas (${sentReferrals.length})`}>
        <p className="mb-4 text-gray-700">
          Acompanhe o status das indicações que você gerou.
        </p>
        <DataTable
          value={sentReferrals}
          loading={loading}
          dataKey="id"
          emptyMessage="Nenhuma indicação enviada."
        >
          <Column field="receivedBy.name" header="Membro Recebendo" />
          <Column field="clientName" header="Contato/Empresa" />
          <Column field="description" header="Detalhes" />
          <Column field="status" header="Status" body={statusBodyTemplate} />
        </DataTable>
      </TabPanel>
      <Toast ref={toast} />
    </TabView>
  );
}
