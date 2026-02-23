import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, GraduationCap, Users, BookOpen, MapPin, Award } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Healthcare Pro Network</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Connect, Learn, and Grow
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The all-in-one platform for healthcare professionals. Network with peers, track certifications, find courses, and access medical references.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Create Free Account
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need in One Platform
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Professional Networking</CardTitle>
              <CardDescription>
                Connect with nurses, NPs, PAs, and physicians. Share knowledge and grow your professional network.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Continuing Education</CardTitle>
              <CardDescription>
                Access hundreds of CE courses, track your progress, and earn credits to maintain your certifications.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Certification Tracking</CardTitle>
              <CardDescription>
                Never miss a renewal deadline. Track all your certifications with smart reminders and alerts.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MapPin className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Course Finder</CardTitle>
              <CardDescription>
                Find in-person certification courses near you. Search by location, specialty, and date.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Medical Reference Library</CardTitle>
              <CardDescription>
                Access evidence-based medical articles and references with citations and source links.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Stethoscope className="h-12 w-12 text-teal-600 mb-4" />
              <CardTitle>Professional Profiles</CardTitle>
              <CardDescription>
                Showcase your experience, education, skills, and achievements to potential employers and colleagues.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of healthcare professionals already using our platform.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Stethoscope className="h-6 w-6" />
            <span className="text-lg font-bold">Healthcare Pro Network</span>
          </div>
          <p className="text-gray-400">
            © 2024 Healthcare Pro Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}