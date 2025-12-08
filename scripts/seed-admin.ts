import { hash } from 'bcrypt';
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    // Hash the password
    const hashedPassword = await hash('1221', 10);

    // Create or update the admin user
    const user = await prisma.user.upsert({
      where: { email: 'john@amazon.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email: 'john@amazon.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created/updated successfully:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user.id}`);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
