import { prisma } from '@/lib/prisma';
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

  const filteredCourses = courses.filter(course => {
    if (searchParams.category && course.category !== searchParams.category) {
      return false;
    }
    if (searchParams.duration) {
      const [min, max] = searchParams.duration.split('-').map(Number);
      if (course.duration < min || course.duration > max) {
        return false;
      }
    }
    return true;
  });

  const categories = Array.from(new Set(courses.map(c => c.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
          <p className="text-gray-600 mt-2">
            Browse our comprehensive collection of continuing education courses
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.category || ''}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.duration || ''}
            >
              <option value="">All Durations</option>
              <option value="0-5">0-5 hours</option>
              <option value="5-10">5-10 hours</option>
              <option value="10-20">10-20 hours</option>
              <option value="20-100">20+ hours</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const totalLessons = course.modules.reduce(
              (sum, module) => sum + module.lessons.length,
              0
            );

            return (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {course.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary">{course.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>{course.ceCredits} CE credits</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{totalLessons} lessons</span>
                    </div>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full">View Course</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
