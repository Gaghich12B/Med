<h1>Healthcare Platform - Complete Code Delivery (Part 2)</h1><h2>📚 Courses Page (src/app/courses/page.tsx)</h2><pre><code class="language-typescript">import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Award } from 'lucide-react';
import Link from 'next/link';

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { category?: string; duration?: string };
}) {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        include: {
          lessons: true
        }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    }
  });

  const filteredCourses = courses.filter(course =&gt; {
    if (searchParams.category &amp;&amp; course.category !== searchParams.category) {
      return false;
    }
    if (searchParams.duration) {
      const [min, max] = searchParams.duration.split('-').map(Number);
      if (course.duration &lt; min || course.duration &gt; max) {
        return false;
      }
    }
    return true;
  });

  const categories = Array.from(new Set(courses.map(c =&gt; c.category)));

  return (
    &lt;div className="min-h-screen bg-gray-50"&gt;
      &lt;div className="container mx-auto px-4 py-8"&gt;
        &lt;div className="mb-8"&gt;
          &lt;h1 className="text-3xl font-bold text-gray-900"&gt;Course Catalog&lt;/h1&gt;
          &lt;p className="text-gray-600 mt-2"&gt;
            Browse our comprehensive collection of continuing education courses
          &lt;/p&gt;
        &lt;/div&gt;

        {/* Filters */}
        &lt;div className="mb-6 flex flex-wrap gap-4"&gt;
          &lt;div&gt;
            &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;
              Category
            &lt;/label&gt;
            &lt;select
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.category || ''}
            &gt;
              &lt;option value=""&gt;All Categories&lt;/option&gt;
              {categories.map(category =&gt; (
                &lt;option key={category} value={category}&gt;
                  {category}
                &lt;/option&gt;
              ))}
            &lt;/select&gt;
          &lt;/div&gt;
          &lt;div&gt;
            &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;
              Duration
            &lt;/label&gt;
            &lt;select
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.duration || ''}
            &gt;
              &lt;option value=""&gt;All Durations&lt;/option&gt;
              &lt;option value="0-5"&gt;0-5 hours&lt;/option&gt;
              &lt;option value="5-10"&gt;5-10 hours&lt;/option&gt;
              &lt;option value="10-20"&gt;10-20 hours&lt;/option&gt;
              &lt;option value="20-100"&gt;20+ hours&lt;/option&gt;
            &lt;/select&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        {/* Course Grid */}
        &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
          {filteredCourses.map(course =&gt; {
            const totalLessons = course.modules.reduce(
              (sum, module) =&gt; sum + module.lessons.length,
              0
            );

            return (
              &lt;Card key={course.id} className="hover:shadow-lg transition-shadow"&gt;
                &lt;CardHeader&gt;
                  &lt;div className="flex items-start justify-between"&gt;
                    &lt;div className="flex-1"&gt;
                      &lt;CardTitle className="text-xl"&gt;{course.title}&lt;/CardTitle&gt;
                      &lt;CardDescription className="mt-2"&gt;
                        {course.description}
                      &lt;/CardDescription&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                  &lt;div className="flex flex-wrap gap-2 mt-3"&gt;
                    &lt;Badge variant="secondary"&gt;{course.category}&lt;/Badge&gt;
                  &lt;/div&gt;
                &lt;/CardHeader&gt;
                &lt;CardContent&gt;
                  &lt;div className="flex items-center gap-4 text-sm text-gray-600 mb-4"&gt;
                    &lt;div className="flex items-center gap-1"&gt;
                      &lt;Clock className="h-4 w-4" /&gt;
                      &lt;span&gt;{course.duration} hours&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="flex items-center gap-1"&gt;
                      &lt;Award className="h-4 w-4" /&gt;
                      &lt;span&gt;{course.ceCredits} CE credits&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="flex items-center gap-1"&gt;
                      &lt;BookOpen className="h-4 w-4" /&gt;
                      &lt;span&gt;{totalLessons} lessons&lt;/span&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                  &lt;Link href={`/courses/${course.id}`}&gt;
                    &lt;Button className="w-full"&gt;View Course&lt;/Button&gt;
                  &lt;/Link&gt;
                &lt;/CardContent&gt;
              &lt;/Card&gt;
            );
          })}
        &lt;/div&gt;

        {filteredCourses.length === 0 &amp;&amp; (
          &lt;div className="text-center py-12"&gt;
            &lt;p className="text-gray-500"&gt;No courses found matching your criteria.&lt;/p&gt;
          &lt;/div&gt;
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>📖 Course Detail Page (src/app/courses/[id]/page.tsx)</h2><pre><code class="language-typescript">import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Award, Users, CheckCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        include: {
          lessons: true
        },
        orderBy: {
          order: 'asc'
        }
      },
      enrollments: {
        where: session?.user?.email ? {
          user: {
            email: session.user.email
          }
        } : undefined
      }
    }
  });

  if (!course) {
    notFound();
  }

  const isEnrolled = course.enrollments.length &gt; 0;
  const enrollment = isEnrolled ? course.enrollments[0] : null;

  const totalLessons = course.modules.reduce(
    (sum, module) =&gt; sum + module.lessons.length,
    0
  );

  return (
    &lt;div className="min-h-screen bg-gray-50"&gt;
      &lt;div className="container mx-auto px-4 py-8"&gt;
        {/* Course Header */}
        &lt;div className="mb-8"&gt;
          &lt;div className="flex items-center gap-2 mb-2"&gt;
            &lt;Badge variant="secondary"&gt;{course.category}&lt;/Badge&gt;
            {isEnrolled &amp;&amp; (
              &lt;Badge variant="default"&gt;Enrolled&lt;/Badge&gt;
            )}
          &lt;/div&gt;
          &lt;h1 className="text-4xl font-bold text-gray-900 mb-4"&gt;
            {course.title}
          &lt;/h1&gt;
          &lt;p className="text-xl text-gray-600 mb-6"&gt;
            {course.description}
          &lt;/p&gt;
          
          &lt;div className="flex flex-wrap gap-6 text-gray-600"&gt;
            &lt;div className="flex items-center gap-2"&gt;
              &lt;Clock className="h-5 w-5" /&gt;
              &lt;span&gt;{course.duration} hours&lt;/span&gt;
            &lt;/div&gt;
            &lt;div className="flex items-center gap-2"&gt;
              &lt;Award className="h-5 w-5" /&gt;
              &lt;span&gt;{course.ceCredits} CE credits&lt;/span&gt;
            &lt;/div&gt;
            &lt;div className="flex items-center gap-2"&gt;
              &lt;BookOpen className="h-5 w-5" /&gt;
              &lt;span&gt;{totalLessons} lessons&lt;/span&gt;
            &lt;/div&gt;
            &lt;div className="flex items-center gap-2"&gt;
              &lt;Users className="h-5 w-5" /&gt;
              &lt;span&gt;{course._count.enrollments} students enrolled&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;div className="grid grid-cols-1 lg:grid-cols-3 gap-6"&gt;
          {/* Main Content */}
          &lt;div className="lg:col-span-2"&gt;
            &lt;Tabs defaultValue="curriculum"&gt;
              &lt;TabsList&gt;
                &lt;TabsTrigger value="curriculum"&gt;Curriculum&lt;/TabsTrigger&gt;
                &lt;TabsTrigger value="overview"&gt;Overview&lt;/TabsTrigger&gt;
              &lt;/TabsList&gt;
              
              &lt;TabsContent value="curriculum" className="mt-6"&gt;
                &lt;Card&gt;
                  &lt;CardHeader&gt;
                    &lt;CardTitle&gt;Course Curriculum&lt;/CardTitle&gt;
                  &lt;/CardHeader&gt;
                  &lt;CardContent&gt;
                    {course.modules.map((module, moduleIndex) =&gt; (
                      &lt;div key={module.id} className="mb-6"&gt;
                        &lt;h3 className="text-lg font-semibold mb-3"&gt;
                          Module {moduleIndex + 1}: {module.title}
                        &lt;/h3&gt;
                        &lt;div className="space-y-2"&gt;
                          {module.lessons.map((lesson, lessonIndex) =&gt; (
                            &lt;div
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            &gt;
                              &lt;CheckCircle className="h-5 w-5 text-gray-400" /&gt;
                              &lt;div className="flex-1"&gt;
                                &lt;p className="font-medium text-gray-900"&gt;
                                  Lesson {lessonIndex + 1}: {lesson.title}
                                &lt;/p&gt;
                              &lt;/div&gt;
                            &lt;/div&gt;
                          ))}
                        &lt;/div&gt;
                      &lt;/div&gt;
                    ))}
                  &lt;/CardContent&gt;
                &lt;/Card&gt;
              &lt;/TabsContent&gt;

              &lt;TabsContent value="overview" className="mt-6"&gt;
                &lt;Card&gt;
                  &lt;CardHeader&gt;
                    &lt;CardTitle&gt;Course Overview&lt;/CardTitle&gt;
                  &lt;/CardHeader&gt;
                  &lt;CardContent&gt;
                    &lt;div className="space-y-4"&gt;
                      &lt;div&gt;
                        &lt;h3 className="font-semibold mb-2"&gt;What You'll Learn&lt;/h3&gt;
                        &lt;ul className="list-disc list-inside space-y-1 text-gray-600"&gt;
                          &lt;li&gt;Comprehensive understanding of the subject matter&lt;/li&gt;
                          &lt;li&gt;Practical skills applicable to your practice&lt;/li&gt;
                          &lt;li&gt;Evidence-based approaches and techniques&lt;/li&gt;
                          &lt;li&gt;Best practices and guidelines&lt;/li&gt;
                        &lt;/ul&gt;
                      &lt;/div&gt;
                      &lt;div&gt;
                        &lt;h3 className="font-semibold mb-2"&gt;Prerequisites&lt;/h3&gt;
                        &lt;p className="text-gray-600"&gt;
                          No prerequisites required. This course is suitable for all healthcare professionals.
                        &lt;/p&gt;
                      &lt;/div&gt;
                      &lt;div&gt;
                        &lt;h3 className="font-semibold mb-2"&gt;Certificate&lt;/h3&gt;
                        &lt;p className="text-gray-600"&gt;
                          Upon completion, you'll receive a certificate of completion and {course.ceCredits} CE credits.
                        &lt;/p&gt;
                      &lt;/div&gt;
                    &lt;/div&gt;
                  &lt;/CardContent&gt;
                &lt;/Card&gt;
              &lt;/TabsContent&gt;
            &lt;/Tabs&gt;
          &lt;/div&gt;

          {/* Sidebar */}
          &lt;div&gt;
            &lt;Card className="sticky top-4"&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle&gt;Course Details&lt;/CardTitle&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent className="space-y-4"&gt;
                {isEnrolled &amp;&amp; enrollment &amp;&amp; (
                  &lt;div&gt;
                    &lt;div className="flex items-center justify-between mb-2"&gt;
                      &lt;span className="text-sm font-medium"&gt;Your Progress&lt;/span&gt;
                      &lt;span className="text-sm font-bold"&gt;{enrollment.progress}%&lt;/span&gt;
                    &lt;/div&gt;
                    &lt;div className="w-full bg-gray-200 rounded-full h-2"&gt;
                      &lt;div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      /&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                )}
                
                {!isEnrolled &amp;&amp; (
                  &lt;form action={`/api/courses/${course.id}/enroll`} method="POST"&gt;
                    &lt;Button className="w-full" size="lg"&gt;
                      Enroll Now
                    &lt;/Button&gt;
                  &lt;/form&gt;
                )}

                {isEnrolled &amp;&amp; (
                  &lt;Button className="w-full" size="lg" variant="outline"&gt;
                    Continue Learning
                  &lt;/Button&gt;
                )}

                &lt;div className="pt-4 border-t"&gt;
                  &lt;h4 className="font-semibold mb-2"&gt;This course includes:&lt;/h4&gt;
                  &lt;ul className="space-y-2 text-sm text-gray-600"&gt;
                    &lt;li className="flex items-center gap-2"&gt;
                      &lt;BookOpen className="h-4 w-4" /&gt;
                      &lt;span&gt;{totalLessons} lessons&lt;/span&gt;
                    &lt;/li&gt;
                    &lt;li className="flex items-center gap-2"&gt;
                      &lt;Clock className="h-4 w-4" /&gt;
                      &lt;span&gt;{course.duration} hours of content&lt;/span&gt;
                    &lt;/li&gt;
                    &lt;li className="flex items-center gap-2"&gt;
                      &lt;Award className="h-4 w-4" /&gt;
                      &lt;span&gt;{course.ceCredits} CE credits&lt;/span&gt;
                    &lt;/li&gt;
                    &lt;li className="flex items-center gap-2"&gt;
                      &lt;CheckCircle className="h-4 w-4" /&gt;
                      &lt;span&gt;Certificate of completion&lt;/span&gt;
                    &lt;/li&gt;
                  &lt;/ul&gt;
                &lt;/div&gt;
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>📜 Certifications Page (src/app/certifications/page.tsx)</h2><pre><code class="language-typescript">import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Award } from 'lucide-react';

