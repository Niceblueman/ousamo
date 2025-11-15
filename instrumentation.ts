// instrumentation.ts
import { registerOTel } from '@vercel/otel';
import { getDatabase } from './lib/db';

export function register() {
  registerOTel('next-app'); // Example: Registering OpenTelemetry
  console.log('Next.js server instance initialized and instrumentation registered.');
  // Other server-side initialization logic can go here
  // getDatabase()
}