import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'nurse@example.com',
        password: hashedPassword,
        name: 'Sarah Johnson',
        role: 'NURSE',
        profile: {
          create: {
            title: 'Registered Nurse',
            specialty: 'Critical Care',
            licenseNumber: 'RN-12345',
            licenseState: 'CA',
            bio: 'Experienced critical care nurse with 8 years of experience in ICU settings.',
            location: 'San Francisco, CA',
            phone: '+1 555-0101',
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'np@example.com',
        password: hashedPassword,
        name: 'Michael Chen',
        role: 'NURSE_PRACTITIONER',
        profile: {
          create: {
            title: 'Nurse Practitioner',
            specialty: 'Family Medicine',
            licenseNumber: 'NP-67890',
            licenseState: 'NY',
            bio: 'Family Nurse Practitioner specializing in primary care and chronic disease management.',
            location: 'New York, NY',
            phone: '+1 555-0102',
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        email: 'pa@example.com',
        password: hashedPassword,
        name: 'Emily Rodriguez',
        role: 'PHYSICIAN_ASSISTANT',
        profile: {
          create: {
            title: 'Physician Assistant',
            specialty: 'Emergency Medicine',
            licenseNumber: 'PA-24680',
            licenseState: 'TX',
            bio: 'Emergency Medicine PA with 5 years of experience in Level 1 trauma centers.',
            location: 'Austin, TX',
            phone: '+1 555-0103',
          }
        }
      }
    })
  ])

  console.log('Created users:', users.length)

  // Get profiles
  const profiles = await Promise.all(users.map(user => 
    prisma.profile.findUnique({ where: { userId: user.id } })
  ))

  // Add education for first user
  if (profiles[0]) {
    await prisma.education.create({
      data: {
        profileId: profiles[0]!.id,
        school: 'University of California, San Francisco',
        degree: 'Bachelor of Science in Nursing',
        field: 'Nursing',
        startDate: new Date('2012-09-01'),
        endDate: new Date('2016-05-31'),
        description: 'Graduated with honors. Specialized in critical care nursing.'
      }
    })

    // Add experience for first user
    await prisma.experience.create({
      data: {
        profileId: profiles[0]!.id,
        title: 'ICU Nurse',
        company: 'San Francisco General Hospital',
        location: 'San Francisco, CA',
        startDate: new Date('2016-06-01'),
        current: true,
        description: 'Providing critical care to patients in the Intensive Care Unit. Specializing in ventilator management and hemodynamic monitoring.'
      }
    })

    // Add skills for first user
    await Promise.all([
      prisma.skill.create({
        data: {
          profileId: profiles[0]!.id,
          name: 'Critical Care Nursing',
          level: 'EXPERT'
        }
      }),
      prisma.skill.create({
        data: {
          profileId: profiles[0]!.id,
          name: 'Ventilator Management',
          level: 'ADVANCED'
        }
      }),
      prisma.skill.create({
        data: {
          profileId: profiles[0]!.id,
          name: 'Hemodynamic Monitoring',
          level: 'ADVANCED'
        }
      })
    ])
  }

  // Add certifications for first user
  const certifications = await Promise.all([
    prisma.certification.create({
      data: {
        userId: users[0].id,
        name: 'Critical Care Registered Nurse (CCRN)',
        issuer: 'AACN Certification Corporation',
        credentialNumber: 'CCRN-123456',
        issueDate: new Date('2018-03-15'),
        expirationDate: new Date('2025-03-15'),
        status: 'ACTIVE',
        ceCredits: 45
      }
    }),
    prisma.certification.create({
      data: {
        userId: users[0].id,
        name: 'Basic Life Support (BLS)',
        issuer: 'American Heart Association',
        credentialNumber: 'BLS-789012',
        issueDate: new Date('2023-06-01'),
        expirationDate: new Date('2025-06-01'),
        status: 'ACTIVE',
        ceCredits: 0
      }
    }),
    prisma.certification.create({
      data: {
        userId: users[0].id,
        name: 'Advanced Cardiovascular Life Support (ACLS)',
        issuer: 'American Heart Association',
        credentialNumber: 'ACLS-345678',
        issueDate: new Date('2023-08-15'),
        expirationDate: new Date('2025-08-15'),
        status: 'ACTIVE',
        ceCredits: 8
      }
    })
  ])

  console.log('Created certifications:', certifications.length)

  // Create courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'Advanced Cardiac Life Support Update',
        description: 'Comprehensive update on the latest ACLS guidelines and protocols. Includes hands-on practice with cardiac arrest scenarios, airway management, and pharmacology.',
        category: 'Emergency Medicine',
        level: 'INTERMEDIATE',
        duration: 480,
        ceCredits: 8,
        price: 0,
        isPublished: true,
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        modules: {
          create: [
            {
              title: 'Introduction to ACLS',
              description: 'Overview of ACLS principles and team dynamics',
              order: 1,
              lessons: {
                create: [
                  {
                    title: 'ACLS Overview',
                    content: 'This module covers the fundamental principles of Advanced Cardiac Life Support, including the systematic approach to cardiac emergencies, team dynamics, and effective communication during resuscitation efforts.',
                    duration: 30,
                    order: 1
                  },
                  {
                    title: 'Team Dynamics',
                    content: 'Learn about the roles and responsibilities of each team member during a cardiac arrest, including team leader, compressor, airway manager, and medication administrator.',
                    duration: 45,
                    order: 2
                  }
                ]
              }
            },
            {
              title: 'Cardiac Arrest Management',
              description: 'Management of various cardiac arrest rhythms',
              order: 2,
              lessons: {
                create: [
                  {
                    title: 'VF/pVT Management',
                    content: 'Detailed protocol for managing ventricular fibrillation and pulseless ventricular tachycardia, including defibrillation energy doses and medication administration.',
                    duration: 60,
                    order: 1
                  },
                  {
                    title: 'PEA/Asystole Management',
                    content: 'Approach to pulseless electrical activity and asystole, focusing on identifying and treating reversible causes.',
                    duration: 60,
                    order: 2
                  }
                ]
              }
            }
          ]
        }
      }
    }),
    prisma.course.create({
      data: {
        title: 'Wound Care Fundamentals',
        description: 'Learn the essentials of wound assessment, treatment, and management for various types of wounds commonly encountered in clinical practice.',
        category: 'Wound Care',
        level: 'BEGINNER',
        duration: 360,
        ceCredits: 6,
        price: 0,
        isPublished: true,
        imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800',
        modules: {
          create: [
            {
              title: 'Wound Assessment',
              description: 'Learn to properly assess and document wounds',
              order: 1,
              lessons: {
                create: [
                  {
                    title: 'Wound Classification',
                    content: 'Understanding different types of wounds including pressure injuries, surgical wounds, traumatic wounds, and chronic wounds.',
                    duration: 45,
                    order: 1
                  },
                  {
                    title: 'Assessment Techniques',
                    content: 'Proper techniques for measuring wound dimensions, assessing tissue types, and documenting wound characteristics.',
                    duration: 60,
                    order: 2
                  }
                ]
              }
            }
          ]
        }
      }
    }),
    prisma.course.create({
      data: {
        title: 'Infection Control Best Practices',
        description: 'Comprehensive guide to infection prevention and control in healthcare settings, including standard precautions and transmission-based precautions.',
        category: 'Infection Control',
        level: 'BEGINNER',
        duration: 240,
        ceCredits: 4,
        price: 0,
        isPublished: true,
        imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
        modules: {
          create: [
            {
              title: 'Standard Precautions',
              description: 'Foundation of infection control practices',
              order: 1,
              lessons: {
                create: [
                  {
                    title: 'Hand Hygiene',
                    content: 'Proper hand hygiene techniques and when to perform hand washing versus hand sanitizer use.',
                    duration: 30,
                    order: 1
                  },
                  {
                    title: 'Personal Protective Equipment',
                    content: 'Selection and proper use of gloves, gowns, masks, and eye protection.',
                    duration: 45,
                    order: 2
                  }
                ]
              }
            }
          ]
        }
      }
    })
  ])

  console.log('Created courses:', courses.length)

  // Enroll first user in courses
  await Promise.all([
    prisma.enrollment.create({
      data: {
        userId: users[0].id,
        courseId: courses[0].id,
        progress: 65,
        completed: false
      }
    }),
    prisma.enrollment.create({
      data: {
        userId: users[0].id,
        courseId: courses[1].id,
        progress: 30,
        completed: false
      }
    })
  ])

  // Create course locations
  const locations = await Promise.all([
    prisma.courseLocation.create({
      data: {
        name: 'San Francisco Medical Center',
        address: '1000 Potrero Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94110',
        latitude: 37.7599,
        longitude: -122.4006,
        phone: '+1 415-555-0100',
        website: 'https://sfmedical.example.com'
      }
    }),
    prisma.courseLocation.create({
      data: {
        name: 'New York Presbyterian Hospital',
        address: '525 E 68th St',
        city: 'New York',
        state: 'NY',
        zipCode: '10065',
        latitude: 40.7644,
        longitude: -73.9536,
        phone: '+1 212-555-0200',
        website: 'https://nyp.example.com'
      }
    }),
    prisma.courseLocation.create({
      data: {
        name: 'Austin Medical Education Center',
        address: '1500 Red River St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        latitude: 30.2672,
        longitude: -97.7431,
        phone: '+1 512-555-0300',
        website: 'https://austinmed.example.com'
      }
    })
  ])

  console.log('Created course locations:', locations.length)

  // Create scheduled courses
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 30)

  await Promise.all([
    prisma.scheduledCourse.create({
      data: {
        courseLocationId: locations[0].id,
        title: 'ACLS Provider Course',
        description: 'Full ACLS provider certification course with hands-on skills testing.',
        category: 'Emergency Medicine',
        startDate: new Date(futureDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(futureDate.getTime() + 8 * 24 * 60 * 60 * 1000),
        price: 250,
        seatsAvailable: 8,
        seatsTotal: 12,
        instructor: 'Dr. James Wilson',
        contactEmail: 'training@sfmedical.example.com',
        contactPhone: '+1 415-555-0101'
      }
    }),
    prisma.scheduledCourse.create({
      data: {
        courseLocationId: locations[1].id,
        title: 'PALS Provider Course',
        description: 'Pediatric Advanced Life Support certification course.',
        category: 'Pediatrics',
        startDate: new Date(futureDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(futureDate.getTime() + 15 * 24 * 60 * 60 * 1000),
        price: 275,
        seatsAvailable: 5,
        seatsTotal: 10,
        instructor: 'Dr. Sarah Martinez',
        contactEmail: 'training@nyp.example.com',
        contactPhone: '+1 212-555-0201'
      }
    }),
    prisma.scheduledCourse.create({
      data: {
        courseLocationId: locations[2].id,
        title: 'TNCC Provider Course',
        description: 'Trauma Nursing Core Course certification.',
        category: 'Trauma',
        startDate: new Date(futureDate.getTime() + 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(futureDate.getTime() + 22 * 24 * 60 * 60 * 1000),
        price: 300,
        seatsAvailable: 10,
        seatsTotal: 15,
        instructor: 'Nurse Practitioner Lisa Brown',
        contactEmail: 'training@austinmed.example.com',
        contactPhone: '+1 512-555-0301'
      }
    })
  ])

  // Create articles
  await Promise.all([
    prisma.article.create({
      data: {
        title: 'Current Guidelines for Sepsis Management',
        slug: 'sepsis-management-guidelines',
        content: 'Sepsis remains one of the leading causes of mortality in hospitalized patients. The Surviving Sepsis Campaign has updated its guidelines to reflect the latest evidence-based practices. Key recommendations include early recognition through screening tools, timely administration of broad-spectrum antibiotics within one hour of recognition, and appropriate fluid resuscitation. This article provides a comprehensive overview of the current guidelines and their practical application in clinical settings.',
        summary: 'Overview of the latest Surviving Sepsis Campaign guidelines and their clinical application.',
        category: 'Critical Care',
        tags: 'sepsis,critical care,guidelines,infection',
        evidenceGrade: 'A',
        author: 'Dr. Robert Kim, MD',
        sources: 'https://www.survivingsepsis.org,https://jamanetwork.com',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Pressure Injury Prevention and Treatment',
        slug: 'pressure-injury-prevention',
        content: 'Pressure injuries remain a significant healthcare concern, particularly in critically ill and immobile patients. Prevention strategies include regular repositioning, use of pressure-redistributing surfaces, and maintaining proper skin hygiene. The National Pressure Injury Advisory Panel (NPIAP) provides evidence-based recommendations for both prevention and treatment. This article covers the latest staging guidelines, prevention protocols, and treatment options including advanced wound care products.',
        summary: 'Evidence-based strategies for preventing and treating pressure injuries.',
        category: 'Wound Care',
        tags: 'pressure injury,wound care,prevention,treatment',
        evidenceGrade: 'B',
        author: 'Nurse Practitioner Jennifer Adams, MSN, RN',
        sources: 'https://npiap.com,https://www.woundsource.com',
        relatedCourses: courses[1].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Antibiotic Stewardship in Acute Care Settings',
        slug: 'antibiotic-stewardship',
        content: 'Antibiotic resistance is a growing global health threat. Antibiotic stewardship programs aim to optimize the use of antimicrobial agents to improve patient outcomes, reduce resistance, and decrease healthcare costs. Key components include appropriate prescribing practices, de-escalation based on culture results, and duration optimization. This article discusses implementation strategies for stewardship programs in acute care settings and provides practical tools for clinicians.',
        summary: 'Strategies for implementing effective antibiotic stewardship programs.',
        category: 'Infection Control',
        tags: 'antibiotics,stewardship,resistance,infection control',
        evidenceGrade: 'A',
        author: 'Dr. Maria Garcia, PharmD',
        sources: 'https://www.cdc.gov,https://www.idsociety.org',
        relatedCourses: courses[2].id,
        isPublished: true
      }
    })
  ])

  console.log('Created articles')

  // Create some posts
  await Promise.all([
    prisma.post.create({
      data: {
        userId: users[0].id,
        content: 'Just completed the Advanced Cardiac Life Support update course! The new guidelines have some important changes from previous versions. Highly recommend for anyone working in critical care.',
        postType: 'COURSE_COMPLETION',
        likes: 12
      }
    }),
    prisma.post.create({
      data: {
        userId: users[1].id,
        content: 'Looking for recommendations on the best wound care certification programs. Any suggestions from fellow NPs?',
        postType: 'TEXT',
        likes: 8
      }
    })
  ])

  console.log('Created posts')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })