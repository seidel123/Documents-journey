import { getAllUsers, getCurrentUser } from '@/lib/auth';
import UserSwitcher from '@/components/UserSwitcher';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default async function Navbar() {
  const currentUser = await getCurrentUser();
  const allUsers = await getAllUsers();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors shadow-sm">
              <BookOpen className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              Docs Clone
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow transition-shadow">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs ring-2 ring-white">
                  {currentUser.name?.[0] || currentUser.email[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {currentUser.name}
                </span>
                <div className="h-4 w-px bg-gray-200 mx-1"></div>
                <UserSwitcher currentUser={currentUser} allUsers={allUsers} />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
