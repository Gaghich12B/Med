# Healthcare Professional Networking & Learning Platform

A comprehensive platform for healthcare professionals to connect, learn, and grow their careers.

## 🚀 Live Demo

The platform is currently live at: **https://006ti.app.super.myninja.ai**

## 👥 Demo Accounts

You can sign in with these demo accounts (password: `password123`):

- **Nurse**: nurse@example.com
- **Nurse Practitioner**: np@example.com
- **Physician Assistant**: pa@example.com

Or create your own account!

## ✨ Features

### 1. **Authentication & User Management**
- Secure registration with role selection
- Role-based access control (LPN, RN, NP, PA, MD, DR)
- Session management with NextAuth.js
- Protected routes

### 2. **Professional Dashboard**
- Personalized welcome screen
- Certification expiration alerts
- Active certifications tracking
- Enrolled courses with progress
- Profile completion status
- Upcoming local courses
- Latest medical articles
- Quick action buttons

### 3. **Learning Management System**
- Course catalog with filtering
- Detailed course pages with curriculum
- Module and lesson structure
- CE credits tracking
- Enrollment system
- Progress visualization

### 4. **Certification Tracking**
- List all certifications
- Expiration alerts (within 30 days)
- Active/Expiring/Expired status
- CE credits tracking
- Add new certifications

### 5. **Course Finder**
- Search upcoming in-person courses
- Filter by category, state, and date
- Location details with contact info
- Seat availability tracking
- Registration links

### 6. **Medical Reference Library**
- Browse evidence-based articles
- Search functionality
- Category filtering
- Evidence grade indicators (A-D)
- Source citations with links
- View count tracking
- Related course suggestions

### 7. **Professional Profiles**
- Comprehensive profile management
- Education history
- Work experience
- Skills and expertise
- Awards and recognition
- Contact information
- Social links

### 8. **Networking Features**
- User discovery and search
- Connection requests
- Professional network visualization
- Role and specialty filtering
- Location-based connections

### 9. **Activity Feed**
- Share posts and updates
- Course completion announcements
- Certification achievements
- Comments and likes
- Trending topics
- Suggested connections

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (React 19)
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM + SQLite
- **Authentication**: NextAuth.js
- **State Management**: React Server Components

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd healthcare-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Seed the database
npx tsx prisma/seed.ts

# Start the development server
npm run dev
```

## 🗄️ Database Schema

The platform uses a comprehensive database schema with 20+ models including:

- Users & Authentication
- Profiles (education, experience, skills, awards)
- Certifications & Licenses
- Courses, Modules, Lessons
- Enrollments & Progress
- Course Locations & Scheduled Courses
- Networking (connections, posts, comments, messages)
- Medical Reference Articles

## 📁 Project Structure

```
healthcare-platform/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── courses/           # Course pages
│   │   ├── certifications/    # Certification pages
│   │   ├── course-finder/     # Course finder
│   │   ├── references/        # Medical references
│   │   ├── profile/           # Profile pages
│   │   ├── network/           # Networking pages
│   │   ├── feed/              # Activity feed
│   │   ├── dashboard/         # Dashboard
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       ├── prisma.ts          # Prisma client
│       └── auth.ts            # Auth configuration
└── package.json
```

## 🎯 Target Audience

The platform serves all levels of medical professionals:

- Licensed Practical Nurses (LPN)
- Registered Nurses (RN)
- Nurse Practitioners (NP)
- Physician Assistants (PA)
- Medical Doctors (MD)
- Doctors (DR)
- All other medical titles and specialties

## 🏥 Medical Settings Coverage

The platform supports professionals across all healthcare environments:

- Critical care
- Inpatient care
- Outpatient care
- Emergency medicine
- Primary care
- Specialty care
- All other medical settings and departments

## 🔐 Security Features

- Password hashing with bcrypt
- Secure session management
- Protected API routes
- Role-based access control
- Input validation

## 🚀 Deployment

The platform is deployed and accessible at the live demo URL. For production deployment:

1. Update environment variables
2. Migrate to PostgreSQL
3. Configure production database
4. Set up SSL certificates
5. Deploy to Vercel or similar platform

## 📝 Sample Data

The platform comes pre-populated with:

- 3 demo users with complete profiles
- 3 courses with modules and lessons
- 3 certifications with expiration tracking
- 3 course locations
- 3 scheduled courses
- 3 medical reference articles
- Sample posts and comments

## 🤝 Contributing

This is an MVP demonstration. For production use, consider adding:

- File upload for documents
- Payment processing integration
- Email notifications
- Advanced search and filtering
- AI-powered recommendations
- Mobile app development
- Enterprise features

## 📄 License

This project is for demonstration purposes.

## 📞 Support

For questions or support, please refer to the documentation or contact the development team.

---

**Built with ❤️ for healthcare professionals**