import { cookies } from 'next/headers';
import { prisma } from './db';

async function ensureSeeded() {
  let defaultUser = await prisma.user.findFirst();
  
  if (!defaultUser) {
    console.log('Database empty, auto-seeding users...');
    defaultUser = await prisma.user.create({
      data: { email: 'alice@example.com', name: 'Alice (Owner)' }
    });
    
    await prisma.user.create({
      data: { email: 'bob@example.com', name: 'Bob (Collaborator)' }
    });
  }
  
  return defaultUser;
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    // Return first user as default if not set
    return await ensureSeeded();
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return await ensureSeeded();
  }

  return user;
}

export async function getAllUsers() {
  await ensureSeeded();
  return await prisma.user.findMany();
}
