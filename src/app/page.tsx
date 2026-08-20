import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { FileText, Plus, Users, Clock, File } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();
  
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-700">No users found</h2>
          <p className="text-gray-500">Please seed the database to continue.</p>
        </div>
      </div>
    );
  }

  const ownedDocs = await prisma.document.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: 'desc' },
  });

  const sharedShares = await prisma.documentShare.findMany({
    where: { userId: user.id },
    include: {
      document: {
        include: { owner: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name?.split(' ')[0]}</h1>
          <p className="text-gray-500 mt-1">Create a new document or continue where you left off.</p>
        </div>
        <form action={async () => {
          'use server';
          const currentUser = await getCurrentUser();
          if (!currentUser) return;
          const newDoc = await prisma.document.create({
            data: { ownerId: currentUser.id }
          });
          redirect(`/d/${newDoc.id}`);
        }}>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all font-medium">
            <Plus size={20} />
            Blank Document
          </button>
        </form>
      </div>

      {/* Owned Documents */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-gray-800">
          <FileText size={20} className="text-blue-500" />
          <h2 className="text-xl font-bold">Recent Documents</h2>
        </div>
        
        {ownedDocs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <File className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new document.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ownedDocs.map((doc: { id: string; title: string; updatedAt: Date }) => (
              <Link key={doc.id} href={`/d/${doc.id}`} className="group block">
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all h-48 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <FileText className="text-blue-600" size={22} />
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-t pt-3 mt-2">
                    <Clock size={14} />
                    {new Date(doc.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Shared Documents */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-gray-800">
          <Users size={20} className="text-green-500" />
          <h2 className="text-xl font-bold">Shared with me</h2>
        </div>
        
        {sharedShares.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-sm font-medium text-gray-900">No shared documents</h3>
            <p className="mt-1 text-sm text-gray-500">Documents shared with you will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sharedShares.map((share: { id: string; documentId: string; document: { title: string; owner: { name: string | null } }; createdAt: Date }) => (
              <Link key={share.id} href={`/d/${share.documentId}`} className="group block">
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all h-48 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Users size={80} className="text-green-600 -mr-6 -mt-6 transform rotate-12" />
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <FileText className="text-green-600" size={22} />
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {share.document.title}
                    </h3>
                  </div>
                  
                  <div className="relative z-10 flex flex-col gap-1.5 border-t pt-3 mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-600">
                        {share.document.owner.name?.[0] || 'O'}
                      </div>
                      <span className="truncate">{share.document.owner.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <Clock size={14} />
                      {new Date(share.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
