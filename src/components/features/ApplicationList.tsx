"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { getApplications, updateApplicationStatus } from "@/lib/api";
import { useRef } from "react";

import type { Application } from "@prisma/client";

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplications();
      setApplications(data);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const updatedApp = await updateApplicationStatus(id, status);

      setApplications((prevApps) =>
        prevApps.map((app) => (app.id === id ? updatedApp : app))
      );

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: `Aplicação ${status === "APPROVED" ? "Aprovada" : "Recusada"}`,
      });
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: err.message,
      });
    }
  };

  const statusBodyTemplate = (rowData: Application) => {
    const severity = {
      PENDING: "warning",
      APPROVED: "success",
      REJECTED: "danger",
    }[rowData.status] as "warning" | "success" | "danger" | undefined;

    return <Tag value={rowData.status} severity={severity} />;
  };

  const actionsBodyTemplate = (rowData: Application) => {
    if (rowData.status !== "PENDING") {
      return (
        <Tag
          value={rowData.status}
          severity={rowData.status === "APPROVED" ? "success" : "danger"}
        />
      );
    }
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-check"
          label="Aprovar"
          severity="success"
          onClick={() => handleUpdate(rowData.id, "APPROVED")}
          className="p-button-sm"
        />
        <Button
          icon="pi pi-times"
          label="Recusar"
          severity="danger"
          onClick={() => handleUpdate(rowData.id, "REJECTED")}
          className="p-button-sm"
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={applications}
        loading={loading}
        paginator
        rows={10}
        dataKey="id"
        emptyMessage="Nenhuma aplicação encontrada."
        className="p-datatable-sm"
      >
        <Column field="name" header="Nome" sortable className="w-1/4" />
        <Column field="email" header="Email" sortable className="w-1/4" />
        <Column field="company" header="Empresa" sortable className="w-1/4" />
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          sortable
          className="w-1/6"
        />
        <Column header="Ações" body={actionsBodyTemplate} className="w-1/4" />
      </DataTable>
    </>
  );
}
