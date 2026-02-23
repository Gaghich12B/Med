import { prisma } from '@/lib/prisma';
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
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  const isEnrolled = course.enrollments.length > 0;
  const enrollment = isEnrolled ? course.enrollments[0] : null;

  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{course.category}</Badge>
            {isEnrolled && (
              <Badge variant="default">Enrolled</Badge>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {course.description}
          </p>
          
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{course.duration} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>{course.ceCredits} CE credits</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{course._count.enrollments} students enrolled</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="curriculum">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="curriculum" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">
                          Module {moduleIndex + 1}: {module.title}
                        </h3>
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <CheckCircle className="h-5 w-5 text-gray-400" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  Lesson {lessonIndex + 1}: {lesson.title}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">What You'll Learn</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>Comprehensive understanding of the subject matter</li>
                          <li>Practical skills applicable to your practice</li>
                          <li>Evidence-based approaches and techniques</li>
                          <li>Best practices and guidelines</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Prerequisites</h3>
                        <p className="text-gray-600">
                          No prerequisites required. This course is suitable for all healthcare professionals.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Certificate</h3>
                        <p className="text-gray-600">
                          Upon completion, you'll receive a certificate of completion and {course.ceCredits} CE credits.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEnrolled && enrollment && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Progress</span>
                      <span className="text-sm font-bold">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {!isEnrolled && (
                  <form action={`/api/courses/${course.id}/enroll`} method="POST">
                    <Button className="w-full" size="lg">
                      Enroll Now
                    </Button>
                  </form>
                )}

                {isEnrolled && (
                  <Button className="w-full" size="lg" variant="outline">
                    Continue Learning
                  </Button>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">This course includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{totalLessons} lessons</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} hours of content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>{course.ceCredits} CE credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
