-- Create quote_requests table for storing quotation requests
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT,
  service_type TEXT,
  project_type TEXT,
  timeline TEXT,
  budget_range TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (no auth required for quote requests)
CREATE POLICY "Allow public to insert quote requests" 
  ON quote_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for faster lookups
CREATE INDEX idx_quote_requests_email ON quote_requests(email);
CREATE INDEX idx_quote_requests_created_at ON quote_requests(created_at);
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
