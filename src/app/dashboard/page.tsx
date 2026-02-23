import { getServerSession } from 'next-auth';
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
    cert => cert.expirationDate <= thirtyDaysFromNow && cert.expirationDate > new Date()
  );

  const activeCertifications = user.certifications.filter(
    cert => cert.expirationDate > new Date()
  );

  const expiredCertifications = user.certifications.filter(
    cert => cert.expirationDate <= new Date()
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name || 'Healthcare Professional'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your professional development
          </p>
        </div>

        {/* Expiration Alerts */}
        {expiringCertifications.length > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">
                  Certification Expiration Alert
                </h3>
                <p className="text-amber-800 text-sm mt-1">
                  You have {expiringCertifications.length} certification(s) expiring within 30 days.
                </p>
                <div className="mt-2 space-y-1">
                  {expiringCertifications.map(cert => (
                    <div key={cert.id} className="text-sm text-amber-700">
                      • {cert.name} - expires {cert.expirationDate.toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Certifications
              </CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCertifications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Enrolled Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.enrollments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Profile Completion
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Upcoming Courses
              </CardTitle>
              <MapPin className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingCourses.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {user.enrollments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    You haven't enrolled in any courses yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {user.enrollments.map(enrollment => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {enrollment.course.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {enrollment.course.category} • {enrollment.course.duration} hours
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {enrollment.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/courses/${enrollment.course.id}`}>
                          <Button variant="outline" size="sm">
                            Continue
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/courses" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/certifications" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    View Certifications
                  </Button>
                </Link>
                <Link href="/course-finder" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Local Courses
                  </Button>
                </Link>
                <Link href="/references" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Medical References
                  </Button>
                </Link>
                <Link href="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Local Courses */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Local Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingCourses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No upcoming courses scheduled in your area.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingCourses.map(course => (
                    <div
                      key={course.id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {course.courseLocation.course.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.courseLocation.city}, {course.courseLocation.state}
                      </p>
                      <p className="text-sm text-gray-600">
                        {course.startDate.toLocaleDateString()}
                      </p>
                      {course.seatsAvailable !== null && (
                        <Badge
                          variant={course.seatsAvailable > 5 ? 'default' : 'destructive'}
                          className="mt-2"
                        >
                          {course.seatsAvailable} seats available
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Latest Articles */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Latest Medical References</CardTitle>
            </CardHeader>
            <CardContent>
              {latestArticles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No articles available yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {latestArticles.map(article => (
                    <Link
                      key={article.id}
                      href={`/references/${article.slug}`}
                      className="block"
                    >
                      <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <h4 className="font-semibold text-gray-900">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {article.category}
                        </p>
                        <Badge
                          variant={
                            article.evidenceGrade === 'A' ? 'default' :
                            article.evidenceGrade === 'B' ? 'secondary' :
                            article.evidenceGrade === 'C' ? 'outline' : 'destructive'
                          }
                          className="mt-2"
                        >
                          Evidence Grade: {article.evidenceGrade}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
