// src/components/features/ApplicationForm.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
require("@testing-library/jest-dom");

// CORREÇÃO: Verifique se o nome do arquivo é ApplicationForm.tsx

import ApplicationForm from "./applicationForm";

// Mockar (isso está correto)
jest.mock("@/lib/api", () => ({
  submitApplication: jest.fn(),
}));

import { submitApplication } from "@/lib/api";
const mockedSubmitApplication = submitApplication as jest.Mock;

describe("ApplicationForm", () => {
  beforeEach(() => {
    mockedSubmitApplication.mockClear();
  });

  // (O teste "renderiza" está ok)
  // ...

  it("mostra a mensagem de sucesso após o envio", async () => {
    mockedSubmitApplication.mockResolvedValue({ id: "uuid-123" });
    render(<ApplicationForm />);

    // Preenche o formulário
    fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
      target: { value: "Teste2" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "teste2@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/Empresa/i), {
      target: { value: "AG Sistemas" },
    });
    fireEvent.change(screen.getByLabelText(/Por que você quer participar?/i), {
      target: { value: "Quero participar" },
    });

    // CORREÇÃO: Dispare o 'submit' no formulário, não o 'click' no botão
    const form = screen.getByTestId("application-form");
    fireEvent.submit(form);

    // Verifica se a API foi chamada
    await waitFor(() => {
      expect(mockedSubmitApplication).toHaveBeenCalledWith({
        name: "Teste2",
        email: "teste2@email.com",
        company: "AG Sistemas",
        reason: "Quero participar",
      });
    });

    // Verifica se a mensagem de sucesso apareceu
    expect(await screen.findByText("Inscrição Recebida!")).toBeInTheDocument();
  });

  it("mostra a mensagem de erro se a API falhar", async () => {
    const errorMessage = "Este email já foi enviado.";
    mockedSubmitApplication.mockRejectedValue(new Error(errorMessage));

    render(<ApplicationForm />);

    // Preenche o formulário
    fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
      target: { value: "Teste Erro" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "erro@empresa.com" },
    });
    fireEvent.change(screen.getByLabelText(/Empresa/i), {
      target: { value: "Erro Corp" },
    });
    fireEvent.change(screen.getByLabelText(/Por que você quer participar?/i), {
      target: { value: "Quero participar do teste de erro" },
    });

    // CORREÇÃO: Dispare o 'submit' no formulário
    const form = screen.getByTestId("application-form");
    fireEvent.submit(form);

    // Verifique se a API foi chamada
    await waitFor(() => {
      expect(mockedSubmitApplication).toHaveBeenCalled();
    });

    // Verifique se a mensagem de erro apareceu
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
