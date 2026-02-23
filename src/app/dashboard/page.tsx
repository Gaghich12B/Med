import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  GraduationCap, 
  Award, 
  MapPin, 
  BookOpen, 
  Calendar,
  AlertCircle,
  TrendingUp
} from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = (session.user as any).id

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      certifications: {
        where: {
          status: "ACTIVE"
        },
        orderBy: {
          expirationDate: "asc"
        },
        take: 5
      },
      enrollments: {
        include: {
          course: true
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: 3
      }
    }
  })

  if (!user) {
    redirect("/auth/signin")
  }

  // Get expiring certifications (within 30 days)
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  
  const expiringCertifications = user.certifications.filter(
    cert => cert.expirationDate && new Date(cert.expirationDate) <= thirtyDaysFromNow
  )

  // Get recent scheduled courses
  const scheduledCourses = await prisma.scheduledCourse.findMany({
    where: {
      startDate: {
        gte: new Date()
      }
    },
    orderBy: {
      startDate: "asc"
    },
    take: 3,
    include: {
      courseLocation: true
    }
  })

  // Get recent articles
  const recentArticles = await prisma.article.findMany({
    where: {
      isPublished: true
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 3
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Healthcare Pro Network</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user.name || user.email}
            </span>
            <Badge variant="outline">{user.role.replace("_", " ")}</Badge>
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" type="submit">Sign Out</Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your professional development.
          </p>
        </div>

        {/* Alerts Section */}
        {expiringCertifications.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                Certification Renewal Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                The following certifications are expiring soon:
              </p>
              <ul className="space-y-2">
                {expiringCertifications.map((cert) => (
                  <li key={cert.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cert.name}</span>
                    <Badge variant="destructive">
                      Expires: {cert.expirationDate?.toLocaleDateString()}
                    </Badge>
                  </li>
                ))}
              </ul>
              <Link href="/certifications">
                <Button className="mt-4" size="sm">
                  View All Certifications
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.certifications.length}</div>
              <p className="text-xs text-gray-600 mt-1">
                {expiringCertifications.length} expiring soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.enrollments.length}</div>
              <p className="text-xs text-gray-600 mt-1">
                {user.enrollments.filter(e => e.completed).length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.profile?.bio ? "75%" : "50%"}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Complete your profile
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Courses</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledCourses.length}</div>
              <p className="text-xs text-gray-600 mt-1">
                In your area
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Courses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                  <Link href="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-semibold">{enrollment.course.title}</h3>
                        <p className="text-sm text-gray-600">{enrollment.course.category}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(enrollment.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Link href={`/courses/${enrollment.courseId}`}>
                        <Button variant="outline" size="sm" className="ml-4">
                          Continue
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/profile" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/certifications" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </Link>
              <Link href="/courses" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
              </Link>
              <Link href="/course-finder" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Local Courses
                </Button>
              </Link>
              <Link href="/network" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Network
                </Button>
              </Link>
              <Link href="/references" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Medical References
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Local Courses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Courses Near You</CardTitle>
              <CardDescription>
                In-person certification courses in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledCourses.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No upcoming courses found.</p>
              ) : (
                <div className="space-y-4">
                  {scheduledCourses.map((course) => (
                    <div key={course.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.category}</p>
                        <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {course.startDate.toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {course.courseLocation.city}, {course.courseLocation.state}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">${course.price}</Badge>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/course-finder">
                <Button className="mt-4" variant="outline">
                  View All Courses
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Articles</CardTitle>
              <CardDescription>
                Evidence-based medical references
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentArticles.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No articles available.</p>
              ) : (
                <div className="space-y-4">
                  {recentArticles.map((article) => (
                    <Link key={article.id} href={`/references/${article.slug}`} className="block">
                      <div className="p-3 border rounded-lg hover:bg-gray-50">
                        <h3 className="font-semibold text-sm">{article.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{article.category}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          Grade {article.evidenceGrade}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link href="/references">
                <Button className="mt-4" variant="outline" size="sm">
                  View All Articles
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}