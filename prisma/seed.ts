import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';


const prisma = new PrismaClient();


async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  config.defaultAccounts.forEach(async (account) => {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  });
  for (const data of config.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }


  // Seed schools
  console.log('  Creating schools...');
  await prisma.school.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'University of Texas at Austin',
      location: 'Austin, TX',
    },
  });
  await prisma.school.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Massachusetts Institute of Technology',
      location: 'Cambridge, MA',
    },
  });


  // Seed tools
  console.log('  Creating tools...');
  await prisma.tool.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Canvas',
      category: 'Learning Management System',
    },
  });
  await prisma.tool.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Brightspace',
      category: 'Learning Management System',
    },
  });
  await prisma.tool.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Google Classroom',
      category: 'Learning Management System',
    },
  });


  console.log('  Seeding complete!');
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
