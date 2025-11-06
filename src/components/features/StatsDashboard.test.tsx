import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import StatsDashboard from "./StatsDashboard";

jest.mock("@/lib/api", () => ({
  submitApplication: jest.fn(),
  getApplications: jest.fn(),
  updateApplicationStatus: jest.fn(),
  getActiveMembers: jest.fn(),
  getMemberReferrals: jest.fn(),
  updateReferralStatus: jest.fn(),
  getDashboardChartData: jest.fn(),
  getDashboardStats: jest.fn(),
}));

jest.mock("primereact/skeleton", () => ({
  Skeleton: () => <div data-testid="mock-skeleton" />,
}));

jest.mock("primereact/button", () => ({
  Button: (props: any) => <button data-testid="mock-icon-button" />,
}));

import { getDashboardStats } from "@/lib/api";
const mockedGetStats = getDashboardStats as jest.Mock;

const mockStatsData = {
  totalMembers: 42,
  totalReferralsThisMonth: 15,
  totalThanksThisMonth: 7,
};

jest.setTimeout(15000);

describe("StatsDashboard Component", () => {
  beforeEach(() => {
    mockedGetStats.mockClear();
  });

  it("deve renderizar o skeleton de loading inicialmente", () => {
    mockedGetStats.mockReturnValue(new Promise(() => {}));

    render(<StatsDashboard />);

    expect(screen.getAllByTestId("mock-skeleton").length).toBeGreaterThan(0);

    expect(screen.queryByText("Membros Ativos")).not.toBeInTheDocument();
  });

  it("deve buscar os dados e exibir os valores corretos nos cards", async () => {
    mockedGetStats.mockResolvedValue(mockStatsData);

    render(<StatsDashboard />);

    await waitFor(() => {
      expect(mockedGetStats).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText("Membros Ativos")).toBeInTheDocument();
    expect(await screen.findByText("Indicações (Mês)")).toBeInTheDocument();
    expect(await screen.findByText('"Obrigados" (Mês)')).toBeInTheDocument();

    // 4. VERIFICA OS VALORES
    expect(
      await screen.findByText(mockStatsData.totalMembers.toString())
    ).toBeInTheDocument(); // "42"
    expect(
      await screen.findByText(mockStatsData.totalReferralsThisMonth.toString())
    ).toBeInTheDocument(); // "15"
    expect(
      await screen.findByText(mockStatsData.totalThanksThisMonth.toString())
    ).toBeInTheDocument(); // "7"

    expect(screen.queryByTestId("mock-skeleton")).not.toBeInTheDocument();
  });
});
