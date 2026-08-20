'use client';

import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

export default function UserSwitcher({
  currentUser,
  allUsers,
}: {
  currentUser: User;
  allUsers: User[];
}) {
  const router = useRouter();

  const handleUserChange = async (userId: string) => {
    // Set a cookie for the selected user
    document.cookie = `userId=${userId}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <select
      className="text-sm bg-transparent text-gray-500 hover:text-gray-900 outline-none cursor-pointer font-medium focus:ring-0 border-none p-0 pr-6"
      value={currentUser.id}
      onChange={(e) => handleUserChange(e.target.value)}
    >
      {allUsers.map((user) => (
        <option key={user.id} value={user.id}>
          Switch to {user.name?.split(' ')[0] || user.email}
        </option>
      ))}
    </select>
  );
}
