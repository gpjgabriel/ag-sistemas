import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import JoinForm from "./JoinForm";

jest.mock("@/lib/api", () => ({
  submitApplication: jest.fn(),
  getApplications: jest.fn(),
  updateApplicationStatus: jest.fn(),
  validateInviteToken: jest.fn(),

  completeRegistration: jest.fn(),
}));

import { completeRegistration } from "@/lib/api";
const mockedCompleteRegistration = completeRegistration as jest.Mock;

const defaultProps = {
  token: "teste-token-123",
  email: "teste@email.com",
  name: "Name teste",
};

describe("JoinForm", () => {
  beforeEach(() => {
    mockedCompleteRegistration.mockClear();
  });

  it("renderiza o formulário com o email desabilitado e o nome preenchido", () => {
    render(<JoinForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue(defaultProps.email);
    expect(emailInput).toBeDisabled();

    const nameInput = screen.getByLabelText(/Nome Completo/i);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue(defaultProps.name);
    expect(nameInput).toBeEnabled();

    expect(screen.getByLabelText(/Crie uma Senha/i)).toBeInTheDocument();
  });

  it("chama a API e mostra a mensagem de sucesso ao enviar", async () => {
    mockedCompleteRegistration.mockResolvedValue({ id: "new-user-id" });

    render(<JoinForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Nome Completo/i);
    const passwordInput = screen.getByLabelText(/Crie uma Senha/i);

    fireEvent.change(nameInput, { target: { value: "agsistemas" } });
    fireEvent.change(passwordInput, { target: { value: "agsistemas123" } });

    const form = screen.getByTestId("join-form");
    fireEvent.submit(form);

    // Verifica se a API foi chamada com os dados corretos
    await waitFor(() => {
      expect(mockedCompleteRegistration).toHaveBeenCalledTimes(1);
      expect(mockedCompleteRegistration).toHaveBeenCalledWith(
        defaultProps.token,
        {
          name: "agsistemas",
          password: "agsistemas123",
        }
      );
    });

    expect(await screen.findByText("Cadastro Concluído!")).toBeInTheDocument();
  });

  it("mostra a mensagem de erro se a API falhar", async () => {
    const errorMessage = "Este email já está cadastrado.";
    mockedCompleteRegistration.mockRejectedValue(new Error(errorMessage));

    render(<JoinForm {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/Crie uma Senha/i);
    fireEvent.change(passwordInput, { target: { value: "agsistemas123" } });

    const form = screen.getByTestId("join-form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedCompleteRegistration).toHaveBeenCalled();
    });

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
