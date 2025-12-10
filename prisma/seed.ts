import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();


async function main() {
 console.log('Seeding database...');


 // Create users
 const password = await bcrypt.hash('changeme', 10);
  await prisma.user.upsert({
   where: { email: 'admin@foo.com' },
   update: {},
   create: {
     email: 'admin@foo.com',
     password,
     role: 'ADMIN',
   },
 });


 await prisma.user.upsert({
   where: { email: 'john@foo.com' },
   update: {},
   create: {
     email: 'john@foo.com',
     password,
     role: 'USER',
   },
 });


 // Create sample reviews
 await prisma.review.create({
   data: {
     school: 'UH Manoa',
     tool: 'VS Code',
     subject: 'ICS',
     courseNumber: '314',
     rating: 5,
     tags: ['Great Documentation', 'Easy to Use'],
     reviewText: 'Amazing tool for software development. Very intuitive and powerful.',
     userEmail: 'john@foo.com',
   },
 });


 await prisma.review.create({
   data: {
     school: 'UH Manoa',
     tool: 'GitHub',
     subject: 'ICS',
     courseNumber: '314',
     rating: 5,
     tags: ['Essential', 'Collaboration'],
     reviewText: 'Essential for version control and team collaboration.',
     userEmail: 'john@foo.com',
   },
 });


 await prisma.review.create({
   data: {
     school: 'UH Hilo',
     tool: 'Notion',
     subject: 'MATH',
     courseNumber: '241',
     rating: 4,
     tags: ['Versatile', 'Customizable'],
     reviewText: 'Great for organizing notes and tasks. Very customizable.',
     userEmail: 'admin@foo.com',
   },
 });


 console.log('Seeding completed successfully!');
}


main()
 .catch((e) => {
   console.error(e);
   process.exit(1);
 })
 .finally(async () => {
   await prisma.$disconnect();
 });
 