import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Award, BookOpen, Filter } from "lucide-react"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = (session.user as any).id

  // Get all published courses
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true
    },
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
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Get user's enrollments
  const userEnrollments = await prisma.enrollment.findMany({
    where: {
      userId
    },
    select: {
      courseId: true
    }
  })

  const enrolledCourseIds = new Set(userEnrollments.map(e => e.courseId))

  // Calculate total lessons for each course
  const coursesWithDetails = courses.map(course => {
    const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0)
    return {
      ...course,
      totalLessons
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Healthcare Pro Network</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" type="submit">Sign Out</Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Catalog
          </h1>
          <p className="text-gray-600">
            Browse our collection of continuing education courses
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter by Category
          </Button>
          <Button variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            Sort by Duration
          </Button>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesWithDetails.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course.id)
            
            return (
              <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
                {course.imageUrl && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                  </div>
                  {course.ceCredits > 0 && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Award className="h-4 w-4" />
                      <span>{course.ceCredits} CE Credits</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {course._count.enrollments} enrolled
                  </span>
                  {isEnrolled ? (
                    <Link href={`/courses/${course.id}`}>
                      <Button>Continue Learning</Button>
                    </Link>
                  ) : (
                    <Link href={`/courses/${course.id}`}>
                      <Button variant="outline">View Course</Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {coursesWithDetails.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600">Check back soon for new courses!</p>
          </div>
        )}
      </div>
    </div>
  )
}