export default async function CertificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      certifications: {
        orderBy: {
          expirationDate: 'asc'
        }
      }
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringSoon = user.certifications.filter(
    cert =&gt; cert.expirationDate &lt;= thirtyDaysFromNow &amp;&amp; cert.expirationDate &gt; new Date()
  );

  const active = user.certifications.filter(
    cert =&gt; cert.expirationDate &gt; new Date()
  );

  const expired = user.certifications.filter(
    cert =&gt; cert.expirationDate &lt;= new Date()
  );

  return (
    &lt;div className="min-h-screen bg-gray-50"&gt;
      &lt;div className="container mx-auto px-4 py-8"&gt;
        &lt;div className="mb-8"&gt;
          &lt;h1 className="text-3xl font-bold text-gray-900"&gt;My Certifications&lt;/h1&gt;
          &lt;p className="text-gray-600 mt-2"&gt;
            Track and manage your professional certifications
          &lt;/p&gt;
        &lt;/div&gt;

        {/* Expiration Alert */}
        {expiringSoon.length &gt; 0 &amp;&amp; (
          &lt;div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4"&gt;
            &lt;div className="flex items-start gap-3"&gt;
              &lt;AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" /&gt;
              &lt;div&gt;
                &lt;h3 className="font-semibold text-amber-900"&gt;
                  Action Required
                &lt;/h3&gt;
                &lt;p className="text-amber-800 text-sm mt-1"&gt;
                  You have {expiringSoon.length} certification(s) expiring within 30 days.
                &lt;/p&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        )}

        {/* Stats */}
        &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"&gt;
          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Active
              &lt;/CardTitle&gt;
              &lt;Award className="h-4 w-4 text-green-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;{active.length}&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;

          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Expiring Soon
              &lt;/CardTitle&gt;
              &lt;AlertCircle className="h-4 w-4 text-amber-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;{expiringSoon.length}&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;

          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Expired
              &lt;/CardTitle&gt;
              &lt;Award className="h-4 w-4 text-red-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;{expired.length}&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;
        &lt;/div&gt;

        {/* Certifications List */}
        &lt;div className="space-y-4"&gt;
          {user.certifications.map(certification =&gt; {
            const isExpiringSoon = certification.expirationDate &lt;= thirtyDaysFromNow &amp;&amp; certification.expirationDate &gt; new Date();
            const isExpired = certification.expirationDate &lt;= new Date();

            return (
              &lt;Card key={certification.id}&gt;
                &lt;CardHeader&gt;
                  &lt;div className="flex items-start justify-between"&gt;
                    &lt;div className="flex-1"&gt;
                      &lt;CardTitle className="text-xl"&gt;{certification.name}&lt;/CardTitle&gt;
                      &lt;p className="text-gray-600 mt-1"&gt;{certification.issuer}&lt;/p&gt;
                      {certification.credentialNumber &amp;&amp; (
                        &lt;p className="text-sm text-gray-500"&gt;
                          Credential: {certification.credentialNumber}
                        &lt;/p&gt;
                      )}
                    &lt;/div&gt;
                    &lt;Badge
                      variant={
                        isExpired ? 'destructive' :
                        isExpiringSoon ? 'secondary' : 'default'
                      }
                    &gt;
                      {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                    &lt;/Badge&gt;
                  &lt;/div&gt;
                &lt;/CardHeader&gt;
                &lt;CardContent&gt;
                  &lt;div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"&gt;
                    &lt;div&gt;
                      &lt;p className="text-gray-500"&gt;Issue Date&lt;/p&gt;
                      &lt;p className="font-medium"&gt;{certification.issueDate.toLocaleDateString()}&lt;/p&gt;
                    &lt;/div&gt;
                    &lt;div&gt;
                      &lt;p className="text-gray-500"&gt;Expiration Date&lt;/p&gt;
                      &lt;p className="font-medium"&gt;{certification.expirationDate.toLocaleDateString()}&lt;/p&gt;
                    &lt;/div&gt;
                    &lt;div&gt;
                      &lt;p className="text-gray-500"&gt;CE Credits&lt;/p&gt;
                      &lt;p className="font-medium"&gt;{certification.ceCredits || 'N/A'}&lt;/p&gt;
                    &lt;/div&gt;
                    &lt;div&gt;
                      &lt;p className="text-gray-500"&gt;Days Until Expiration&lt;/p&gt;
                      &lt;p className="font-medium"&gt;
                        {Math.ceil((certification.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                      &lt;/p&gt;
                    &lt;/div&gt;
                  &lt;/div&gt;
                &lt;/CardContent&gt;
              &lt;/Card&gt;
            );
          })}
        &lt;/div&gt;

        {user.certifications.length === 0 &amp;&amp; (
          &lt;Card&gt;
            &lt;CardContent className="text-center py-12"&gt;
              &lt;Award className="h-12 w-12 text-gray-400 mx-auto mb-4" /&gt;
              &lt;p className="text-gray-500"&gt;No certifications added yet.&lt;/p&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>🗺️ Course Finder Page (src/app/course-finder/page.tsx)</h2><pre><code class="language-typescript">import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User, Phone, Mail, Globe } from 'lucide-react';

export default async function CourseFinderPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; state?: string; date?: string };
}) {
  const scheduledCourses = await prisma.scheduledCourse.findMany({
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
    }
  });

  const filteredCourses = scheduledCourses.filter(course =&gt; {
    if (searchParams.q) {
      const query = searchParams.q.toLowerCase();
      const courseTitle = course.courseLocation.course.title.toLowerCase();
      const city = course.courseLocation.city.toLowerCase();
      const state = course.courseLocation.state.toLowerCase();
      if (!courseTitle.includes(query) &amp;&amp; !city.includes(query) &amp;&amp; !state.includes(query)) {
        return false;
      }
    }
    if (searchParams.category &amp;&amp; course.courseLocation.course.category !== searchParams.category) {
      return false;
    }
    if (searchParams.state &amp;&amp; course.courseLocation.state !== searchParams.state) {
      return false;
    }
    return true;
  });

  const states = Array.from(new Set(scheduledCourses.map(c =&gt; c.courseLocation.state)));
  const categories = Array.from(new Set(scheduledCourses.map(c =&gt; c.courseLocation.course.category)));

  return (
    &lt;div className="min-h-screen bg-gray-50"&gt;
      &lt;div className="container mx-auto px-4 py-8"&gt;
        &lt;div className="mb-8"&gt;
          &lt;h1 className="text-3xl font-bold text-gray-900"&gt;Find Local Courses&lt;/h1&gt;
          &lt;p className="text-gray-600 mt-2"&gt;
            Discover in-person certification courses near you
          &lt;/p&gt;
        &lt;/div&gt;

        {/* Search and Filters */}
        &lt;div className="mb-6 bg-white p-6 rounded-lg shadow-sm"&gt;
          &lt;div className="grid grid-cols-1 md:grid-cols-4 gap-4"&gt;
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;
                Search
              &lt;/label&gt;
              &lt;input
                type="text"
                placeholder="Course name, city, or state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue={searchParams.q || ''}
              /&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;
                Category
              &lt;/label&gt;
              &lt;select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue={searchParams.category || ''}
              &gt;
                &lt;option value=""&gt;All Categories&lt;/option&gt;
                {categories.map(category =&gt; (
                  &lt;option key={category} value={category}&gt;
                    {category}
                  &lt;/option&gt;
                ))}
              &lt;/select&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;
                State
              &lt;/label&gt;
              &lt;select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue={searchParams.state || ''}
              &gt;
                &lt;option value=""&gt;All States&lt;/option&gt;
                {states.map(state =&gt; (
                  &lt;option key={state} value={state}&gt;
                    {state}
                  &lt;/option&gt;
                ))}
              &lt;/select&gt;
            &lt;/div&gt;
            &lt;div className="flex items-end"&gt;
              &lt;Button className="w-full"&gt;Search&lt;/Button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        {/* Course List */}
        &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
          {filteredCourses.map(course =&gt; (
            &lt;Card key={course.id} className="hover:shadow-lg transition-shadow"&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle className="text-xl"&gt;
                  {course.courseLocation.course.title}
                &lt;/CardTitle&gt;
                &lt;div className="flex flex-wrap gap-2 mt-2"&gt;
                  &lt;Badge variant="secondary"&gt;{course.courseLocation.course.category}&lt;/Badge&gt;
                &lt;/div&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent className="space-y-3"&gt;
                &lt;div className="flex items-center gap-2 text-sm text-gray-600"&gt;
                  &lt;MapPin className="h-4 w-4" /&gt;
                  &lt;span&gt;
                    {course.courseLocation.city}, {course.courseLocation.state}
                  &lt;/span&gt;
                &lt;/div&gt;
                &lt;div className="flex items-center gap-2 text-sm text-gray-600"&gt;
                  &lt;Calendar className="h-4 w-4" /&gt;
                  &lt;span&gt;{course.startDate.toLocaleDateString()}&lt;/span&gt;
                &lt;/div&gt;
                {course.instructor &amp;&amp; (
                  &lt;div className="flex items-center gap-2 text-sm text-gray-600"&gt;
                    &lt;User className="h-4 w-4" /&gt;
                    &lt;span&gt;{course.instructor}&lt;/span&gt;
                  &lt;/div&gt;
                )}
                {course.seatsAvailable !== null &amp;&amp; (
                  &lt;Badge
                    variant={course.seatsAvailable &gt; 5 ? 'default' : 'destructive'}
                  &gt;
                    {course.seatsAvailable} seats available
                  &lt;/Badge&gt;
                )}
                &lt;div className="pt-3 border-t space-y-2"&gt;
                  {course.contactEmail &amp;&amp; (
                    &lt;a
                      href={`mailto:${course.contactEmail}`}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    &gt;
                      &lt;Mail className="h-4 w-4" /&gt;
                      &lt;span&gt;{course.contactEmail}&lt;/span&gt;
                    &lt;/a&gt;
                  )}
                  {course.contactPhone &amp;&amp; (
                    &lt;a
                      href={`tel:${course.contactPhone}`}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    &gt;
                      &lt;Phone className="h-4 w-4" /&gt;
                      &lt;span&gt;{course.contactPhone}&lt;/span&gt;
                    &lt;/a&gt;
                  )}
                  {course.website &amp;&amp; (
                    &lt;a
                      href={course.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    &gt;
                      &lt;Globe className="h-4 w-4" /&gt;
                      &lt;span&gt;Visit Website&lt;/span&gt;
                    &lt;/a&gt;
                  )}
                &lt;/div&gt;
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          ))}
        &lt;/div&gt;

        {filteredCourses.length === 0 &amp;&amp; (
          &lt;div className="text-center py-12"&gt;
            &lt;p className="text-gray-500"&gt;No courses found matching your criteria.&lt;/p&gt;
          &lt;/div&gt;
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>📚 Continue to Part 3...</h2>