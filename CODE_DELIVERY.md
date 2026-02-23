<h1>Healthcare Platform - Complete Code Delivery</h1><h2>📦 Package.json</h2><pre><code class="language-json">{
  "name": "healthcare-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.1",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.462.0",
    "next": "16.1.6",
    "next-auth": "^4.24.10",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-leaflet": "^4.2.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/leaflet": "^1.9.14",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "postcss": "^8",
    "prisma": "^5.22.0",
    "tailwindcss": "^3.4.1",
    "tsx": "^4.19.2",
    "typescript": "^5"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
</code></pre><h2>🗄️ Prisma Schema (prisma/schema.prisma)</h2><pre><code class="language-prisma">generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  role          Role      @default(NURSE)
  specialty     String?
  location      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  profile       Profile?
  certifications Certification[]
  enrollments   Enrollment[]
  connections   Connection[] @relation("UserConnections")
  connectedTo   Connection[] @relation("ConnectedUsers")
  posts         Post[]
  comments      Comment[]
  messages      Message[]
}

enum Role {
  NURSE
  NURSE_PRACTITIONER
  PHYSICIAN_ASSISTANT
  PHYSICIAN
  ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}

model Profile {
  id          String   @id @default(cuid())
  userId      String   @unique
  title       String?
  bio         String?
  phone       String?
  linkedin    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  education       Education[]
  experience      Experience[]
  skills          Skill[]
  awards          Award[]
}

