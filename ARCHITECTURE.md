# Architecture Note

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Rich Text Editor**: TipTap
- **Icons**: Lucide React
- **Testing**: Jest

## Key Prioritization Decisions

### 1. SQLite over Postgres
I chose SQLite with Prisma to ensure reviewers can run the application locally with minimal friction. It eliminates the need to spin up a Docker container or configure an external database like Supabase, allowing reviewers to evaluate the core logic immediately.

### 2. Next.js App Router
Using the App Router allowed me to colocate server-side data fetching (in `page.tsx`) with client-side interactivity (`DocumentEditor.tsx`), significantly reducing boilerplate code and speeding up development while maintaining a clean architecture.

### 3. TipTap for Rich Text Editing
TipTap is a headless wrapper around ProseMirror. It integrates seamlessly with React and outputs clean HTML/JSON. This avoids the bloat of traditional WYSIWYG editors and ensures the application can be easily extended with collaborative features (like Yjs) in the future if needed.

### 4. Mocked Authentication via Cookies
Implementing a full OAuth flow (e.g., NextAuth) would add unnecessary scope and complexity for both development and review. I prioritized a simple "User Switcher" component that sets a cookie. This cleanly demonstrates multi-user data isolation and sharing logic without the overhead of real authentication.

### 5. File Upload as Client-side Import
Instead of building a complex file storage backend (e.g., S3 or local disk storage), I implemented file upload as a client-side text import. When a user uploads a `.txt` or `.md` file, the browser reads it and injects it directly into the TipTap editor. This perfectly fulfills the product requirement while maintaining a lean backend.

## Future Improvements (With 2-4 more hours)
- **Real-time Collaboration**: Integrate TipTap's collaborative extension with a simple WebSocket server or Yjs.
- **Auto-save**: Implement a debounced auto-save hook in the editor instead of relying on a manual save button.
- **Export**: Add the ability to export the document back to `.md` or `.pdf`.
