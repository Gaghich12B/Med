import { prisma } from '@/lib/prisma';
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

  const filteredCourses = scheduledCourses.filter(course => {
    if (searchParams.q) {
      const query = searchParams.q.toLowerCase();
      const courseTitle = course.courseLocation.course.title.toLowerCase();
      const city = course.courseLocation.city.toLowerCase();
      const state = course.courseLocation.state.toLowerCase();
      if (!courseTitle.includes(query) && !city.includes(query) && !state.includes(query)) {
        return false;
      }
    }
    if (searchParams.category && course.courseLocation.course.category !== searchParams.category) {
      return false;
    }
    if (searchParams.state && course.courseLocation.state !== searchParams.state) {
      return false;
    }
    return true;
  });

  const states = Array.from(new Set(scheduledCourses.map(c => c.courseLocation.state)));
  const categories = Array.from(new Set(scheduledCourses.map(c => c.courseLocation.course.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Local Courses</h1>
          <p className="text-gray-600 mt-2">
            Discover in-person certification courses near you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Course name, city, or state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue={searchParams.q || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                State
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue={searchParams.state || ''}
              >
                <option value="">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Search</Button>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">
                  {course.courseLocation.course.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{course.courseLocation.course.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {course.courseLocation.city}, {course.courseLocation.state}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{course.startDate.toLocaleDateString()}</span>
                </div>
                {course.instructor && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{course.instructor}</span>
                  </div>
                )}
                {course.seatsAvailable !== null && (
                  <Badge
                    variant={course.seatsAvailable > 5 ? 'default' : 'destructive'}
                  >
                    {course.seatsAvailable} seats available
                  </Badge>
                )}
                <div className="pt-3 border-t space-y-2">
                  {course.contactEmail && (
                    <a
                      href={`mailto:${course.contactEmail}`}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{course.contactEmail}</span>
                    </a>
                  )}
                  {course.contactPhone && (
                    <a
                      href={`tel:${course.contactPhone}`}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{course.contactPhone}</span>
                    </a>
                  )}
                  {course.website && (
                    <a
                      href={course.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
