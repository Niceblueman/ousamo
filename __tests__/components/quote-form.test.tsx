/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QuoteForm } from "@/components/quote-form"

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
}))

describe("QuoteForm", () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it("should render all form fields", () => {
    render(<QuoteForm onSubmit={mockOnSubmit} />)

    expect(screen.getByPlaceholderText("Votre entreprise")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("votre@email.com")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("+33 6 12 34 56 78")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Décrivez votre projet en détail...")).toBeInTheDocument()
    expect(screen.getByText("Sélectionnez votre budget")).toBeInTheDocument()
  })

  it("should validate required fields", async () => {
    render(<QuoteForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByText("Envoyer ma demande")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Le nom de l'entreprise est requis")).toBeInTheDocument()
      expect(screen.getByText("L'email est requis")).toBeInTheDocument()
      expect(screen.getByText("Le téléphone est requis")).toBeInTheDocument()
      expect(screen.getByText("La description est requise")).toBeInTheDocument()
      expect(screen.getByText("Le budget est requis")).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it("should validate email format", async () => {
    render(<QuoteForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByPlaceholderText("votre@email.com")
    fireEvent.change(emailInput, { target: { value: "invalid-email" } })

    const submitButton = screen.getByText("Envoyer ma demande")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Email invalide")).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it("should submit form with valid data", async () => {
    mockOnSubmit.mockResolvedValue(undefined)

    render(<QuoteForm onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByPlaceholderText("Votre entreprise"), {
      target: { value: "Test Company" },
    })
    fireEvent.change(screen.getByPlaceholderText("votre@email.com"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("+33 6 12 34 56 78"), {
      target: { value: "+33123456789" },
    })
    fireEvent.change(screen.getByPlaceholderText("Décrivez votre projet en détail..."), {
      target: { value: "Test project description" },
    })
    fireEvent.change(screen.getByText("Sélectionnez votre budget").parentElement!, {
      target: { value: "medium" },
    })

    const submitButton = screen.getByText("Envoyer ma demande")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        companyName: "Test Company",
        email: "test@example.com",
        phone: "+33123456789",
        description: "Test project description",
        budget: "medium",
      })
    })
  })

  it("should show success message after submission", async () => {
    mockOnSubmit.mockResolvedValue(undefined)

    render(<QuoteForm onSubmit={mockOnSubmit} />)

    // Fill form
    fireEvent.change(screen.getByPlaceholderText("Votre entreprise"), {
      target: { value: "Test Company" },
    })
    fireEvent.change(screen.getByPlaceholderText("votre@email.com"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("+33 6 12 34 56 78"), {
      target: { value: "+33123456789" },
    })
    fireEvent.change(screen.getByPlaceholderText("Décrivez votre projet en détail..."), {
      target: { value: "Test description" },
    })
    fireEvent.change(screen.getByText("Sélectionnez votre budget").parentElement!, {
      target: { value: "medium" },
    })

    const submitButton = screen.getByText("Envoyer ma demande")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Devis en cours de traitement")).toBeInTheDocument()
    })
  })

  it("should handle submission errors", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation()
    mockOnSubmit.mockRejectedValue(new Error("Submission failed"))

    render(<QuoteForm onSubmit={mockOnSubmit} />)

    // Fill form
    fireEvent.change(screen.getByPlaceholderText("Votre entreprise"), {
      target: { value: "Test Company" },
    })
    fireEvent.change(screen.getByPlaceholderText("votre@email.com"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("+33 6 12 34 56 78"), {
      target: { value: "+33123456789" },
    })
    fireEvent.change(screen.getByPlaceholderText("Décrivez votre projet en détail..."), {
      target: { value: "Test description" },
    })
    fireEvent.change(screen.getByText("Sélectionnez votre budget").parentElement!, {
      target: { value: "medium" },
    })

    const submitButton = screen.getByText("Envoyer ma demande")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith("Form submission error:", expect.any(Error))
    })

    consoleError.mockRestore()
  })
})

