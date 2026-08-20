import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const { email } = await request.json();

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (doc.ownerId !== user.id) {
    return NextResponse.json({ error: 'Only the owner can share this document' }, { status: 403 });
  }

  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (targetUser.id === user.id) {
    return NextResponse.json({ error: 'Cannot share with yourself' }, { status: 400 });
  }

  try {
    const share = await prisma.documentShare.create({
      data: {
        documentId: id,
        userId: targetUser.id,
      },
    });
    return NextResponse.json(share);
  } catch {
    return NextResponse.json({ error: 'Already shared with this user' }, { status: 400 });
  }
}
