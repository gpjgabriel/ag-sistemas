import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DashboardPage from "./page";

jest.mock("@/components/features/StatsDashboard", () => {
  return () => <div data-testid="mock-stats-dashboard" />;
});

jest.mock("@/components/features/DashboardChart", () => {
  return () => <div data-testid="mock-dashboard-chart" />;
});

describe("DashboardPage (Página de Layout)", () => {
  it("deve renderizar o cabeçalho e os componentes filhos (Stats e Chart)", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Dashboard de Performance")).toBeInTheDocument();
    expect(
      screen.getByText(/Indicadores de performance do grupo/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId("mock-stats-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dashboard-chart")).toBeInTheDocument();
  });
});
