import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'cjxd12345@gmail.com' },
    update: { password: '123' },
    create: {
      email: 'cjxd12345@gmail.com',
      password: '123',
      name: 'Admin',
      role: 'ADMIN'
    }
  });
  console.log('Admin user created successfully');
}
main().catch(console.error).finally(() => prisma.$disconnect());
