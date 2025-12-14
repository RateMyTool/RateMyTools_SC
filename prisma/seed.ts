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


 // Create sample reviews with moderation status
 const review1 = await prisma.review.create({
   data: {
     school: 'UH Manoa',
     tool: 'VS Code',
     subject: 'ICS',
     courseNumber: '314',
     rating: 5,
     tags: ['Great Documentation', 'Easy to Use'],
     reviewText: 'Amazing tool for software development. Very intuitive and powerful.',
     userEmail: 'john@foo.com',
     moderationStatus: 'APPROVED',
     moderationReason: null,
     moderatedAt: new Date(),
     flaggedCategories: [],
   },
 });

 // Log the moderation for review1
 await prisma.moderationLog.create({
   data: {
     reviewId: review1.id,
     action: 'auto_approved',
     reason: null,
     flaggedCategories: [],
     moderatorEmail: null,
   },
 });


 const review2 = await prisma.review.create({
   data: {
     school: 'UH Manoa',
     tool: 'GitHub',
     subject: 'ICS',
     courseNumber: '314',
     rating: 5,
     tags: ['Essential', 'Collaboration'],
     reviewText: 'Essential for version control and team collaboration.',
     userEmail: 'john@foo.com',
     moderationStatus: 'APPROVED',
     moderationReason: null,
     moderatedAt: new Date(),
     flaggedCategories: [],
   },
 });

 await prisma.moderationLog.create({
   data: {
     reviewId: review2.id,
     action: 'auto_approved',
     reason: null,
     flaggedCategories: [],
     moderatorEmail: null,
   },
 });


 const review3 = await prisma.review.create({
   data: {
     school: 'UH Hilo',
     tool: 'Notion',
     subject: 'MATH',
     courseNumber: '241',
     rating: 4,
     tags: ['Versatile', 'Customizable'],
     reviewText: 'Great for organizing notes and tasks. Very customizable.',
     userEmail: 'admin@foo.com',
     moderationStatus: 'APPROVED',
     moderationReason: null,
     moderatedAt: new Date(),
     flaggedCategories: [],
   },
 });

 await prisma.moderationLog.create({
   data: {
     reviewId: review3.id,
     action: 'manual_approved',
     reason: 'Manually verified by admin',
     flaggedCategories: [],
     moderatorEmail: 'admin@foo.com',
   },
 });

 // Create a sample pending review for testing moderation
 await prisma.review.create({
   data: {
     school: 'UH West Oahu',
     tool: 'Slack',
     subject: 'ICS',
     courseNumber: '211',
     rating: 4,
     tags: ['Communication', 'Team Work'],
     reviewText: 'Great for team communication during group projects.',
     userEmail: 'john@foo.com',
     moderationStatus: 'PENDING',
     moderationReason: null,
     moderatedAt: null,
     flaggedCategories: [],
   },
 });


 console.log('Seeding completed successfully!');
 console.log('- 2 users created (admin@foo.com, john@foo.com)');
 console.log('- 4 reviews created (3 approved, 1 pending moderation)');
 console.log('- 3 moderation logs created');
}


main()
 .catch((e) => {
   console.error(e);
   process.exit(1);
 })
 .finally(async () => {
   await prisma.$disconnect();
 });
 
