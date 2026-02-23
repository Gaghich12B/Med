import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, BookOpen, Award, User, ArrowLeft, PlayCircle } from "lucide-react"

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = (session.user as any).id

  const course = await prisma.course.findUnique({
    where: {
      id: params.id
    },
    include: {
      modules: {
        include: {
          lessons: true
        },
        orderBy: {
          order: "asc"
        }
      },
      enrollments: {
        where: {
          userId
        }
      }
    }
  })

  if (!course) {
    redirect("/courses")
  }

  const enrollment = course.enrollments[0]
  const isEnrolled = !!enrollment

  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0)

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
            <Link href="/courses">
              <Button variant="ghost">Back to Courses</Button>
            </Link>
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" type="submit">Sign Out</Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/courses">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </Link>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 max-w-3xl">
                {course.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m total</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{course.modules.length} modules • {totalLessons} lessons</span>
            </div>
            {course.ceCredits > 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <Award className="h-4 w-4" />
                <span>{course.ceCredits} CE Credits</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="curriculum" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="mt-6">
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Module {moduleIndex + 1}: {module.title}
                        </CardTitle>
                        {module.description && (
                          <CardDescription>{module.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <PlayCircle className="h-5 w-5 text-blue-600" />
                                <div>
                                  <p className="font-medium text-sm">
                                    {lessonIndex + 1}. {lesson.title}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {lesson.duration} minutes
                                  </p>
                                </div>
                              </div>
                              {isEnrolled ? (
                                <Button size="sm" variant="outline">
                                  {enrollment?.progress > 0 ? "Continue" : "Start"}
                                </Button>
                              ) : (
                                <Badge variant="outline">Locked</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">What you'll learn</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Comprehensive understanding of {course.category} principles</li>
                        <li>Practical skills and techniques for clinical application</li>
                        <li>Evidence-based practices and latest guidelines</li>
                        <li>Best practices for patient care and safety</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Prerequisites</h3>
                      <p className="text-gray-600">
                        {course.level === "BEGINNER" && "No prior experience required"}
                        {course.level === "INTERMEDIATE" && "Basic knowledge of healthcare practices recommended"}
                        {course.level === "ADVANCED" && "Advanced clinical experience required"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Certificate</h3>
                      <p className="text-gray-600">
                        Upon completion, you'll receive a certificate of completion and {course.ceCredits} CE credits.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardHeader>
                <CardTitle>Course Enrollment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEnrolled ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Your Progress</span>
                        <span className="font-semibold">{Math.round(enrollment?.progress || 0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment?.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <Button className="w-full" size="lg">
                      Continue Learning
                    </Button>
                    {enrollment?.completed && (
                      <div className="text-center">
                        <Badge variant="default" className="mb-2">Completed!</Badge>
                        <p className="text-sm text-gray-600">
                          Certificate available
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </p>
                      <p className="text-sm text-gray-600">One-time payment</p>
                    </div>
                    <form action={`/api/courses/${course.id}/enroll`} method="POST">
                      <Button type="submit" className="w-full" size="lg">
                        Enroll Now
                      </Button>
                    </form>
                    <p className="text-xs text-center text-gray-600">
                      Full lifetime access
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Course Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Modules</span>
                  <span className="font-semibold">{course.modules.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lessons</span>
                  <span className="font-semibold">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-semibold">{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CE Credits</span>
                  <span className="font-semibold">{course.ceCredits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Level</span>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}