model Education {
  id          String   @id @default(cuid())
  profileId   String
  school      String
  degree      String
  field       String?
  startDate   DateTime?
  endDate     DateTime?
  
  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

model Experience {
  id          String   @id @default(cuid())
  profileId   String
  title       String
  company     String
  location    String?
  startDate   DateTime
  endDate     DateTime?
  current     Boolean  @default(false)
  
  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

model Skill {
  id        String   @id @default(cuid())
  profileId String
  name      String
  level     String?
  
  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

model Award {
  id        String   @id @default(cuid())
  profileId String
  title     String
  issuer    String?
  date      DateTime?
  description String?
  
  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
}

model Certification {
  id              String   @id @default(cuid())
  userId          String
  name            String
  issuer          String
  credentialNumber String?
  issueDate       DateTime
  expirationDate  DateTime
  ceCredits       Float?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Course {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String
  duration    Int
  ceCredits   Float
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  modules     Module[]
  enrollments Enrollment[]
  reviews     Review[]
  locations   CourseLocation[]
}

model Module {
  id          String   @id @default(cuid())
  courseId    String
  title       String
  order       Int
  
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons     Lesson[]
}

model Lesson {
  id          String   @id @default(cuid())
  moduleId    String
  title       String
  content     String
  videoUrl    String?
  order       Int
  
  module      Module          @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  progress    LessonProgress[]
}

model Enrollment {
  id          String   @id @default(cuid())
  userId      String
  courseId    String
  progress    Float    @default(0)
  enrolledAt  DateTime @default(now())
  completedAt DateTime?
  
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  course  Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  @@unique([userId, courseId])
}

model LessonProgress {
  id          String   @id @default(cuid())
  enrollmentId String
  lessonId    String
  completed   Boolean  @default(false)
  completedAt DateTime?
  
  enrollment Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  lesson     Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  @@unique([enrollmentId, lessonId])
}

model Review {
  id          String   @id @default(cuid())
  courseId    String
  userId      String
  rating      Int
  comment     String?
  createdAt   DateTime @default(now())
  
  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
}

model CourseLocation {
  id          String   @id @default(cuid())
  courseId    String
  name        String
  address     String
  city        String
  state       String
  zipCode     String?
  latitude    Float?
  longitude   Float?
  
  course      Course          @relation(fields: [courseId], references: [id], onDelete: Cascade)
  scheduledCourses ScheduledCourse[]
}

model ScheduledCourse {
  id              String   @id @default(cuid())
  courseLocationId String
  startDate       DateTime
  endDate         DateTime
  instructor      String?
  contactEmail    String?
  contactPhone    String?
  website         String?
  seatsAvailable  Int?
  seatsTotal      Int?
  
  courseLocation CourseLocation @relation(fields: [courseLocationId], references: [id], onDelete: Cascade)
}

model Connection {
  id          String   @id @default(cuid())
  userId      String
  connectedId String
  status      ConnectionStatus @default(PENDING)
  createdAt   DateTime @default(now())
  
  user        User @relation("UserConnections", fields: [userId], references: [id], onDelete: Cascade)
  connectedUser User @relation("ConnectedUsers", fields: [connectedId], references: [id], onDelete: Cascade)
  
  @@unique([userId, connectedId])
}

enum ConnectionStatus {
  PENDING
  ACCEPTED
  REJECTED
}

model Post {
  id          String   @id @default(cuid())
  userId      String
  content     String
  postType    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  comments Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  content   String
  createdAt DateTime @default(now())
  
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
}

model Message {
  id        String   @id @default(cuid())
  senderId  String
  receiverId String
  content   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  sender   User @relation(fields: [senderId], references: [id], onDelete: Cascade)
}

model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String
  category    String
  evidenceGrade String
  source      String?
  sourceUrl   String?
  views       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
</code></pre><h2>🔐 Auth Configuration (src/lib/auth.ts)</h2><pre><code class="language-typescript">import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
</code></pre><h2>🗄️ Prisma Client (src/lib/prisma.ts)</h2><pre><code class="language-typescript">import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
</code></pre><h2>🏠 Main Layout (src/app/layout.tsx)</h2><pre><code class="language-typescript">import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Healthcare Pro Network - Connect, Learn, Grow',
  description: 'Professional networking and continuing education platform for healthcare professionals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    &lt;html lang="en"&gt;
      &lt;body className={inter.className}&gt;
        &lt;Providers&gt;{children}&lt;/Providers&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}
</code></pre><h2>🏠 Landing Page (src/app/page.tsx)</h2><pre><code class="language-typescript">import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Award, MapPin, BookOpen, Stethoscope } from 'lucide-react';

export default function HomePage() {
  return (
    &lt;div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"&gt;
      &lt;nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50"&gt;
        &lt;div className="container mx-auto px-4 py-4 flex items-center justify-between"&gt;
          &lt;div className="flex items-center space-x-2"&gt;
            &lt;Stethoscope className="h-8 w-8 text-blue-600" /&gt;
            &lt;span className="text-xl font-bold text-gray-900"&gt;Healthcare Pro Network&lt;/span&gt;
          &lt;/div&gt;
          &lt;div className="flex items-center space-x-4"&gt;
            &lt;Link href="/auth/signin"&gt;
              &lt;Button variant="ghost"&gt;Sign In&lt;/Button&gt;
            &lt;/Link&gt;
            &lt;Link href="/auth/signup"&gt;
              &lt;Button&gt;Get Started&lt;/Button&gt;
            &lt;/Link&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/nav&gt;

      &lt;section className="container mx-auto px-4 py-20 text-center"&gt;
        &lt;h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"&gt;
          Connect, Learn, and Grow
        &lt;/h1&gt;
        &lt;p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"&gt;
          The all-in-one platform for healthcare professionals. Network with peers, 
          track certifications, find courses, and access medical references.
        &lt;/p&gt;
        &lt;div className="flex flex-col sm:flex-row gap-4 justify-center"&gt;
          &lt;Link href="/auth/signup"&gt;
            &lt;Button size="lg" className="text-lg px-8 py-6"&gt;
              Create Free Account
            &lt;/Button&gt;
          &lt;/Link&gt;
          &lt;Link href="/auth/signin"&gt;
            &lt;Button size="lg" variant="outline" className="text-lg px-8 py-6"&gt;
              Sign In
            &lt;/Button&gt;
          &lt;/Link&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      &lt;section className="container mx-auto px-4 py-20"&gt;
        &lt;h2 className="text-3xl font-bold text-center text-gray-900 mb-12"&gt;
          Everything You Need in One Platform
        &lt;/h2&gt;
        &lt;div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
          &lt;Card className="hover:shadow-lg transition-shadow"&gt;
            &lt;CardHeader&gt;
              &lt;Users className="h-12 w-12 text-blue-600 mb-4" /&gt;
              &lt;CardTitle&gt;Professional Networking&lt;/CardTitle&gt;
              &lt;CardDescription&gt;
                Connect with nurses, NPs, PAs, and physicians. Share knowledge and grow your professional network.
              &lt;/CardDescription&gt;
            &lt;/CardHeader&gt;
          &lt;/Card&gt;

          &lt;Card className="hover:shadow-lg transition-shadow"&gt;
            &lt;CardHeader&gt;
              &lt;GraduationCap className="h-12 w-12 text-green-600 mb-4" /&gt;
              &lt;CardTitle&gt;Continuing Education&lt;/CardTitle&gt;
              &lt;CardDescription&gt;
                Access hundreds of CE courses, track your progress, and earn credits to maintain your certifications.
              &lt;/CardDescription&gt;
            &lt;/CardHeader&gt;
          &lt;/Card&gt;

          &lt;Card className="hover:shadow-lg transition-shadow"&gt;
            &lt;CardHeader&gt;
              &lt;Award className="h-12 w-12 text-purple-600 mb-4" /&gt;
              &lt;CardTitle&gt;Certification Tracking&lt;/CardTitle&gt;
              &lt;CardDescription&gt;
                Never miss a renewal deadline. Track all your certifications with smart reminders and alerts.
              &lt;/CardDescription&gt;
            &lt;/CardHeader&gt;
          &lt;/Card&gt;

          &lt;Card className="hover:shadow-lg transition-shadow"&gt;
            &lt;CardHeader&gt;
              &lt;MapPin className="h-12 w-12 text-red-600 mb-4" /&gt;
              &lt;CardTitle&gt;Course Finder&lt;/CardTitle&gt;
              &lt;CardDescription&gt;
                Find in-person certification courses near you. Search by location, specialty, and date.
              &lt;/CardDescription&gt;
            &lt;/CardHeader&gt;
          &lt;/Card&gt;

          &lt;Card className="hover:shadow-lg transition-shadow"&gt;
            &lt;CardHeader&gt;
              &lt;BookOpen className="h-12 w-12 text-orange-600 mb-4" /&gt;
              &lt;CardTitle&gt;Medical Reference Library&lt;/CardTitle&gt;
              &lt;CardDescription&gt;
                Access evidence-based medical articles and references with citations and source links.
              &lt;/CardDescription&gt;
            &lt;/CardHeader&gt;
          &lt;/Card&gt;

          &lt;Card className="hover:shadow-lg transition-shadow"&gt;
            &lt;CardHeader&gt;
              &lt;Stethoscope className="h-12 w-12 text-teal-600 mb-4" /&gt;
              &lt;CardTitle&gt;Professional Profiles&lt;/CardTitle&gt;
              &lt;CardDescription&gt;
                Showcase your experience, education, skills, and achievements to potential employers and colleagues.
              &lt;/CardDescription&gt;
            &lt;/CardHeader&gt;
          &lt;/Card&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      &lt;section className="bg-blue-600 text-white py-20"&gt;
        &lt;div className="container mx-auto px-4 text-center"&gt;
          &lt;h2 className="text-3xl font-bold mb-4"&gt;Ready to Join the Community?&lt;/h2&gt;
          &lt;p className="text-xl mb-8 opacity-90"&gt;
            Join thousands of healthcare professionals already using our platform.
          &lt;/p&gt;
          &lt;Link href="/auth/signup"&gt;
            &lt;Button size="lg" variant="secondary" className="text-lg px-8 py-6"&gt;
              Get Started Free
            &lt;/Button&gt;
          &lt;/Link&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      &lt;footer className="bg-gray-900 text-white py-12"&gt;
        &lt;div className="container mx-auto px-4 text-center"&gt;
          &lt;div className="flex items-center justify-center space-x-2 mb-4"&gt;
            &lt;Stethoscope className="h-6 w-6" /&gt;
            &lt;span className="text-lg font-bold"&gt;Healthcare Pro Network&lt;/span&gt;
          &lt;/div&gt;
          &lt;p className="text-gray-400"&gt;© 2024 Healthcare Pro Network. All rights reserved.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/footer&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>📊 Dashboard (src/app/dashboard/page.tsx)</h2><pre><code class="language-typescript">import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, BookOpen, Award, MapPin, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      certifications: true,
      enrollments: {
        include: {
          course: true
        },
        orderBy: {
          enrolledAt: 'desc'
        },
        take: 5
      },
      profile: true
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Check for expiring certifications
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const expiringCertifications = user.certifications.filter(
    cert =&gt; cert.expirationDate &lt;= thirtyDaysFromNow &amp;&amp; cert.expirationDate &gt; new Date()
  );

  const activeCertifications = user.certifications.filter(
    cert =&gt; cert.expirationDate &gt; new Date()
  );

  const expiredCertifications = user.certifications.filter(
    cert =&gt; cert.expirationDate &lt;= new Date()
  );

  // Get upcoming courses
  const upcomingCourses = await prisma.scheduledCourse.findMany({
    include: {
      courseLocation: {
        include: {
          course: true
        }
      }
    },
    where: {
      startDate: {
        gte: new Date()
      }
    },
    orderBy: {
      startDate: 'asc'
    },
    take: 3
  });

  // Get latest articles
  const latestArticles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 3
  });

  return (
    &lt;div className="min-h-screen bg-gray-50"&gt;
      &lt;div className="container mx-auto px-4 py-8"&gt;
        &lt;div className="mb-8"&gt;
          &lt;h1 className="text-3xl font-bold text-gray-900"&gt;
            Welcome back, {user.name || 'Healthcare Professional'}!
          &lt;/h1&gt;
          &lt;p className="text-gray-600 mt-2"&gt;
            Here's what's happening with your professional development
          &lt;/p&gt;
        &lt;/div&gt;

        {/* Expiration Alerts */}
        {expiringCertifications.length &gt; 0 &amp;&amp; (
          &lt;div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4"&gt;
            &lt;div className="flex items-start gap-3"&gt;
              &lt;AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" /&gt;
              &lt;div&gt;
                &lt;h3 className="font-semibold text-amber-900"&gt;
                  Certification Expiration Alert
                &lt;/h3&gt;
                &lt;p className="text-amber-800 text-sm mt-1"&gt;
                  You have {expiringCertifications.length} certification(s) expiring within 30 days.
                &lt;/p&gt;
                &lt;div className="mt-2 space-y-1"&gt;
                  {expiringCertifications.map(cert =&gt; (
                    &lt;div key={cert.id} className="text-sm text-amber-700"&gt;
                      • {cert.name} - expires {cert.expirationDate.toLocaleDateString()}
                    &lt;/div&gt;
                  ))}
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        )}

        {/* Stats Cards */}
        &lt;div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"&gt;
          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Active Certifications
              &lt;/CardTitle&gt;
              &lt;Award className="h-4 w-4 text-blue-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;{activeCertifications.length}&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;

          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Enrolled Courses
              &lt;/CardTitle&gt;
              &lt;BookOpen className="h-4 w-4 text-green-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;{user.enrollments.length}&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;

          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Profile Completion
              &lt;/CardTitle&gt;
              &lt;TrendingUp className="h-4 w-4 text-purple-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;75%&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;

          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Upcoming Courses
              &lt;/CardTitle&gt;
              &lt;MapPin className="h-4 w-4 text-red-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;{upcomingCourses.length}&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;
        &lt;/div&gt;

        &lt;div className="grid grid-cols-1 lg:grid-cols-3 gap-6"&gt;
          {/* Recent Courses */}
          &lt;div className="lg:col-span-2"&gt;
            &lt;Card&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle&gt;Recent Courses&lt;/CardTitle&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent&gt;
                {user.enrollments.length === 0 ? (
                  &lt;p className="text-gray-500 text-center py-8"&gt;
                    You haven't enrolled in any courses yet.
                  &lt;/p&gt;
                ) : (
                  &lt;div className="space-y-4"&gt;
                    {user.enrollments.map(enrollment =&gt; (
                      &lt;div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      &gt;
                        &lt;div className="flex-1"&gt;
                          &lt;h4 className="font-semibold text-gray-900"&gt;
                            {enrollment.course.title}
                          &lt;/h4&gt;
                          &lt;p className="text-sm text-gray-600"&gt;
                            {enrollment.course.category} • {enrollment.course.duration} hours
                          &lt;/p&gt;
                          &lt;div className="mt-2"&gt;
                            &lt;div className="flex items-center gap-2"&gt;
                              &lt;div className="flex-1 bg-gray-200 rounded-full h-2"&gt;
                                &lt;div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${enrollment.progress}%` }}
                                /&gt;
                              &lt;/div&gt;
                              &lt;span className="text-sm font-medium text-gray-700"&gt;
                                {enrollment.progress}%
                              &lt;/span&gt;
                            &lt;/div&gt;
                          &lt;/div&gt;
                        &lt;/div&gt;
                        &lt;Link href={`/courses/${enrollment.course.id}`}&gt;
                          &lt;Button variant="outline" size="sm"&gt;
                            Continue
                          &lt;/Button&gt;
                        &lt;/Link&gt;
                      &lt;/div&gt;
                    ))}
                  &lt;/div&gt;
                )}
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          &lt;/div&gt;

          {/* Quick Actions */}
          &lt;div&gt;
            &lt;Card&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle&gt;Quick Actions&lt;/CardTitle&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent className="space-y-3"&gt;
                &lt;Link href="/courses" className="block"&gt;
                  &lt;Button variant="outline" className="w-full justify-start"&gt;
                    &lt;BookOpen className="h-4 w-4 mr-2" /&gt;
                    Browse Courses
                  &lt;/Button&gt;
                &lt;/Link&gt;
                &lt;Link href="/certifications" className="block"&gt;
                  &lt;Button variant="outline" className="w-full justify-start"&gt;
                    &lt;Award className="h-4 w-4 mr-2" /&gt;
                    View Certifications
                  &lt;/Button&gt;
                &lt;/Link&gt;
                &lt;Link href="/course-finder" className="block"&gt;
                  &lt;Button variant="outline" className="w-full justify-start"&gt;
                    &lt;MapPin className="h-4 w-4 mr-2" /&gt;
                    Find Local Courses
                  &lt;/Button&gt;
                &lt;/Link&gt;
                &lt;Link href="/references" className="block"&gt;
                  &lt;Button variant="outline" className="w-full justify-start"&gt;
                    &lt;FileText className="h-4 w-4 mr-2" /&gt;
                    Medical References
                  &lt;/Button&gt;
                &lt;/Link&gt;
                &lt;Link href="/profile" className="block"&gt;
                  &lt;Button variant="outline" className="w-full justify-start"&gt;
                    &lt;TrendingUp className="h-4 w-4 mr-2" /&gt;
                    Update Profile
                  &lt;/Button&gt;
                &lt;/Link&gt;
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        {/* Upcoming Local Courses */}
        &lt;div className="mt-6"&gt;
          &lt;Card&gt;
            &lt;CardHeader&gt;
              &lt;CardTitle&gt;Upcoming Local Courses&lt;/CardTitle&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              {upcomingCourses.length === 0 ? (
                &lt;p className="text-gray-500 text-center py-8"&gt;
                  No upcoming courses scheduled in your area.
                &lt;/p&gt;
              ) : (
                &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-4"&gt;
                  {upcomingCourses.map(course =&gt; (
                    &lt;div
                      key={course.id}
                      className="p-4 bg-gray-50 rounded-lg"
                    &gt;
                      &lt;h4 className="font-semibold text-gray-900"&gt;
                        {course.courseLocation.course.title}
                      &lt;/h4&gt;
                      &lt;p className="text-sm text-gray-600 mt-1"&gt;
                        {course.courseLocation.city}, {course.courseLocation.state}
                      &lt;/p&gt;
                      &lt;p className="text-sm text-gray-600"&gt;
                        {course.startDate.toLocaleDateString()}
                      &lt;/p&gt;
                      {course.seatsAvailable !== null &amp;&amp; (
                        &lt;Badge
                          variant={course.seatsAvailable &gt; 5 ? 'default' : 'destructive'}
                          className="mt-2"
                        &gt;
                          {course.seatsAvailable} seats available
                        &lt;/Badge&gt;
                      )}
                    &lt;/div&gt;
                  ))}
                &lt;/div&gt;
              )}
            &lt;/CardContent&gt;
          &lt;/Card&gt;
        &lt;/div&gt;

        {/* Latest Articles */}
        &lt;div className="mt-6"&gt;
          &lt;Card&gt;
            &lt;CardHeader&gt;
              &lt;CardTitle&gt;Latest Medical References&lt;/CardTitle&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              {latestArticles.length === 0 ? (
                &lt;p className="text-gray-500 text-center py-8"&gt;
                  No articles available yet.
                &lt;/p&gt;
              ) : (
                &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-4"&gt;
                  {latestArticles.map(article =&gt; (
                    &lt;Link
                      key={article.id}
                      href={`/references/${article.slug}`}
                      className="block"
                    &gt;
                      &lt;div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"&gt;
                        &lt;h4 className="font-semibold text-gray-900"&gt;
                          {article.title}
                        &lt;/h4&gt;
                        &lt;p className="text-sm text-gray-600 mt-1"&gt;
                          {article.category}
                        &lt;/p&gt;
                        &lt;Badge
                          variant={
                            article.evidenceGrade === 'A' ? 'default' :
                            article.evidenceGrade === 'B' ? 'secondary' :
                            article.evidenceGrade === 'C' ? 'outline' : 'destructive'
                          }
                          className="mt-2"
                        &gt;
                          Evidence Grade: {article.evidenceGrade}
                        &lt;/Badge&gt;
                      &lt;/div&gt;
                    &lt;/Link&gt;
                  ))}
                &lt;/div&gt;
              )}
            &lt;/CardContent&gt;
          &lt;/Card&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>📚 Continue to Part 2...</h2>