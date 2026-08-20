import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
});

describe('Document operations', () => {
  beforeAll(async () => {
    // Clear test db before running
    await prisma.documentShare.deleteMany();
    await prisma.document.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a user, a document, and share it', async () => {
    const owner = await prisma.user.create({
      data: { email: 'owner@test.com', name: 'Owner' }
    });

    const doc = await prisma.document.create({
      data: {
        title: 'Test Doc',
        content: '<p>Test</p>',
        ownerId: owner.id
      }
    });

    expect(doc.title).toBe('Test Doc');

    const collaborator = await prisma.user.create({
      data: { email: 'collab@test.com', name: 'Collab' }
    });

    const share = await prisma.documentShare.create({
      data: {
        documentId: doc.id,
        userId: collaborator.id
      }
    });

    expect(share.userId).toBe(collaborator.id);

    // Verify collaborator has access
    const collabDocs = await prisma.documentShare.findMany({
      where: { userId: collaborator.id },
      include: { document: true }
    });

    expect(collabDocs).toHaveLength(1);
    expect(collabDocs[0].document.title).toBe('Test Doc');
  });
});
