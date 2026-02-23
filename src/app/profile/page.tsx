import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Star,
  Edit,
  Building2,
  Link as LinkIcon
} from "lucide-react"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          education: {
            orderBy: { endDate: { sort: 'desc' } }
          },
          experience: {
            orderBy: { startDate: 'desc' }
          },
          skills: {
            orderBy: { name: 'asc' }
          },
          awards: {
            orderBy: { date: 'desc' }
          }
        }
      },
      certifications: {
        where: { status: 'ACTIVE' },
        orderBy: { issueDate: 'desc' },
        take: 5
      }
    }
  })

  if (!user || !user.profile) {
    redirect("/dashboard")
  }

  const profile = user.profile

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <User className="h-8 w-8 text-blue-600" />
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
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="text-2xl">
                  {user.name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.name || 'Your Name'}
                    </h1>
                    <p className="text-lg text-gray-600">
                      {profile.title || 'Medical Professional'}
                    </p>
                  </div>
                  <Button className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {user.role.replace('_', ' ')}
                  </Badge>
                  {profile.specialty && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {profile.specialty}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-gray-700">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  {profile.licenseNumber && (
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">License Number</p>
                        <p className="font-medium">{profile.licenseNumber}</p>
                      </div>
                    </div>
                  )}
                  {profile.licenseState && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">License State</p>
                        <p className="font-medium">{profile.licenseState}</p>
                      </div>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-3">
                      <LinkIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <a 
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                  {profile.linkedin && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">LinkedIn</p>
                        <a 
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {profile.awards.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Awards & Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.awards.map((award) => (
                      <div key={award.id} className="border-l-4 border-blue-600 pl-4">
                        <h3 className="font-semibold">{award.title}</h3>
                        <p className="text-sm text-gray-600">{award.issuer}</p>
                        <p className="text-sm text-gray-600">
                          {award.date.toLocaleDateString()}
                        </p>
                        {award.description && (
                          <p className="text-sm text-gray-700 mt-2">{award.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.experience.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No experience added yet</p>
                ) : (
                  <div className="space-y-6">
                    {profile.experience.map((exp) => (
                      <div key={exp.id} className="relative pl-8 border-l-2 border-gray-200">
                        <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-blue-600" />
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{exp.title}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          {exp.current && (
                            <Badge variant="default">Current</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          {exp.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Calendar className="h-4 w-4" />
                          {exp.startDate.toLocaleDateString()} - {exp.endDate ? exp.endDate.toLocaleDateString() : 'Present'}
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.education.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No education added yet</p>
                ) : (
                  <div className="space-y-6">
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <GraduationCap className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.school}</p>
                          {edu.field && (
                            <p className="text-sm text-gray-600">{edu.field}</p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <Calendar className="h-4 w-4" />
                            {edu.startDate.toLocaleDateString()} - {edu.endDate ? edu.endDate.toLocaleDateString() : 'Present'}
                          </div>
                          {edu.description && (
                            <p className="text-gray-700 mt-2">{edu.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.skills.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No skills added yet</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((skill) => (
                      <Badge 
                        key={skill.id} 
                        variant="outline"
                        className="text-sm px-4 py-2"
                      >
                        {skill.name}
                        <span className="ml-2 text-xs text-gray-600">
                          ({skill.level})
                        </span>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                {user.certifications.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No certifications added yet</p>
                ) : (
                  <div className="space-y-4">
                    {user.certifications.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{cert.name}</h3>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                          </div>
                          <Badge variant="default" className="bg-green-600">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Issued: {cert.issueDate.toLocaleDateString()}
                          </span>
                          {cert.expirationDate && (
                            <span className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              Expires: {cert.expirationDate.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {cert.ceCredits > 0 && (
                          <div className="mt-2 text-sm text-green-600">
                            {cert.ceCredits} CE Credits
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/certifications">
                  <Button className="mt-4" variant="outline">
                    View All Certifications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}