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

export const validateInviteToken = async (token: string) => {
  const res = await fetch(`/api/join/${token}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Falha ao validar convite");
  }
  return res.json();
};

export const completeRegistration = async (token: string, data: any) => {
  const res = await fetch(`/api/join/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Falha ao finalizar cadastro");
  }
  return res.json();
};

type ReferralData = {
  receivedById: string;
  clientName: string;
  description: string;
};

export const createReferral = async (data: ReferralData) => {
  const res = await fetch("/api/referrals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Falha ao enviar a indicação");
  }
  return res.json();
};

export const getActiveMembers = async () => {
  const res = await fetch("/api/users");
  if (!res.ok) {
    throw new Error("Falha ao buscar a lista de membros");
  }
  return res.json();
};

type ReferralStatus = "NEW" | "CONTACTED" | "CLOSED" | "REJECTED";

export const getMemberReferrals = async (memberId: string) => {
  const res = await fetch(`/api/referrals/${memberId}`);
  if (!res.ok) {
    throw new Error("Falha ao buscar indicações.");
  }
  return res.json();
};

export const updateReferralStatus = async (
  referralId: string,
  newStatus: ReferralStatus
) => {
  const res = await fetch(`/api/referrals/status/${referralId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newStatus }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Falha ao atualizar status.");
  }
  return res.json();
};
