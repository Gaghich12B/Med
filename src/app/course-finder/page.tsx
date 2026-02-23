import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  Search,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react"

export default async function CourseFinderPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Get all scheduled courses
  const scheduledCourses = await prisma.scheduledCourse.findMany({
    where: {
      startDate: {
        gte: new Date()
      }
    },
    include: {
      courseLocation: true
    },
    orderBy: {
      startDate: "asc"
    }
  })

  // Get unique categories and states for filters
  const categories = [...new Set(scheduledCourses.map(c => c.category))]
  const states = [...new Set(scheduledCourses.map(c => c.courseLocation.state))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
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
            Find In-Person Courses
          </h1>
          <p className="text-gray-600">
            Discover certification courses happening near you
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Course name..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <select
                  id="state"
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                />
              </div>
            </div>
            <Button className="mt-4">Search Courses</Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {scheduledCourses.length} upcoming courses
          </p>
        </div>

        {/* Course List */}
        <div className="grid md:grid-cols-2 gap-6">
          {scheduledCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">${course.price}</Badge>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                {course.description && (
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">{course.courseLocation.name}</p>
                      <p className="text-sm text-gray-600">{course.courseLocation.address}</p>
                      <p className="text-sm text-gray-600">
                        {course.courseLocation.city}, {course.courseLocation.state} {course.courseLocation.zipCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600">
                    {course.startDate.toLocaleDateString()} - {course.endDate.toLocaleDateString()}
                  </span>
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">
                      Instructor: {course.instructor}
                    </span>
                  </div>
                )}

                {/* Seats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">
                      {course.seatsAvailable} of {course.seatsTotal} seats available
                    </span>
                  </div>
                  <Badge 
                    variant={course.seatsAvailable < 5 ? "destructive" : "default"}
                  >
                    {course.seatsAvailable < 5 ? "Almost Full" : "Available"}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t space-y-2">
                  {course.contactEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <a 
                        href={`mailto:${course.contactEmail}`}
                        className="text-blue-600 hover:underline"
                      >
                        {course.contactEmail}
                      </a>
                    </div>
                  )}
                  {course.contactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <a 
                        href={`tel:${course.contactPhone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {course.contactPhone}
                      </a>
                    </div>
                  )}
                  {course.courseLocation.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-gray-600" />
                      <a 
                        href={course.courseLocation.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button className="w-full" size="lg">
                  Register Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {scheduledCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">
                Try adjusting your search filters or check back later for new courses.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}