# Testing Guide

## Running Tests

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Manual API Testing

#### Test Quote Data Loading

```bash
# Test locally
node scripts/test-quote-data.js

# Test production
TEST_URL=https://www.ousamo.sarl node scripts/test-quote-data.js
```

#### Test Quote Form Submission

```bash
# Test locally
node scripts/test-quote-submit.js

# Test production
TEST_URL=https://www.ousamo.sarl node scripts/test-quote-submit.js
```

## Common Issues

### Form Submission Fails

1. **Check Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Must be set
   - `SUPABASE_SERVICE_ROLE_KEY` - Must be set
   - `RESEND_API_KEY` - Optional (emails won't send if missing)

2. **Check Database:**
   - Ensure `quote_requests` table exists
   - Run the SQL script: `scripts/001_create_quote_table.sql`
   - Check RLS policies are set correctly

3. **Check Console Logs:**
   - Look for `[Quote Submit]` prefixed logs
   - Check browser console for client-side errors
   - Check server logs for API errors

### Data Loading Issues

1. **Check API Route:**
   - Visit `/api/quote/data` directly
   - Should return JSON with `steps` array

2. **Check File:**
   - Ensure `data/quote-options.json` exists
   - Verify JSON structure is valid

## Test Files

- `__tests__/api/quote-submit.test.ts` - API route tests
- `__tests__/components/quote-form.test.tsx` - Form component tests
- `__tests__/lib/quote-utils.test.ts` - Data loading tests

