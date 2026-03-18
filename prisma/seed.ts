import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@medplatform.com" },
    update: {},
    create: {
      email: "admin@medplatform.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
      specialty: "Administration",
      location: "New York, NY",
      profile: {
        create: {
          bio: "Platform administrator",
        },
      },
    },
  });

  console.log("Created admin user:", admin.email);

  // Create demo healthcare professional users
  const nursePassword = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "nurse@example.com" },
    update: {},
    create: {
      email: "nurse@example.com",
      password: nursePassword,
      name: "Sarah Johnson",
      role: "NURSE",
      specialty: "Critical Care",
      location: "Chicago, IL",
      profile: { create: { title: "ICU Nurse", bio: "5+ years in critical care nursing." } },
    },
  });

  await prisma.user.upsert({
    where: { email: "np@example.com" },
    update: {},
    create: {
      email: "np@example.com",
      password: nursePassword,
      name: "Michael Chen",
      role: "NURSE_PRACTITIONER",
      specialty: "Family Medicine",
      location: "San Francisco, CA",
      profile: { create: { title: "Family NP", bio: "Board-certified family nurse practitioner." } },
    },
  });

  await prisma.user.upsert({
    where: { email: "pa@example.com" },
    update: {},
    create: {
      email: "pa@example.com",
      password: nursePassword,
      name: "Emily Rodriguez",
      role: "PHYSICIAN_ASSISTANT",
      specialty: "Emergency Medicine",
      location: "Houston, TX",
      profile: { create: { title: "Emergency PA", bio: "PA specializing in emergency medicine." } },
    },
  });

  console.log("Created demo users");

  // Create sample courses (only if none exist)
  const existingCourseCount = await prisma.course.count();
  if (existingCourseCount === 0) {
    const courseData = [
    {
      title: "Advanced Cardiac Life Support (ACLS)",
      description: "Comprehensive training for managing cardiovascular emergencies.",
      category: "Emergency Medicine",
      duration: 16,
      ceCredits: 16,
    },
    {
      title: "Basic Life Support (BLS) for Healthcare Providers",
      description: "Essential CPR and emergency cardiovascular care skills.",
      category: "Emergency Medicine",
      duration: 4,
      ceCredits: 4,
    },
    {
      title: "Pharmacology for Nurse Practitioners",
      description: "Advanced pharmacology concepts for NP clinical practice.",
      category: "Pharmacology",
      duration: 30,
      ceCredits: 30,
    },
    {
      title: "Pediatric Advanced Life Support (PALS)",
      description: "Advanced training for pediatric emergencies.",
      category: "Pediatrics",
      duration: 14,
      ceCredits: 14,
    },
    {
      title: "Wound Care Management",
      description: "Comprehensive wound assessment and management techniques.",
      category: "Wound Care",
      duration: 8,
      ceCredits: 8,
    },
  ];

  for (const course of courseData) {
    await prisma.course.create({ data: course });
  }

  console.log("Created sample courses");
} else {
  console.log("Courses already exist, skipping");
}

  // Create sample articles
  const articles = [
    {
      title: "New Guidelines for Hypertension Management",
      slug: "hypertension-guidelines-2024",
      content:
        "The latest ACC/AHA guidelines recommend treating hypertension more aggressively. Blood pressure targets have been revised to below 130/80 mmHg for most adults. Lifestyle modifications remain the cornerstone of treatment.",
      category: "Cardiology",
      evidenceGrade: "A",
      source: "American Heart Association",
      sourceUrl: "https://www.heart.org",
    },
    {
      title: "Advances in Type 2 Diabetes Treatment",
      slug: "diabetes-treatment-advances",
      content:
        "Recent clinical trials have demonstrated the efficacy of GLP-1 receptor agonists and SGLT-2 inhibitors in reducing cardiovascular risk. These agents are now recommended as first-line therapy for patients with established cardiovascular disease.",
      category: "Endocrinology",
      evidenceGrade: "A",
      source: "American Diabetes Association",
      sourceUrl: "https://www.diabetes.org",
    },
    {
      title: "Mental Health in Healthcare Workers",
      slug: "healthcare-worker-mental-health",
      content:
        "Studies show increasing rates of burnout and moral injury among healthcare workers. Institutions are implementing wellness programs, flexible scheduling, and peer support networks to address this crisis.",
      category: "Mental Health",
      evidenceGrade: "B",
      source: "Journal of Nursing Administration",
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  console.log("Created sample articles");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

