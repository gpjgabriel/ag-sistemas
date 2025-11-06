import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mocka as APIs do Admin
jest.mock("@/lib/api", () => ({
  submitApplication: jest.fn(),
  getApplications: jest.fn(),
  updateApplicationStatus: jest.fn(),
}));

// Mocka o toast
jest.mock("primereact/toast", () => ({
  Toast: (props: any) => {
    if (props.ref) {
      props.ref.current = {
        show: jest.fn(),
      };
    }
    return <div data-testid="mock-toast" />;
  },
}));

// Importa os mocks
import { getApplications, updateApplicationStatus } from "@/lib/api";
import type { Application } from "@prisma/client";
import ApplicationList from "./ApplicationList";

const mockedGetApplications = getApplications as jest.Mock;
const mockedUpdateStatus = updateApplicationStatus as jest.Mock;

// Cria dados de teste
const mockApplications: Application[] = [
  {
    id: "uuid-1",
    name: "Candidato Pendente",
    email: "pendente@email.com",
    company: "Empresa A",
    reason: "Teste",
    status: "PENDING",
    createdAt: new Date(),
  },
  {
    id: "uuid-2",
    name: "Candidato Aprovado",
    email: "aprovado@email.com",
    company: "Empresa B",
    reason: "Teste",
    status: "APPROVED",
    createdAt: new Date(),
  },
];

describe("ApplicationList", () => {
  beforeEach(() => {
    mockedGetApplications.mockClear();
    mockedUpdateStatus.mockClear();
  });

  it("busca e exibe as aplicações ao carregar", async () => {
    mockedGetApplications.mockResolvedValue(mockApplications);

    render(<ApplicationList />);

    expect(mockedGetApplications).toHaveBeenCalledTimes(1);

    expect(await screen.findByText("Candidato Pendente")).toBeInTheDocument();
    expect(await screen.findByText("Candidato Aprovado")).toBeInTheDocument();

    // Verifica se os botões aparecem SÓ para PENDENTE
    const approveButtons = screen.getAllByRole("button", { name: /Aprovar/i });
    expect(approveButtons).toHaveLength(1);
  });

  it("chama a API de aprovação e atualiza a UI", async () => {
    mockedGetApplications.mockResolvedValue([mockApplications[0]]);

    const updatedApp: Application = {
      ...mockApplications[0],
      status: "APPROVED",
    };
    mockedUpdateStatus.mockResolvedValue(updatedApp);

    render(<ApplicationList />);

    const approveButton = await screen.findByRole("button", {
      name: /Aprovar/i,
    });
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(mockedUpdateStatus).toHaveBeenCalledWith(
        mockApplications[0].id,
        "APPROVED"
      );
    });

    // Verifica se a UI atualizou (botões sumiram)
    expect(
      screen.queryByRole("button", { name: /Aprovar/i })
    ).not.toBeInTheDocument();

    const tags = screen.getAllByText("APPROVED");
    expect(tags.length).toBeGreaterThan(0);
  });

  it("chama a API de recusa e atualiza a UI", async () => {
    mockedGetApplications.mockResolvedValue([mockApplications[0]]);

    const updatedApp: Application = {
      ...mockApplications[0],
      status: "REJECTED",
    };
    mockedUpdateStatus.mockResolvedValue(updatedApp);

    render(<ApplicationList />);

    const rejectButton = await screen.findByRole("button", {
      name: /Recusar/i,
    });
    fireEvent.click(rejectButton);

    await waitFor(() => {
      expect(mockedUpdateStatus).toHaveBeenCalledWith(
        mockApplications[0].id,
        "REJECTED"
      );
    });

    expect(
      screen.queryByRole("button", { name: /Aprovar/i })
    ).not.toBeInTheDocument();

    const tags = screen.getAllByText("REJECTED");
    expect(tags.length).toBeGreaterThan(0);
  });
});
