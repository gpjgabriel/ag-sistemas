type ApplicationData = {
  name: string;
  email: string;
  company: string;
  reason: string;
};

export const submitApplication = async (data: ApplicationData) => {
  const res = await fetch("/api/applications", {
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
