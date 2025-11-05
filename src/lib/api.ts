type ApplicationData = {
  name: string;
  email: string;
  company: string;
  reason: string;
};

export const submitApplication = async (data: ApplicationData) => {
  const res = await fetch("/api/admin/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro ao enviar o formulário");
  }
  return res.json();
};

export const getApplications = async () => {
  const res = await fetch("/api/admin/applications");

  if (!res.ok) throw new Error("Falha ao buscar aplicações");

  return res.json();
};

export const updateApplicationStatus = async (
  id: string,
  status: "APPROVED" | "REJECTED"
) => {
  const res = await fetch(`/api/admin/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Falha ao atualizar status");
  }
  return res.json();
};
