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
        content: `Sepsis remains one of the leading causes of mortality in hospitalized patients. The Surviving Sepsis Campaign (SSC) has updated its guidelines to reflect the latest evidence-based practices.

Key Recommendations (Hour-1 Bundle):
• Measure lactate level; re-measure if initial lactate >2 mmol/L
• Obtain blood cultures before administering antibiotics
• Administer broad-spectrum antibiotics within 1 hour of recognition
• Begin 30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L
• Apply vasopressors for hypotension refractory to fluid resuscitation

Diagnosis:
Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection. The Sequential Organ Failure Assessment (SOFA) score is used to identify organ dysfunction. Quick SOFA (qSOFA) — altered mentation, respiratory rate ≥22/min, systolic BP ≤100 mmHg — serves as a screening tool outside the ICU.

Antibiotic Management:
Prompt, appropriate antibiotic coverage is associated with improved outcomes. De-escalation should occur as soon as culture and sensitivity data are available. Procalcitonin may guide antibiotic duration.

Fluid Resuscitation:
Crystalloids (normal saline or lactated Ringer's) are the fluids of choice. Albumin may be used when patients require substantial amounts of crystalloids. Avoid hydroxyethyl starches.

Vasopressors:
Norepinephrine is the first-choice vasopressor. Vasopressin may be added to reduce norepinephrine dose. Dopamine is reserved for highly selected patients.

Ventilation:
Use lung-protective ventilation (tidal volume 6 mL/kg predicted body weight) for sepsis-induced ARDS. Target plateau pressure ≤30 cmH2O.`,
        summary: 'Overview of the latest Surviving Sepsis Campaign guidelines and their clinical application in critical care settings.',
        category: 'Critical Care',
        tags: 'sepsis,septic shock,critical care,guidelines,infection,ICU,antibiotics,vasopressors',
        evidenceGrade: 'A',
        author: 'Dr. Robert Kim, MD',
        sources: 'https://www.survivingsepsis.org,https://jamanetwork.com,https://www.sccm.org,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Pressure Injury Prevention and Treatment',
        slug: 'pressure-injury-prevention',
        content: `Pressure injuries remain a significant healthcare concern, particularly in critically ill and immobile patients. The National Pressure Injury Advisory Panel (NPIAP) provides the current staging system and evidence-based recommendations.

NPIAP Staging:
• Stage 1: Non-blanchable erythema of intact skin
• Stage 2: Partial-thickness skin loss with exposed dermis
• Stage 3: Full-thickness skin loss without exposed fascia, tendon, or bone
• Stage 4: Full-thickness tissue loss with exposed fascia, muscle, tendon, bone, or cartilage
• Unstageable: Full-thickness obscured by slough or eschar
• Deep Tissue Pressure Injury (DTPI): Persistent non-blanchable deep red, maroon, or purple discoloration

Prevention Strategies:
• Skin assessment at admission and regularly thereafter using Braden or Waterlow scale
• Repositioning every 2 hours in bed and every 15 minutes in chair
• Use of pressure-redistributing surfaces (foam, gel, or alternating pressure mattresses)
• Moisture management — incontinence briefs, skin barriers, and barrier creams
• Nutritional optimization with adequate protein intake (1.2–1.5 g/kg/day)
• Education of patients, families, and all care team members

Treatment:
• Wound cleansing with normal saline or wound cleanser at each dressing change
• Debridement of necrotic tissue (autolytic, enzymatic, mechanical, or sharp)
• Appropriate dressing selection based on wound characteristics (hydrocolloids, foams, alginates, NPWT)
• Management of infection: topical antimicrobials for critically colonized wounds; systemic antibiotics for cellulitis or osteomyelitis
• Nutritional support: supplemental nutrition, vitamin C, zinc if deficient`,
        summary: 'Evidence-based strategies for preventing and treating pressure injuries using the NPIAP staging system.',
        category: 'Wound Care',
        tags: 'pressure injury,wound care,prevention,NPIAP,staging,skin assessment,Braden scale',
        evidenceGrade: 'B',
        author: 'Nurse Practitioner Jennifer Adams, MSN, RN',
        sources: 'https://npiap.com,https://www.woundsource.com,https://www.ahrq.gov,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[1].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Antibiotic Stewardship in Acute Care Settings',
        slug: 'antibiotic-stewardship',
        content: `Antibiotic resistance is a growing global health threat. Antibiotic stewardship programs (ASPs) aim to optimize antimicrobial use to improve patient outcomes, reduce resistance, and decrease healthcare costs.

Core Elements of Hospital Antibiotic Stewardship (CDC):
1. Leadership commitment — dedicated resources and support
2. Accountability — physician/pharmacist champion responsible for program outcomes
3. Drug expertise — pharmacist with ID training as co-lead
4. Action — implementing policies such as prospective audit and feedback, preauthorization
5. Tracking — monitoring antibiotic prescribing and outcomes
6. Reporting — reporting data to prescribers, pharmacists, and nursing staff
7. Education — ongoing education on resistance and optimal prescribing

Key Interventions:
• Prospective audit and feedback (PAF) — review of ongoing therapy by an ASP expert
• Formulary restriction and preauthorization for broad-spectrum agents
• De-escalation based on culture results and clinical trajectory
• IV to oral conversion when appropriate (bioavailability criteria met)
• Optimized dosing using PK/PD principles (e.g., extended infusion piperacillin-tazobactam)
• Duration of therapy guidelines to avoid unnecessarily prolonged courses
• Rapid diagnostic testing (BioFire, procalcitonin) to guide therapy

Resistance Prevention:
ESKAPE pathogens (Enterococcus faecium, Staphylococcus aureus, Klebsiella pneumoniae, Acinetobacter baumannii, Pseudomonas aeruginosa, Enterobacter species) represent the most critical resistant organisms. C. difficile prevention through antibiotic de-escalation is also a key goal.`,
        summary: 'Strategies for implementing effective antibiotic stewardship programs to combat antimicrobial resistance.',
        category: 'Infection Control',
        tags: 'antibiotics,stewardship,resistance,infection control,CDC,pharmacology,ESKAPE',
        evidenceGrade: 'A',
        author: 'Dr. Maria Garcia, PharmD',
        sources: 'https://www.cdc.gov/antibiotic-use/healthcare/implementation/core-elements.html,https://www.idsociety.org,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[2].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Hypertension Management: 2023 ACC/AHA Guidelines',
        slug: 'hypertension-management-guidelines',
        content: `Hypertension affects approximately 47% of U.S. adults and is the leading modifiable risk factor for cardiovascular disease, stroke, and chronic kidney disease.

Blood Pressure Classification (ACC/AHA 2017):
• Normal: <120/<80 mmHg
• Elevated: 120–129/<80 mmHg
• Stage 1 Hypertension: 130–139/80–89 mmHg
• Stage 2 Hypertension: ≥140/≥90 mmHg
• Hypertensive Crisis: >180/>120 mmHg

Measurement Technique:
• Use validated automated device; patient seated, back supported, feet flat
• At least 2 readings 1–2 minutes apart; average the readings
• Confirm with out-of-office measurements (home BP monitoring or ambulatory BP monitoring)

Lifestyle Modifications (first-line for all stages):
• Weight reduction — 1 mmHg per kg of weight loss
• DASH dietary pattern — 11 mmHg reduction
• Sodium restriction (<1,500 mg/day) — 5–6 mmHg
• Physical activity (150 min/week moderate-intensity aerobic) — 4–5 mmHg
• Limit alcohol — 4 mmHg
• Smoking cessation

Pharmacologic Treatment:
• Stage 1 with CVD or 10-year ASCVD risk ≥10%: Initiate drug therapy
• Stage 2: Initiate drug therapy (consider 2-drug combination)
• First-line agents: Thiazide diuretics, CCBs, ACEIs, or ARBs
• Avoid ACEI + ARB combination
• CKD: ACEI or ARB preferred; adjust for GFR
• Compelling indications guide drug selection (heart failure, post-MI, diabetes, stroke)

BP Targets:
• General: <130/80 mmHg
• Age ≥65 with high CV risk: <130 mmHg systolic
• CKD with proteinuria: <130/80 mmHg`,
        summary: 'ACC/AHA guidelines for classification, diagnosis, and management of hypertension in adults.',
        category: 'Cardiology',
        tags: 'hypertension,blood pressure,cardiovascular,ACC,AHA,antihypertensives,DASH diet',
        evidenceGrade: 'A',
        author: 'Dr. James Park, MD, FACC',
        sources: 'https://www.heart.org,https://www.acc.org,https://jamanetwork.com,https://www.cdc.gov',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'ADA Standards of Medical Care in Diabetes',
        slug: 'diabetes-standards-of-care',
        content: `The American Diabetes Association (ADA) publishes annual Standards of Medical Care in Diabetes, representing the most comprehensive evidence-based clinical practice recommendations for diabetes management.

Diagnosis Criteria (any one of the following):
• Fasting plasma glucose ≥126 mg/dL (7.0 mmol/L)
• 2-hour plasma glucose ≥200 mg/dL during 75g OGTT
• A1C ≥6.5%
• Random plasma glucose ≥200 mg/dL with symptoms

Glycemic Targets:
• A1C <7% for most non-pregnant adults
• A1C <8% for older adults, limited life expectancy, or high hypoglycemia risk
• Fasting glucose: 80–130 mg/dL
• 2-hour postprandial glucose: <180 mg/dL

Type 2 Diabetes — Pharmacologic Management:
• Metformin remains the preferred first-line oral agent (if tolerated, eGFR ≥30)
• With established ASCVD, HF, or CKD: Add GLP-1 RA with proven CV benefit (semaglutide, liraglutide) or SGLT-2 inhibitor (empagliflozin, dapagliflozin)
• For weight management: GLP-1 RA preferred
• For HF or CKD: SGLT-2 inhibitors preferred
• When insulin is required: Basal insulin with gradual titration

Cardiovascular Risk Reduction:
• BP target: <130/80 mmHg; ACEI or ARB for CKD with albuminuria
• Statin therapy for all T2DM age 40–75 with cardiovascular risk factors
• Aspirin 75–162 mg/day for secondary prevention; consider for primary prevention in high-risk adults >50 years
• Smoking cessation

Microvascular Complication Screening:
• Retinopathy: Annual dilated eye exam
• Nephropathy: Annual UACR and eGFR
• Neuropathy: Annual comprehensive foot exam`,
        summary: 'ADA evidence-based standards for screening, diagnosis, and comprehensive management of diabetes mellitus.',
        category: 'Endocrinology',
        tags: 'diabetes,ADA,A1C,metformin,insulin,GLP-1,SGLT-2,glycemic control,cardiovascular risk',
        evidenceGrade: 'A',
        author: 'Dr. Lisa Chen, MD, CDE',
        sources: 'https://www.diabetes.org,https://care.diabetesjournals.org,https://pubmed.ncbi.nlm.nih.gov,https://www.nejm.org',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Acute Stroke Recognition and Early Management',
        slug: 'acute-stroke-management',
        content: `Stroke is the fifth leading cause of death and leading cause of disability in the United States. Time-sensitive treatment is essential — "Time is Brain."

Stroke Syndromes:
• Ischemic stroke (87%): Thrombotic or embolic arterial occlusion
• Hemorrhagic stroke (13%): Intracerebral (ICH) or subarachnoid hemorrhage (SAH)
• TIA: Transient neurological deficit without infarction; high early stroke risk

Recognition — BE-FAST:
• Balance: Sudden loss of balance
• Eyes: Sudden vision changes
• Face drooping: Ask patient to smile
• Arm weakness: Raise both arms; note drift
• Speech difficulty: Ask patient to repeat a phrase
• Time: Call 911 immediately

Acute Ischemic Stroke Treatment:
IV tPA (Alteplase) 0.9 mg/kg (max 90 mg):
• Eligible within 3–4.5 hours of symptom onset
• Contraindications: Recent surgery, BP >185/110 mmHg, prior ICH, INR >1.7, platelets <100,000
• BP must be <185/110 mmHg before and <180/105 mmHg during/after thrombolysis

Mechanical Thrombectomy:
• Large vessel occlusion (ICA, M1, M2, basilar)
• Up to 24 hours with favorable imaging profile (DAWN/DEFUSE-3 criteria)
• mTICI 2b/3 recanalization goal

Hemorrhagic Stroke:
• Reverse anticoagulation immediately
• BP target <140 mmHg systolic (minimize hematoma expansion)
• Neurosurgery consult; EVD for obstructive hydrocephalus
• Seizure prophylaxis if lobar ICH

Post-Stroke Prevention:
• Antiplatelet therapy (aspirin ± dipyridamole or clopidogrel) for non-cardioembolic stroke
• Anticoagulation (DOAC preferred) for AF-related stroke
• Statin therapy, BP control, lifestyle modification`,
        summary: 'Evidence-based recognition, emergency management, and secondary prevention of acute ischemic and hemorrhagic stroke.',
        category: 'Neurology',
        tags: 'stroke,tPA,thrombolysis,thrombectomy,BE-FAST,ischemic stroke,hemorrhagic stroke,TIA,AHA',
        evidenceGrade: 'A',
        author: 'Dr. Angela Torres, MD, FAHA',
        sources: 'https://www.heart.org,https://www.stroke.org,https://www.nejm.org,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'ACLS Update: Cardiac Arrest Resuscitation Guidelines',
        slug: 'acls-cardiac-arrest-guidelines',
        content: `The American Heart Association updates ACLS guidelines every 5 years, incorporating the latest evidence from resuscitation science.

Chain of Survival (In-Hospital):
1. Surveillance and prevention
2. Recognition and activation of emergency response
3. High-quality CPR
4. Rapid defibrillation
5. Advanced resuscitation by ALS providers
6. Post-cardiac arrest care
7. Recovery

High-Quality CPR Priorities:
• Rate: 100–120 compressions/minute
• Depth: At least 2 inches (5 cm) in adults; allow full chest recoil
• Minimize interruptions: Pause <10 seconds for rhythm check/shock
• Avoid excessive ventilation: 1 breath every 6 seconds (10 breaths/min) with advanced airway
• Switch compressors every 2 minutes to prevent fatigue

Shockable Rhythms (VF/pVT):
• Defibrillate as soon as possible (200 J biphasic)
• CPR immediately after shock (do not check rhythm)
• Epinephrine 1 mg IV/IO every 3–5 minutes
• Amiodarone 300 mg IV/IO (second dose 150 mg) for refractory VF/pVT
• Consider lidocaine as alternative to amiodarone

Non-Shockable Rhythms (PEA/Asystole):
• Epinephrine 1 mg IV/IO every 3–5 minutes (as soon as IV/IO access obtained)
• Address reversible causes (H's and T's)

Reversible Causes (H's and T's):
Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia
Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary/coronary)

Post-Cardiac Arrest Care:
• Coronary angiography for suspected cardiac etiology
• Targeted Temperature Management (TTM): 32–36°C for 24 hours
• Avoid hypoxia (SpO2 92–98%) and hyperoxia
• Avoid hypotension (MAP ≥65 mmHg)`,
        summary: 'Current AHA ACLS guidelines for high-quality CPR, cardiac arrest rhythms, and post-resuscitation care.',
        category: 'Emergency Medicine',
        tags: 'ACLS,cardiac arrest,CPR,defibrillation,epinephrine,amiodarone,resuscitation,AHA,VF,pVT',
        evidenceGrade: 'A',
        author: 'Dr. Michael Torres, MD, FACEP',
        sources: 'https://www.heart.org,https://cpr.heart.org,https://www.nejm.org,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'COPD Management: GOLD 2024 Guidelines',
        slug: 'copd-gold-guidelines',
        content: `The Global Initiative for Chronic Obstructive Lung Disease (GOLD) provides annually updated evidence-based guidance for COPD prevention, diagnosis, and management.

Definition:
COPD is a common, preventable, and treatable disease characterized by persistent respiratory symptoms and airflow limitation due to airway and/or alveolar abnormalities, usually caused by significant exposure to noxious particles or gases (predominantly tobacco smoke).

Diagnosis:
• Spirometry required for diagnosis: Post-bronchodilator FEV1/FVC <0.70 confirms airflow limitation
• COPD-6 handheld device may assist initial detection
• Symptoms: Dyspnea, chronic cough, sputum production, frequent respiratory infections

GOLD ABCD Grouping (symptom burden + exacerbation history):
• Group A: Low symptoms, 0–1 exacerbations — SABA or SAMA as needed
• Group B: High symptoms, 0–1 exacerbations — LAMA or LABA (or combination)
• Group E: ≥2 exacerbations or ≥1 hospitalization — LAMA + LABA ± ICS

Pharmacologic Priorities:
• LAMA (tiotropium, umeclidinium) — reduces exacerbations and hospitalizations
• LABA (salmeterol, formoterol, indacaterol) — improves symptoms and exercise capacity
• LAMA + LABA combination superior to either alone for most GOLD B/E
• ICS: Reserve for eosinophil count ≥300 cells/μL or frequent exacerbations on dual therapy; avoid in frequent pneumonia risk

Non-Pharmacologic Management:
• Smoking cessation — most important intervention; NRT, varenicline, bupropion
• Pulmonary rehabilitation — strong evidence for dyspnea, exercise capacity, QoL
• Long-term oxygen therapy (LTOT): PaO2 ≤55 mmHg or SpO2 ≤88% at rest
• NIV for chronic hypercapnic respiratory failure
• Vaccinations: Influenza, pneumococcal, COVID-19, pertussis, RSV

Exacerbation Management:
• SABA ± SAMA via nebulizer
• Systemic corticosteroids (prednisone 40 mg x 5 days)
• Antibiotics if purulent sputum + increased dyspnea (azithromycin, doxycycline, amoxicillin-clavulanate)
• Hospital admission criteria: Severe dyspnea, mental status change, hypoxia, hypercapnia`,
        summary: 'GOLD 2024 evidence-based guidelines for COPD diagnosis, grouping, pharmacologic and non-pharmacologic management.',
        category: 'Pulmonology',
        tags: 'COPD,GOLD,spirometry,LAMA,LABA,ICS,pulmonary rehabilitation,exacerbation,smoking cessation',
        evidenceGrade: 'A',
        author: 'Dr. Patricia Nguyen, MD, FCCP',
        sources: 'https://goldcopd.org,https://www.thoracic.org,https://www.nejm.org,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[2].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Asthma Management: GINA 2024 Strategy',
        slug: 'asthma-gina-guidelines',
        content: `The Global Initiative for Asthma (GINA) 2024 Strategy Document represents the current international consensus for asthma management, now recommending against SABA-only treatment for any adult or adolescent with asthma.

Diagnosis:
• Variable respiratory symptoms (wheeze, shortness of breath, chest tightness, cough)
• Variable expiratory airflow limitation confirmed by spirometry
• Positive bronchodilator reversibility (FEV1 increase ≥12% and ≥200 mL)
• Positive bronchial challenge test (methacholine, mannitol, exercise)

Asthma Severity/Control:
• Assess symptom frequency, nighttime awakenings, reliever use, activity limitation
• Well-controlled: Symptoms ≤2 days/week, no limitations, no reliever >2 days/week
• Partly controlled: 1–2 features above
• Uncontrolled: ≥3 features; step up treatment

GINA Preferred Treatment Tracks (Adults):
Step 1: As-needed low-dose ICS-formoterol (preferred over SABA alone)
Step 2: Low-dose ICS-formoterol as needed OR daily low-dose ICS + as-needed SABA
Step 3: Low-dose ICS-formoterol maintenance and reliever (MART)
Step 4: Medium-dose ICS-formoterol MART
Step 5: High-dose ICS + LABA; consider tiotropium, anti-IL5, anti-IL4/13, anti-IgE biologics

Biologic Therapies for Severe Asthma:
• Anti-IgE (omalizumab): Allergic asthma with elevated IgE
• Anti-IL5 (mepolizumab, reslizumab, benralizumab): Eosinophilic asthma
• Anti-IL4/IL13 (dupilumab): Eosinophilic or OCS-dependent severe asthma
• Anti-TSLP (tezepelumab): Severe uncontrolled asthma regardless of phenotype

Exacerbation Management:
• SABA q20 minutes x3, then reassess
• Systemic corticosteroids (prednisone 40–50 mg x 5–7 days)
• Ipratropium bromide in ER setting (moderate-severe)
• Magnesium sulfate 2g IV for severe/life-threatening
• ICU for respiratory failure unresponsive to treatment`,
        summary: 'GINA 2024 recommendations for asthma diagnosis, step-up/step-down therapy, biologics, and exacerbation management.',
        category: 'Pulmonology',
        tags: 'asthma,GINA,ICS,formoterol,MART,biologics,eosinophilic,omalizumab,exacerbation',
        evidenceGrade: 'A',
        author: "Dr. Kevin O'Brien, MD",
        sources: 'https://ginasthma.org,https://www.thoracic.org,https://www.nejm.org,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[2].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'CDC Immunization Schedule for Adults 2024',
        slug: 'adult-immunization-schedule-2024',
        content: `The Advisory Committee on Immunization Practices (ACIP) issues annual recommended immunization schedules, approved by the CDC Director and endorsed by major medical societies.

Vaccines Recommended for All Adults:
• Influenza: 1 dose annually (high-dose or adjuvanted preferred for age ≥65)
• COVID-19: Stay up to date per CDC guidance; 2024-2025 updated vaccine recommended
• Td/Tdap: 1 dose Tdap, then Td or Tdap every 10 years; Tdap each pregnancy (27–36 weeks)
• Pneumococcal: PCV15 + PPSV23 for age ≥65; or PCV20 alone; schedule varies

Age-Based Recommendations:
19–26 years:
• HPV: 2-dose or 3-dose series (catch-up through age 26; shared decision-making 27–45)
• Meningococcal MenACWY: 2 doses (college freshmen in residence halls, asplenic individuals, travelers)
• MenB: 2–3 dose series (shared clinical decision-making 16–23 years)

≥50 years:
• Zoster (RZV, Shingrix): 2 doses (2–6 months apart) — even if prior zoster or Zostavax

≥65 years:
• RSV (RSVPreF, Abrysvo or mResvia): 1 dose, shared decision-making
• Influenza high-dose or MF59-adjuvanted preferred

Medical Condition–Based Vaccines:
• Diabetes, heart/lung/liver disease, HIV, immunocompromised, asplenia: Additional pneumococcal, MenACWY, Hep B
• Hepatitis A & B: All adults not previously vaccinated (especially travelers, chronic liver disease, IVDU)
• Meningococcal: Asplenia, complement deficiency, HIV, travel to endemic areas

Contraindications and Precautions:
• Live vaccines (MMR, LAIV, Varivax, Zoster, yellow fever) contraindicated in pregnancy, severe immunosuppression
• Anaphylaxis to vaccine component: Contraindication
• Moderate-severe illness with/without fever: Precaution (defer vaccination)`,
        summary: 'ACIP/CDC 2024 recommended immunization schedule for adults by age, health condition, and special situation.',
        category: 'Preventive Medicine',
        tags: 'vaccines,immunization,ACIP,CDC,influenza,COVID-19,pneumococcal,shingles,HPV,adult schedule',
        evidenceGrade: 'A',
        author: 'Dr. Sarah Mitchell, MD, MPH',
        sources: 'https://www.cdc.gov/vaccines/schedules/index.html,https://www.acponline.org,https://www.aafp.org,https://www.immunize.org',
        relatedCourses: courses[2].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'USPSTF Cancer Screening Recommendations',
        slug: 'cancer-screening-uspstf',
        content: `The U.S. Preventive Services Task Force (USPSTF) provides evidence-based recommendations on cancer screening, graded A–D based on benefit vs. harm.

Colorectal Cancer (Grade A, start age 45):
Methods:
• High-sensitivity stool tests (FIT or gFOBT) annually, or stool DNA test (FIT-DNA) every 1–3 years
• Flexible sigmoidoscopy every 5 years, or with FIT every 10 years
• CT colonography every 5 years
• Colonoscopy every 10 years (preferred if polyp risk)
Screening continues to age 75 (Grade A); 76–85 individual decision (Grade C)

Breast Cancer (Grade B):
• Begin mammography at age 40 (updated 2024 recommendation)
• Biennial screening mammography through age 74
• USPSTF recommends supplemental screening for dense breasts (Grade B, 2024)
• BRCA risk assessment and genetic counseling for familial risk

Lung Cancer (Grade B):
• Annual low-dose CT scan (LDCT) for adults aged 50–80 with ≥20 pack-year smoking history who currently smoke or quit within the past 15 years
• Discontinue if >15 years since quit, or health issues limiting life expectancy or willingness for curative surgery

Cervical Cancer (Grade A):
• Cytology (Pap test) every 3 years for women 21–29
• Cytology + HPV co-testing every 5 years for women 30–65 (preferred)
• HPV testing alone every 5 years acceptable for 30–65
• Stop screening at 65 with adequate prior negative screening

Prostate Cancer:
• PSA screening: Grade C — individualized decision-making for men 55–69 years
• Discuss benefits and harms; screening not recommended age ≥70

Skin Cancer (Grade I for general population):
• Insufficient evidence for visual skin exam as primary prevention in general population
• Clinical vigilance for high-risk patients (fair skin, significant UV exposure, family history)`,
        summary: 'USPSTF evidence-based cancer screening recommendations for colorectal, breast, lung, cervical, and prostate cancers.',
        category: 'Preventive Medicine',
        tags: 'cancer screening,USPSTF,mammography,colonoscopy,Pap smear,lung CT,PSA,colorectal,breast cancer,cervical cancer',
        evidenceGrade: 'A',
        author: 'Dr. Rachel Kim, MD, MPH',
        sources: 'https://www.uspreventiveservicestaskforce.org,https://www.cdc.gov/cancer,https://www.acs.com,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Opioid Prescribing: CDC Clinical Practice Guideline 2022',
        slug: 'opioid-prescribing-cdc-guideline',
        content: `The CDC's 2022 Clinical Practice Guideline for Prescribing Opioids updates prior guidance to provide evidence-based recommendations for primary care clinicians managing acute, subacute, and chronic pain.

Key Principles:
• Non-opioid therapies are preferred for chronic pain; combine non-pharmacologic and pharmacologic approaches
• Opioids are rarely the first-line choice for non-cancer chronic pain
• Shared decision-making: Discuss benefits, risks, and alternatives before prescribing

Recommendations for Initiating/Continuing Opioids:
1. Non-opioid therapies should be maximized first (NSAIDs, acetaminophen, SNRIs, TCAs, anticonvulsants for neuropathic pain; PT, CBT, acupuncture)
2. When starting opioids, use lowest effective dose; use immediate-release opioids
3. Reassess benefit/risk within 1–4 weeks of initiating; at least every 3 months ongoing
4. Establish treatment goals before prescribing; discontinue if goals not met or harms exceed benefits

Dosing Considerations:
• Avoid dosages ≥50 MME/day without reassessment; ≥90 MME/day associated with significantly elevated overdose risk
• Avoid concurrent benzodiazepine + opioid prescription when possible
• For acute pain: Use smallest effective quantity; 3 days usually sufficient; rarely >7 days

Overdose Prevention:
• Offer naloxone to all patients prescribed opioids, especially at high doses or with co-prescribed CNS depressants
• Offer naloxone for OUD patients; provide after non-fatal overdose
• PDMP (Prescription Drug Monitoring Program) check before every opioid prescription
• Check for substance use disorder; offer MOUD (buprenorphine, methadone, naltrexone) for OUD

Special Populations:
• Avoid opioids in pregnancy (neonatal opioid withdrawal syndrome risk)
• Older adults: Increased fall/fracture risk; start low, go slow
• Cancer/palliative care: Different risk-benefit calculus; aggressive pain management appropriate`,
        summary: 'CDC 2022 evidence-based guidance for safe and effective opioid prescribing for acute and chronic pain management.',
        category: 'Pain Management',
        tags: 'opioids,pain management,CDC guideline,naloxone,MME,opioid use disorder,prescription monitoring,chronic pain',
        evidenceGrade: 'A',
        author: 'Dr. Thomas Reed, MD',
        sources: 'https://www.cdc.gov/drugoverdose/prescribing/guideline.html,https://www.fda.gov,https://pubmed.ncbi.nlm.nih.gov,https://jamanetwork.com',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Hand Hygiene: WHO Guidelines for Healthcare',
        slug: 'hand-hygiene-who-guidelines',
        content: `Hand hygiene is the single most important measure to prevent healthcare-associated infections (HAIs). The WHO "My 5 Moments for Hand Hygiene" framework provides a standardized approach.

WHO 5 Moments for Hand Hygiene:
1. BEFORE touching a patient
2. BEFORE clean/aseptic procedure
3. AFTER body fluid exposure risk
4. AFTER touching a patient
5. AFTER touching patient surroundings

Hand Hygiene Technique:
Alcohol-Based Hand Rub (ABHR) — preferred when hands are not visibly soiled:
• Duration: 20–30 seconds
• Apply to palm, rub hands together covering all surfaces
• Continue until hands are dry
• Preferred for routine clinical care (faster, less skin damage, more effective vs. most pathogens)

Handwashing with Soap and Water — required when:
• Hands are visibly soiled or contaminated with blood/body fluids
• Caring for patients with C. difficile (spore-forming; ABHR less effective)
• Before eating; after using the restroom
• Duration: 40–60 seconds total

Gloves:
• Gloves do NOT replace hand hygiene
• Perform hand hygiene before donning and after removing gloves
• Change gloves between patients and between tasks on the same patient

Healthcare-Associated Infections (HAIs) — Prevented by Hand Hygiene:
• CLABSI (Central Line-Associated Bloodstream Infections)
• CAUTI (Catheter-Associated Urinary Tract Infections)
• VAP (Ventilator-Associated Pneumonia)
• SSI (Surgical Site Infections)
• C. difficile

Hand Care:
• Use hospital-approved moisturizing lotion to prevent skin breakdown
• Avoid artificial nails, extenders, or nail polish in direct patient care
• Keep natural nails short (<¼ inch)
• Report dermatitis or hand lesions to occupational health`,
        summary: 'WHO evidence-based guidance on hand hygiene technique, 5 Moments framework, and prevention of healthcare-associated infections.',
        category: 'Infection Control',
        tags: 'hand hygiene,WHO,5 moments,ABHR,handwashing,HAI prevention,CLABSI,CAUTI,infection control',
        evidenceGrade: 'A',
        author: 'Dr. Elena Vasquez, RN, CIC',
        sources: 'https://www.who.int/gpsc/5may/Hand_Hygiene_Why_How_and_When_Brochure.pdf,https://www.cdc.gov/handhygiene,https://www.ahrq.gov,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[2].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Acute Kidney Injury: KDIGO Clinical Practice Guidelines',
        slug: 'acute-kidney-injury-kdigo',
        content: `The Kidney Disease: Improving Global Outcomes (KDIGO) organization publishes evidence-based guidelines for acute kidney injury (AKI) diagnosis, staging, and management.

AKI Definition (KDIGO):
Increase in serum creatinine ≥0.3 mg/dL within 48 hours, OR
Increase in serum creatinine ≥1.5× baseline within the prior 7 days, OR
Urine volume <0.5 mL/kg/h for ≥6 hours

AKI Staging:
• Stage 1: Cr ≥0.3 mg/dL or 1.5–1.9× baseline; UO <0.5 mL/kg/h for 6–12h
• Stage 2: Cr 2–2.9× baseline; UO <0.5 mL/kg/h for ≥12h
• Stage 3: Cr ≥3× baseline, or ≥4.0 mg/dL, or RRT initiated; UO <0.3 mL/kg/h for ≥24h or anuria ≥12h

Common Causes (Pre-renal, Intrinsic, Post-renal):
Pre-renal (most common): Volume depletion, heart failure, hepatorenal syndrome, NSAID or ACEi/ARB in low-flow state
Intrinsic: ATN (ischemic or nephrotoxic), AIN (drug-induced), glomerulonephritis, vasculitis
Post-renal: Obstruction (BPH, stones, malignancy)

Workup:
• Urine studies: Urinalysis, urine electrolytes, FENa/FEUrea, urine microscopy
• FENa <1% (pre-renal) vs. >2% (ATN); FEUrea <35% more accurate on diuretics
• Renal ultrasound (obstruction, size)
• Serum: BMP, CBC, coagulation, complement, ANCA, anti-GBM if indicated

Management:
• Volume optimization: Replace deficits with isotonic crystalloid; avoid over-resuscitation
• Eliminate nephrotoxins: Hold NSAIDs, aminoglycosides, contrast agents, ACEi/ARB when AKI present
• Hemodynamic optimization: MAP ≥65 mmHg; avoid vasoconstrictors when possible
• Avoid diuretics to treat AKI (use only for volume overload management)
• RRT indications: Severe hyperkalemia, metabolic acidosis, uremic symptoms, volume overload refractory to diuretics, uremic encephalopathy/pericarditis`,
        summary: 'KDIGO guidelines for AKI definition, staging, clinical evaluation, and evidence-based management strategies.',
        category: 'Nephrology',
        tags: 'AKI,acute kidney injury,KDIGO,creatinine,ATN,dialysis,RRT,nephrotoxins,renal failure',
        evidenceGrade: 'B',
        author: 'Dr. Andrew Patel, MD, FASN',
        sources: 'https://kdigo.org,https://www.cjasn.org,https://pubmed.ncbi.nlm.nih.gov,https://www.nejm.org',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Venous Thromboembolism Prevention and Treatment',
        slug: 'vte-prevention-treatment',
        content: `Venous thromboembolism (VTE), encompassing deep vein thrombosis (DVT) and pulmonary embolism (PE), is a common, preventable, and potentially fatal condition in hospitalized patients.

VTE Risk Assessment:
• Caprini Score (surgical patients): Risk factors include age >40, BMI >25, prior VTE, malignancy, hypercoagulable state, prolonged immobility
• Padua Prediction Score (medical patients): High risk ≥4 points

VTE Prophylaxis:
Pharmacologic:
• UFH 5,000 units SC TID or LMWH (enoxaparin 40 mg SC daily or 30 mg SC BID)
• Fondaparinux for HIT history
• DOACs (rivaroxaban, apixaban) approved for orthopedic prophylaxis

Mechanical:
• Graduated compression stockings (GCS) — Grade 2A for VTE risk
• Intermittent pneumatic compression (IPC) — effective; use when anticoagulation contraindicated

DVT Diagnosis and Treatment:
• Diagnosis: Compression ultrasonography (first-line); D-dimer for low pre-test probability
• Wells DVT Score guides testing
• Treatment: Anticoagulation for proximal DVT and symptomatic distal DVT
  - DOACs preferred: Apixaban 10 mg BID x7 days, then 5 mg BID; or rivaroxaban 15 mg BID x21 days, then 20 mg daily
  - LMWH bridge + warfarin (INR 2–3) if DOACs contraindicated
  - Duration: 3 months (provoked); 6+ months (unprovoked or cancer-associated)

Pulmonary Embolism:
• Risk stratification: PESI score, echocardiography, troponin, BNP
• Low-risk: Anticoagulation alone; consider outpatient management (Hestia criteria)
• Submassive (intermediate-high risk): Anticoagulation; consider systemic thrombolysis or catheter-directed therapy
• Massive PE: Systemic thrombolysis (alteplase 100 mg IV over 2h) if no contraindications; surgical embolectomy if thrombolysis fails/contraindicated`,
        summary: 'Evidence-based VTE risk stratification, prophylaxis strategies, and treatment algorithms for DVT and pulmonary embolism.',
        category: 'Hematology',
        tags: 'VTE,DVT,pulmonary embolism,anticoagulation,DOAC,enoxaparin,warfarin,prophylaxis,thrombolysis',
        evidenceGrade: 'A',
        author: 'Dr. Stephanie Walsh, MD',
        sources: 'https://www.chest.net,https://www.hematology.org,https://www.nejm.org,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Mental Health: Screening and Management in Primary Care',
        slug: 'mental-health-primary-care-screening',
        content: `Mental health conditions are prevalent, underdiagnosed, and highly treatable. The USPSTF recommends screening all adults for depression, anxiety, and unhealthy alcohol use in primary care settings.

Depression Screening:
• PHQ-2 (2-item): Initial screen; score ≥3 proceed to PHQ-9
• PHQ-9 (9-item): Severity — 5–9 mild, 10–14 moderate, 15–19 moderately severe, ≥20 severe
• Columbia Suicide Severity Rating Scale (C-SSRS) for suicidality assessment

USPSTF Screening Recommendations (Grade B):
• Major Depressive Disorder: All adults, including pregnant/postpartum
• Anxiety Disorders: Adults <65 (evidence emerging for older adults)
• Alcohol Use: All adults; brief intervention + referral for unhealthy use

Depression Treatment (Stepwise):
Mild-Moderate:
• Psychotherapy: CBT (gold standard), behavioral activation, interpersonal therapy
• Exercise: 150 min/week aerobic activity — comparable to antidepressants for mild/moderate
• SSRIs: Sertraline, escitalopram (best tolerated, fewest interactions)

Moderate-Severe:
• Antidepressants: SSRIs first-line; SNRIs (venlafaxine, duloxetine); mirtazapine for weight loss/insomnia
• Combination of medication + therapy superior to either alone
• Atypical antipsychotics as augmentation (aripiprazole, quetiapine, brexpiprazole) for partial response
• Esketamine (Spravato) nasal spray for treatment-resistant depression; ketamine IV infusion

Anxiety Disorders:
• GAD-7 for generalized anxiety disorder screening (score ≥10 = further evaluation)
• First-line: SSRIs/SNRIs + CBT (exposure therapy for phobias/OCD/PTSD)
• Short-term benzodiazepines: Caution — dependence risk; limited to 2–4 weeks

Crisis Intervention:
• Assess suicide risk at each visit for at-risk patients
• Safety planning: Means restriction, crisis contacts, emergency action plan
• 988 Suicide & Crisis Lifeline (call/text 988) — nationwide U.S. resource`,
        summary: 'USPSTF-endorsed screening tools and evidence-based treatment approaches for depression and anxiety in primary care.',
        category: 'Psychiatry',
        tags: 'mental health,depression,anxiety,PHQ-9,GAD-7,CBT,SSRI,screening,USPSTF,psychiatry,suicide prevention',
        evidenceGrade: 'A',
        author: 'Dr. Karen Lee, MD, FAPA',
        sources: 'https://www.nimh.nih.gov,https://www.uspreventiveservicestaskforce.org,https://pubmed.ncbi.nlm.nih.gov,https://jamanetwork.com',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Pediatric Advanced Life Support (PALS) Core Principles',
        slug: 'pals-pediatric-life-support',
        content: `Pediatric Advanced Life Support (PALS) provides systematic approaches to recognizing and managing life-threatening emergencies in infants and children, developed by the American Heart Association.

Systematic Approach to Pediatric Emergencies:
1. Initial impression (across the room): appearance, breathing, circulation
2. Primary assessment: ABCDE (Airway, Breathing, Circulation, Disability, Exposure)
3. Secondary assessment: focused history (SAMPLE), head-to-toe exam
4. Diagnostic assessments: targeted labs, ECG, imaging

Pediatric Respiratory Emergencies:
• Upper airway obstruction (croup, epiglottitis, foreign body): Listen for stridor; positioning, racemic epinephrine, dexamethasone for croup
• Lower airway obstruction (asthma, bronchiolitis): Look for wheeze; albuterol, ipratropium, corticosteroids
• Lung tissue disease (pneumonia, pulmonary edema): Crackles, decreased breath sounds
• Disordered respiratory control: Central causes, neuromuscular disease

Shock Recognition and Management:
Types: Hypovolemic, distributive (septic, anaphylactic, neurogenic), cardiogenic, obstructive
• Initial treatment: 20 mL/kg IV/IO isotonic fluid bolus (may repeat; reassess after each bolus)
• Septic shock: 20 mL/kg over 5–10 minutes; epinephrine or dopamine for refractory shock
• Cardiogenic shock: Limit fluids; vasoactive agents (milrinone, dobutamine)
• Anaphylaxis: Epinephrine 0.01 mg/kg IM (max 0.5 mg) — first-line

Pediatric Cardiac Arrest:
• VF/pVT: Defibrillate at 2 J/kg; subsequent shocks at 4 J/kg
• Compressions: At least 1/3 AP diameter depth (≈1.5 inches infant, 2 inches child)
• Compression:ventilation ratio: 30:2 without advanced airway; 15:2 with two rescuers
• Epinephrine 0.01 mg/kg (0.1 mL/kg of 1:10,000 concentration) q3–5 minutes
• Amiodarone 5 mg/kg IV/IO for refractory VF/pVT

Weight-Based Drug Dosing Tools:
• Broselow tape (color-coded length-based weight estimation)
• PALS drug calculator available through aha.org`,
        summary: 'AHA PALS principles for recognizing and managing pediatric respiratory emergencies, shock, and cardiac arrest.',
        category: 'Pediatrics',
        tags: 'PALS,pediatric,cardiac arrest,shock,respiratory failure,defibrillation,epinephrine,AHA,Broselow',
        evidenceGrade: 'A',
        author: 'Dr. Carlos Mendez, MD, FAAP',
        sources: 'https://cpr.heart.org,https://www.aap.org,https://www.nejm.org,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Nutrition Support in the Critically Ill Patient',
        slug: 'nutrition-critical-care-aspen',
        content: `The American Society for Parenteral and Enteral Nutrition (ASPEN) and Society of Critical Care Medicine (SCCM) jointly publish evidence-based guidelines for nutrition support in critically ill adults.

Nutrition Risk Screening:
• NRS-2002 or NUTRIC score to identify patients benefiting most from nutrition support
• High NUTRIC score ≥5 (without IL-6) or ≥6 (with IL-6) = high nutrition risk; initiate early EN aggressively

Timing:
• Early enteral nutrition (EN) within 24–48 hours of ICU admission — Grade B recommendation
• Early EN reduces infections, ICU LOS, and may improve survival vs. delayed or parenteral nutrition

Enteral Nutrition (EN) — Preferred Route:
• Target: 25–30 kcal/kg/day; protein 1.2–2.0 g/kg/day (higher in burns, wounds, obesity)
• Continuous vs. intermittent feeding: Evidence mixed; bolus more physiologic when tolerated
• Gastric residual volumes: Do not hold EN based on GRV alone unless ≥500 mL + other intolerance signs
• Head-of-bed elevation to ≥30° during feeding

Immunonutrition:
• Omega-3 fatty acids: Benefit in ARDS (anti-inflammatory); evidence mixed
• Glutamine: NOT recommended for critically ill with MOF/ARDS (may increase mortality — REDOXS trial)
• Selenium: No survival benefit in large RCTs; avoid routine supplementation above DRI

Parenteral Nutrition (PN):
• Indicated when EN is not possible, contraindicated, or insufficient
• Early PN (within 48h) in low-nutrition-risk patients may be harmful; delay to day 7 (CALORIES, EPaNIC trials)
• High-nutrition-risk patients: PN may be started within 3–7 days when EN not feasible
• Monitor glucose closely; target 140–180 mg/dL; avoid over-feeding (hyperglycemia, hypertriglyceridemia)

Monitoring:
• Daily weights, nitrogen balance, prealbumin trend
• Reassess feeding tolerance and adequacy every 24–48h
• Transition to oral feeds when patient able to swallow safely (dysphagia screen)`,
        summary: 'ASPEN/SCCM guidelines for nutrition risk screening, timing of enteral/parenteral nutrition, and monitoring in critically ill patients.',
        category: 'Critical Care',
        tags: 'nutrition,enteral nutrition,TPN,ICU,ASPEN,SCCM,critical care,protein,calories,immunonutrition',
        evidenceGrade: 'B',
        author: 'Dr. Nancy Brooks, RD, CNSC',
        sources: 'https://www.nutritioncare.org,https://www.sccm.org,https://pubmed.ncbi.nlm.nih.gov,https://www.nejm.org',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Medication Safety: High-Alert Drug Guidelines',
        slug: 'medication-safety-high-alert-drugs',
        content: `The Institute for Safe Medication Practices (ISMP) identifies high-alert medications that bear a heightened risk of causing significant patient harm when used in error.

ISMP High-Alert Medications (Top Tier):
• Anticoagulants (heparin, warfarin, DOACs, low molecular weight heparins)
• Insulin (all formulations)
• Opioids (IV, oral, transdermal, epidural, intrathecal)
• Chemotherapy agents
• Hypertonic saline (>0.9% NaCl), hypertonic dextrose (≥20%)
• Neuromuscular blocking agents
• Concentrated electrolytes (IV potassium chloride, phosphates)
• Antithrombotics (antiplatelets, thrombolytics)

Error Prevention Strategies:
Independent Double Check:
• Required for high-alert IV infusions (insulin drips, heparin, chemotherapy)
• Two nurses independently verify drug, dose, rate, patient identity
• Do not prompt the second checker

ISMP Targeted Recommendations:
Insulin:
• NEVER use U (unit) abbreviation — write "units" in full
• Separate long-acting (glargine, detemir) from rapid-acting (lispro, aspart) storage locations
• Concentration standardization: Use single concentration infusions (1 unit/mL)

Anticoagulants:
• Heparin infusion by weight-based protocol with independent double-check
• Anti-Xa monitoring preferred over aPTT for UFH in obese patients
• Warfarin: Daily INR monitoring during initiation; patient education on drug/food interactions

Concentrated Electrolytes:
• Remove concentrated KCl (2 mEq/mL) from floor stock — pharmacy-prepared, diluted solutions only
• Must be administered via infusion pump
• Maximum peripheral infusion rate: 10 mEq/h

Look-Alike/Sound-Alike (LASA) Drugs:
• Tallman lettering: DOBUTamine vs. DOPamine; HydrALAZINE vs. HydrOXYzine; metFORMIN vs. metroNIDAZOLE
• Physically separate LASA medications in storage
• Verify drug name, concentration, and indication at bedside

Technology Safeguards:
• Bar-code medication administration (BCMA) — 5 Rights verification at bedside
• Smart pump drug libraries with hard and soft limits
• Computerized physician order entry (CPOE) with clinical decision support`,
        summary: 'ISMP high-alert medication list with evidence-based error-prevention strategies for safe medication administration.',
        category: 'Pharmacology',
        tags: 'medication safety,ISMP,high-alert drugs,insulin,heparin,anticoagulants,double check,BCMA,smart pump,LASA',
        evidenceGrade: 'A',
        author: 'Dr. Diana Park, PharmD, BCPS',
        sources: 'https://www.ismp.org,https://www.fda.gov/drugs/drug-safety-and-availability,https://www.ihi.org,https://pubmed.ncbi.nlm.nih.gov',
        relatedCourses: courses[2].id,
        isPublished: true
      }
    }),
    prisma.article.create({
      data: {
        title: 'Maternal Health: Postpartum Hemorrhage Prevention',
        slug: 'postpartum-hemorrhage-prevention',
        content: `Postpartum hemorrhage (PPH) is defined as blood loss ≥500 mL after vaginal delivery or ≥1,000 mL after cesarean, and is the leading cause of maternal mortality worldwide.

ACOG Definition & Staging:
• PPH: Cumulative blood loss ≥1,000 mL with signs/symptoms of hypovolemia within 24h
• Quantitative blood loss (QBL) measurement recommended over visual estimation

Causes — "4 T's":
• Tone (80%): Uterine atony — most common cause
• Trauma (10%): Lacerations, uterine rupture, hematoma
• Tissue (10%): Retained placenta, placenta accreta spectrum
• Thrombin (<1%): Coagulopathy (DIC, von Willebrand, HELLP)

Active Management of the Third Stage of Labor (AMTSL):
• Oxytocin 10 IU IM or IV infusion immediately after delivery of the anterior shoulder
• Controlled cord traction
• Uterine massage after placental expulsion
• Ergometrine (where available) + oxytocin most effective

PPH Treatment Algorithm:
Step 1 — Uterotonic Medications:
• Oxytocin 20–40 IU in 1L NS at 500–1000 mL/h
• Methylergonovine 0.2 mg IM (avoid in hypertension)
• Misoprostol 800–1000 mcg sublingual/rectal (if no IV access)
• Carboprost (15-methyl PGF2α) 0.25 mg IM q15–90 min (avoid in asthma)

Step 2 — Resuscitation & Tamponade:
• Massive transfusion protocol: pRBC:FFP:Platelets 1:1:1
• TXA 1g IV within 3 hours of birth (WOMAN trial: reduces PPH death)
• Intrauterine balloon tamponade (Bakri balloon, Foley catheter)

Step 3 — Surgical:
• B-Lynch suture, uterine compression sutures
• Uterine artery ligation, internal iliac ligation
• Interventional radiology: Uterine artery embolization
• Hysterectomy: Definitive if all else fails

Prevention in High-Risk Patients:
• Antenatal: Identify and correct anemia (iron supplementation, IV iron, transfusion)
• Intrapartum: Active management of third stage for ALL deliveries
• Postpartum: Close monitoring x4 hours; vital signs, fundal tone, pad count`,
        summary: 'ACOG evidence-based guidelines for prevention, recognition, and step-wise management of postpartum hemorrhage.',
        category: 'Obstetrics',
        tags: 'postpartum hemorrhage,PPH,ACOG,oxytocin,tranexamic acid,uterine atony,maternal mortality,obstetrics',
        evidenceGrade: 'A',
        author: 'Dr. Amira Hassan, MD, FACOG',
        sources: 'https://www.acog.org,https://www.who.int/reproductivehealth,https://pubmed.ncbi.nlm.nih.gov,https://www.thelancet.com',
        relatedCourses: courses[0].id,
        isPublished: true
      }
    }),
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