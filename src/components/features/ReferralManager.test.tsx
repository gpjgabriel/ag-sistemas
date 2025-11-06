import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import ReferralManager from "./ReferralManager";
const mockToastShow = jest.fn();

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
    if (props.ref) {
      props.ref.current = {
        show: mockToastShow,
      };
    }
    return <div data-testid="mock-toast" />;
  },
}));

import { getMemberReferrals, updateReferralStatus } from "@/lib/api";
const mockedGetReferrals = getMemberReferrals as jest.Mock;
const mockedUpdateStatus = updateReferralStatus as jest.Mock;

const CURRENT_USER_ID = "3d251b00-3c81-438e-a20c-a08be0a62b01";
process.env.NEXT_PUBLIC_SIMULATED_USER_ID = CURRENT_USER_ID;

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
    receivedById: CURRENT_USER_ID,
    createdAt: new Date(),
    description: "a",
  },
  {
    id: "ref-2",
    clientName: "Cliente B",
    status: "CONTACTED",
    sentBy: mockUser,
    receivedBy: mockPartner,
    sentById: CURRENT_USER_ID,
    receivedById: mockPartner.id,
    createdAt: new Date(),
    description: "b",
  },
] as any;

jest.setTimeout(15000);

describe("ReferralManager", () => {
  beforeEach(() => {
    mockedGetReferrals.mockClear();
    mockedUpdateStatus.mockClear();
    mockToastShow.mockClear();
    mockedGetReferrals.mockResolvedValue(mockReferrals);
  });

  it("busca e exibe as indicações corretamente divididas nas abas", async () => {
    render(<ReferralManager />);

    await waitFor(() => {
      expect(mockedGetReferrals).toHaveBeenCalledWith(CURRENT_USER_ID);
    });

    expect(
      await screen.findByText("Cliente A", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Recebidas \(1\)/i })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /Enviadas/i }));
    expect(
      await screen.findByText("Cliente B", {}, { timeout: 5000 })
    ).toBeInTheDocument();
  });

  it("deve renderizar a aba 'Recebidas' como ativa por padrão (activeIndex 0)", async () => {
    render(<ReferralManager />);
    expect(
      await screen.findByText("Cliente A", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    const receivedTab = screen.getByRole("tab", { name: /Recebidas \(1\)/i });
    expect(receivedTab).toHaveAttribute("aria-selected", "true");
  });

  it("deve mudar para a aba 'Enviadas' ao clicar e exibir o conteúdo correto", async () => {
    render(<ReferralManager />);
    expect(
      await screen.findByText("Cliente A", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    const sentTab = screen.getByRole("tab", {
      name: /Enviadas \(1\)/i,
      selected: false,
    });
    fireEvent.click(sentTab);
    expect(sentTab).toHaveAttribute("aria-selected", "true");
    expect(
      await screen.findByText("Cliente B", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.queryByText("Cliente A")).not.toBeInTheDocument();
  });

  it("deve permitir ao membro receptor atualizar o status para 'Fechada' (CLOSED)", async () => {
    const updatedReferral = { ...mockReferrals[0], status: "CLOSED" };
    mockedUpdateStatus.mockResolvedValue(updatedReferral);

    render(<ReferralManager />);

    expect(
      await screen.findByText("Cliente A", {}, { timeout: 5000 })
    ).toBeInTheDocument();
    const dropdown = screen.getByRole("combobox");
    fireEvent.click(dropdown);
    const closedOption = await screen.findByText("Fechado");
    fireEvent.click(closedOption);

    await waitFor(
      () => {
        expect(mockedUpdateStatus).toHaveBeenCalledWith("ref-1", "CLOSED");
      },
      { timeout: 5000 }
    );

    expect(mockToastShow).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "success",
        summary: "Status Atualizado",
        detail: "Status alterado para CLOSED",
      })
    );
  });

  it("trata o erro de atualização da API e mostra um Toast", async () => {
    mockedUpdateStatus.mockRejectedValue(new Error("Acesso negado."));
    render(<ReferralManager />);

    await screen.findByText("Cliente A", {}, { timeout: 5000 });
    const dropdownButton = screen.getByRole("combobox");
    fireEvent.click(dropdownButton);
    const rejectedOption = await screen.findByText("Recusado");
    fireEvent.click(rejectedOption);

    await waitFor(
      () => {
        expect(mockedUpdateStatus).toHaveBeenCalled();
      },
      { timeout: 5000 }
    );

    expect(mockToastShow).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        detail: "Acesso negado.",
      })
    );
  });
});
