import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const ownedDocuments = await prisma.document.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: 'desc' },
  });

  const sharedDocuments = await prisma.documentShare.findMany({
    where: { userId: user.id },
    include: {
      document: {
        include: { owner: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ ownedDocuments, sharedDocuments });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, content } = await request.json();

  const doc = await prisma.document.create({
    data: {
      title: title || 'Untitled Document',
      content: content || '',
      ownerId: user.id,
    },
  });

  return NextResponse.json(doc);
}
