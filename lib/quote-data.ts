import quoteOptions from "@/data/quote-options.json"

export interface QuoteStep {
  id: number
  title: string
  description: string
  allowMultiple: boolean
  options: QuoteOption[]
}

export interface QuoteOption {
  id: string
  icon: string
  title: string
  subtitle: string
  details: string
}

export function getQuoteSteps(): QuoteStep[] {
  return quoteOptions.steps
}

export function getStepById(id: number): QuoteStep | undefined {
  return quoteOptions.steps.find((step) => step.id === id)
}
