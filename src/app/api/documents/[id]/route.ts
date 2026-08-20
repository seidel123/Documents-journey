import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const doc = await prisma.document.findUnique({
    where: { id },
  });

  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (doc.ownerId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.document.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { title, content } = await request.json();

  // Check if user has access (owner or shared)
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { shares: true },
  });

  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const hasAccess = doc.ownerId === user.id || doc.shares.some((s: { userId: string }) => s.userId === user.id);
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updatedDoc = await prisma.document.update({
    where: { id },
    data: {
      title: title !== undefined ? title : undefined,
      content: content !== undefined ? content : undefined,
    },
  });

  return NextResponse.json(updatedDoc);
}
