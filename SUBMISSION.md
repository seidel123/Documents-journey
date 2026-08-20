# Submission

## Deliverables Included

1. **Source Code**: Full Next.js application codebase located in the `docs-app` directory.
2. **README.md**: Contains local setup, database initialization, and run instructions.
3. **ARCHITECTURE.md**: A short note explaining technical choices, priorities, and tradeoffs.
4. **AI_WORKFLOW.md**: Explanation of AI tools used, how they sped up work, and what was modified.
5. **Walkthrough Video**: 
   - [Placeholder: Insert Loom/YouTube link here]
6. **Live Deployment**: 
   - [Placeholder: Insert Vercel/Netlify link here]

## Testing the Application

### Seeded Accounts
The database seeding script (`node prisma/seed.js`) creates two users for testing:
- **Alice**: `alice@example.com`
- **Bob**: `bob@example.com`

You can seamlessly switch between these users using the dropdown in the navigation bar to test the document sharing flows.

### Feature Status
- **Document Creation/Editing**: Fully working (TipTap integration).
- **File Upload**: Fully working (Imports `.txt` or `.md` into the editor).
- **Sharing**: Fully working (Owner can share via email, recipient sees it in "Shared with me").
- **Persistence**: Fully working (SQLite via Prisma).
- **Authentication**: Working (Mocked via cookies for easy testing).

### What I Would Build Next (With 2-4 hours)
- **Auto-save**: Implement a debounced auto-save hook to prevent data loss without manual saves.
- **Real-time Collaboration**: Integrate TipTap's collaboration extension with a lightweight WebSocket server.
- **Export**: Add PDF/Markdown export functionality.
