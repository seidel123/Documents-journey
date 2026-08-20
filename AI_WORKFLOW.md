# AI Workflow Note

## AI Tools Used
- VScode 
- opencode - AI assist

## Where AI Materially Sped Up My Work
1. **Scaffolding and Boilerplate**: AI was instrumental in quickly generating the Prisma schema and the Next.js API route boilerplate. This saved significant time that would otherwise be spent looking up exact syntax.
2. **TipTap Integration**: Setting up TipTap's toolbar with all the necessary commands (`toggleBold`, `toggleHeading`, etc.) is tedious. AI generated the toolbar component rapidly, allowing me to focus on styling and integration.
3. **Mock Authentication**: The AI quickly conceptualized and implemented the cookie-based mock authentication flow, recognizing that a full auth system would violate the "keep scope reasonable" constraint.

## What AI-Generated Output I Changed or Rejected
1. **Prisma Versioning**: The AI initially tried to use Prisma v7 (which is in preview and has different configuration requirements). I manually downgraded it to Prisma v5 to ensure a stable, frictionless setup for reviewers.
2. **Error Handling in API Routes**: The AI generated some basic `try/catch` blocks, but I had to refine the error messages and HTTP status codes (403 vs 404) to make sure the sharing logic handled edge cases (like sharing with oneself or re-sharing) gracefully.
3. **Linting Errors**: The AI generated some unused variables and unescaped quotes in the React components, which I manually identified via the build process and instructed the AI to fix using regex replacements.

## Verification of Correctness and UX Quality
1. **Iterative Build Checks**: I ran `npm run build` continuously to ensure no TypeScript or ESLint errors were introduced.
2. **Test Automation**: I wrote and ran a Jest test suite (`__tests__/db.test.ts`) to verify that the core database operations (creating a document, sharing a document, and querying shared documents) worked correctly at the ORM level.
3. **Logical Validation**: I manually verified the logic flow for the mocked authentication and sharing constraints (e.g., ensuring a non-owner cannot share the document) by reviewing the API route implementations.
