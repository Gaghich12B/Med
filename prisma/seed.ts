import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@healthcare.com' },
    update: {},
    create: {
      email: 'admin@healthcare.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      title: 'Platform Administrator',
      bio: 'Healthcare Pro Network Administrator',
    },
  });

  // Create sample courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course-acls-001' },
    update: {},
    create: {
      id: 'course-acls-001',
      title: 'Advanced Cardiovascular Life Support (ACLS)',
      description: 'Comprehensive ACLS certification course for healthcare professionals covering advanced cardiac life support protocols.',
      category: 'Emergency Medicine',
      duration: 16,
      price: 299.00,
      level: 'ADVANCED',
      accreditation: 'AHA',
      ceuCredits: 16,
      isActive: true,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-bls-001' },
    update: {},
    create: {
      id: 'course-bls-001',
      title: 'Basic Life Support (BLS)',
      description: 'Essential BLS certification for healthcare providers covering CPR and emergency cardiovascular care.',
      category: 'Emergency Medicine',
      duration: 8,
      price: 149.00,
      level: 'BEGINNER',
      accreditation: 'AHA',
      ceuCredits: 8,
      isActive: true,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: 'course-pals-001' },
    update: {},
    create: {
      id: 'course-pals-001',
      title: 'Pediatric Advanced Life Support (PALS)',
      description: 'Advanced pediatric life support training for healthcare professionals working with children.',
      category: 'Pediatrics',
      duration: 14,
      price: 279.00,
      level: 'ADVANCED',
      accreditation: 'AHA',
      ceuCredits: 14,
      isActive: true,
    },
  });

  // Create sample locations
  const location1 = await prisma.courseLocation.upsert({
    where: { id: 'loc-sf-001' },
    update: {},
    create: {
      id: 'loc-sf-001',
      courseId: course1.id,
      address: '123 Medical Center Dr',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
  });

  const location2 = await prisma.courseLocation.upsert({
    where: { id: 'loc-la-001' },
    update: {},
    create: {
      id: 'loc-la-001',
      courseId: course2.id,
      address: '456 Healthcare Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      latitude: 34.0522,
      longitude: -118.2437,
    },
  });

  // Create scheduled courses
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  await prisma.scheduledCourse.upsert({
    where: { id: 'sched-001' },
    update: {},
    create: {
      id: 'sched-001',
      courseLocationId: location1.id,
      startDate: nextMonth,
      endDate: new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
      seatsAvailable: 20,
      registrationDeadline: new Date(nextMonth.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  const twoMonths = new Date();
  twoMonths.setMonth(twoMonths.getMonth() + 2);

  await prisma.scheduledCourse.upsert({
    where: { id: 'sched-002' },
    update: {},
    create: {
      id: 'sched-002',
      courseLocationId: location2.id,
      startDate: twoMonths,
      endDate: new Date(twoMonths.getTime() + 1 * 24 * 60 * 60 * 1000),
      seatsAvailable: 15,
      registrationDeadline: new Date(twoMonths.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Create sample medical reference articles
  await prisma.article.upsert({
    where: { slug: 'sepsis-management-guidelines' },
    update: {},
    create: {
      title: 'Sepsis Management Guidelines 2024',
      slug: 'sepsis-management-guidelines',
      content: 'Current evidence-based guidelines for the management of sepsis and septic shock in adult patients.',
      category: 'Critical Care',
      evidenceGrade: 'A',
      specialty: 'Critical Care',
      tags: JSON.stringify(['sepsis', 'critical care', 'guidelines']),
      isPublished: true,
    },
  });

  await prisma.article.upsert({
    where: { slug: 'hypertension-treatment-protocol' },
    update: {},
    create: {
      title: 'Hypertension Treatment Protocol',
      slug: 'hypertension-treatment-protocol',
      content: 'Updated clinical protocols for the diagnosis and management of hypertension in adults.',
      category: 'Cardiology',
      evidenceGrade: 'A',
      specialty: 'Cardiology',
      tags: JSON.stringify(['hypertension', 'cardiology', 'treatment']),
      isPublished: true,
    },
  });

  await prisma.article.upsert({
    where: { slug: 'diabetes-care-standards' },
    update: {},
    create: {
      title: 'Standards of Medical Care in Diabetes',
      slug: 'diabetes-care-standards',
      content: 'Comprehensive standards for diabetes care including screening, diagnosis, and treatment recommendations.',
      category: 'Endocrinology',
      evidenceGrade: 'A',
      specialty: 'Endocrinology',
      tags: JSON.stringify(['diabetes', 'endocrinology', 'standards']),
      isPublished: true,
    },
  });

  // Create sample nurse user
  const nurse = await prisma.user.upsert({
    where: { email: 'nurse@healthcare.com' },
    update: {},
    create: {
      email: 'nurse@healthcare.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: 'NURSE',
      specialty: 'Critical Care',
      location: 'San Francisco, CA',
    },
  });

  await prisma.profile.upsert({
    where: { userId: nurse.id },
    update: {},
    create: {
      userId: nurse.id,
      title: 'Registered Nurse',
      bio: 'Experienced critical care nurse with 10 years of ICU experience.',
    },
  });

  // Sample posts
  await prisma.post.create({
    data: {
      userId: nurse.id,
      content: 'Just completed my ACLS recertification! The new guidelines have some important updates for post-cardiac arrest care.',
      postType: 'Achievement',
    },
  }).catch(() => {});

  await prisma.post.create({
    data: {
      userId: admin.id,
      content: 'Welcome to Healthcare Pro Network! Connect with colleagues, find continuing education courses, and stay updated with the latest medical references.',
      postType: 'Announcement',
    },
  }).catch(() => {});

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
