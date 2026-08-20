import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import DocumentEditor from '@/components/DocumentEditor';

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/');

  const doc = await prisma.document.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      shares: {
        include: { user: true }
      }
    }
  });

  if (!doc) notFound();

  const isOwner = doc.ownerId === user.id;
  const isShared = doc.shares.some((s: { userId: string }) => s.userId === user.id);

  if (!isOwner && !isShared) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-500">You do not have permission to view this document. Request access from the owner.</p>
        </div>
      </div>
    );
  }

  return (
    <DocumentEditor 
      document={doc} 
      isOwner={isOwner} 
      currentUser={user} 
    />
  );
}
