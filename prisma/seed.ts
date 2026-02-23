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

  // Create sample courses
  const courses = [
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

  for (const course of courses) {
    await prisma.course.upsert({
      where: { title: course.title },
      update: {},
      create: course,
    });
  }

  console.log("Created sample courses");

  // Create sample articles
  const articles = [
    {
      title: "New Guidelines for Hypertension Management",
      slug: "hypertension-guidelines-2024",
      content: "The latest ACC/AHA guidelines recommend...",
      summary: "Updated clinical guidelines for managing hypertension in adult patients.",
      category: "Cardiology",
      tags: "hypertension,cardiology,guidelines",
      source: "American Heart Association",
      publishedAt: new Date("2024-01-15"),
    },
    {
      title: "Advances in Type 2 Diabetes Treatment",
      slug: "diabetes-treatment-advances",
      content: "Recent clinical trials have demonstrated...",
      summary: "Overview of new pharmacological approaches and lifestyle interventions.",
      category: "Endocrinology",
      tags: "diabetes,endocrinology,treatment",
      source: "American Diabetes Association",
      publishedAt: new Date("2024-02-20"),
    },
    {
      title: "Mental Health in Healthcare Workers",
      slug: "healthcare-worker-mental-health",
      content: "Studies show increasing rates of burnout...",
      summary: "Addressing the mental health crisis among nursing and medical professionals.",
      category: "Mental Health",
      tags: "mental-health,burnout,nursing",
      source: "Journal of Nursing Administration",
      publishedAt: new Date("2024-03-10"),
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
