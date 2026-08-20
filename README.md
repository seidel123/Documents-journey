# Docs Clone

A lightweight full-stack document editing application built with Next.js, Prisma, TipTap, and Tailwind CSS.

## Prerequisites
- Node.js 18+
- npm

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database and generate Prisma client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. Seed the database with test users:
   ```bash
   node prisma/seed.js
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Included
- **Document Creation and Editing**: Create new documents and edit them using a rich-text editor (TipTap). Supported formats include Bold, Italic, Headings, and Lists.
- **File Upload**: Import `.txt` or `.md` files directly into the editor.
- **Sharing**: Share documents with other users by their email. View documents shared with you on the dashboard.
- **Persistence**: Documents and sharing logic are persisted in a local SQLite database using Prisma.
- **Authentication**: Simple mocked authentication allowing you to switch between seeded users (Alice and Bob) from the navigation bar.

## Running Tests
Run the integration test suite via Jest:
```bash
npx jest
```
