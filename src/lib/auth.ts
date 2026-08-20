import { cookies } from 'next/headers';
import { prisma } from './db';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    // Return first user as default if not set
    const defaultUser = await prisma.user.findFirst();
    return defaultUser;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return await prisma.user.findFirst();
  }

  return user;
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}
