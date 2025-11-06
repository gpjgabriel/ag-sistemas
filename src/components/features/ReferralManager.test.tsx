import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import ReferralManager from "./ReferralManager";

jest.mock("@/lib/api", () => ({
  submitApplication: jest.fn(),
  getApplications: jest.fn(),
  updateApplicationStatus: jest.fn(),
  getActiveMembers: jest.fn(),
  getMemberReferrals: jest.fn(),
  updateReferralStatus: jest.fn(),
}));

jest.mock("primereact/toast", () => ({
  Toast: (props: any) => {
    if (props.ref) props.ref.current = { show: jest.fn() };
    return <div data-testid="mock-toast" />;
  },
}));

import { getMemberReferrals, updateReferralStatus } from "@/lib/api";
const mockedGetReferrals = getMemberReferrals as jest.Mock;
const mockedUpdateStatus = updateReferralStatus as jest.Mock;

const CURRENT_USER_ID = "test-user-id";
const mockUser = { id: CURRENT_USER_ID, name: "Membro Logado" };
const mockPartner = { id: "partner-id", name: "Parceiro" };

const mockReferrals = [
  {
    id: "ref-1",
    clientName: "Cliente A",
    status: "NEW",
    sentBy: mockPartner,
    receivedBy: mockUser,
    sentById: mockPartner.id,
    receivedById: mockUser.id,
    createdAt: new Date(),
    description: "a",
  },
  {
    id: "ref-2",
    clientName: "Cliente B",
    status: "CONTACTED",
    sentBy: mockUser,
    receivedBy: mockPartner,
    sentById: mockUser.id,
    receivedById: mockPartner.id,
    createdAt: new Date(),
    description: "b",
  },
] as any;

jest.setTimeout(20000);

describe("ReferralManager", () => {
  beforeEach(() => {
    mockedGetReferrals.mockClear();
    mockedUpdateStatus.mockClear();
    mockedGetReferrals.mockResolvedValue(mockReferrals);
  });

  const renderAndLoad = async () => {
    render(<ReferralManager />);

    await waitFor(() => {
      expect(mockedGetReferrals).toHaveBeenCalledTimes(1);
    });

    const table = await screen.findByTestId("referral-table");
    expect(table).toBeInTheDocument();

    await waitFor(
      () => {
        const rows = Array.from(table.querySelectorAll("tr"));
        const hasClienteA = rows.some((row) =>
          row.textContent?.includes("Cliente A")
        );
        expect(hasClienteA).toBe(true);
      },
      { timeout: 8000 }
    );
  };

  it("busca e exibe as indicações corretamente divididas nas abas", async () => {
    await renderAndLoad();

    expect(
      screen.getByRole("tab", { name: /Recebidas \(1\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Enviadas \(1\)/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Enviadas/i }));

    await waitFor(() => {
      const rows = Array.from(
        document.querySelectorAll('[data-testid="referral-table"] tr')
      );
      const hasClienteB = rows.some((r) =>
        r.textContent?.includes("Cliente B")
      );
      expect(hasClienteB).toBe(true);
    });
  });

  it("permite ao membro receptor atualizar o status para 'Fechada' (CLOSED)", async () => {
    mockedUpdateStatus.mockResolvedValue({
      ...mockReferrals[0],
      status: "CLOSED",
    });

    await renderAndLoad();

    const dropdown = screen.getByRole("combobox");
    fireEvent.click(dropdown);

    const closedOption = await screen.findByText("Fechado");
    fireEvent.click(closedOption);

    await waitFor(() => {
      expect(mockedUpdateStatus).toHaveBeenCalledWith("ref-1", "CLOSED");
    });

    const toastMock = (screen.getByTestId("mock-toast") as any).ref.current
      .show;
    expect(toastMock).toHaveBeenCalled();
  });

  it("trata o erro de atualização da API e mostra um Toast", async () => {
    mockedUpdateStatus.mockRejectedValue(new Error("Acesso negado."));
    await renderAndLoad();

    const dropdown = screen.getByRole("combobox");
    fireEvent.click(dropdown);

    const rejectedOption = await screen.findByText("Recusado");
    fireEvent.click(rejectedOption);

    await waitFor(() => {
      expect(mockedUpdateStatus).toHaveBeenCalled();
    });

    const toastMock = (screen.getByTestId("mock-toast") as any).ref.current
      .show;
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        detail: "Acesso negado.",
      })
    );
  });
});
