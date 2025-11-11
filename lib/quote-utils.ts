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
  try {
    // Use API route for faster, more reliable loading in production
    const response = await fetch("/api/quote/data", {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const jsonData = await response.json()
    if (jsonData && jsonData.steps && Array.isArray(jsonData.steps)) {
      return jsonData
    }
    throw new Error("Invalid data structure from API")
  } catch (error) {
    // Fallback: try dynamic import if API fails
    try {
      const data = await import("@/data/quote-options.json")
      if (data && data.default && data.default.steps) {
        return data.default
      }
      throw new Error("Invalid data structure from import")
    } catch (importError) {
      console.error("Both API and import failed:", { error, importError })
      throw error // Throw the original API error
    }
  }
}

export function getStepById(steps: QuoteStep[], stepId: number): QuoteStep | undefined {
  return steps.find((step) => step.id === stepId)
}

export function getOptionById(step: QuoteStep, optionId: string): QuoteOption | undefined {
  return step.options.find((opt) => opt.id === optionId)
}
