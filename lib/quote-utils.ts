export interface QuoteOption {
  id: string
  icon: string
  title: string
  subtitle: string
  details: string
}

export interface QuoteStep {
  id: number
  title: string
  description: string
  multiSelect: boolean
  options: QuoteOption[]
}

export interface QuoteData {
  steps: QuoteStep[]
}

export interface QuoteFormData {
  selections: Record<number, string | string[]>
  companyName: string
  email: string
  phone: string
  description: string
  budget: string
}

export async function loadQuoteData(): Promise<QuoteData> {
  const data = await import("@/data/quote-options.json")
  return data.default
}

export function getStepById(steps: QuoteStep[], stepId: number): QuoteStep | undefined {
  return steps.find((step) => step.id === stepId)
}

export function getOptionById(step: QuoteStep, optionId: string): QuoteOption | undefined {
  return step.options.find((opt) => opt.id === optionId)
}
