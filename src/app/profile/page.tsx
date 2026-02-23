import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, MapPin, Calendar, Award, Briefcase, GraduationCap, Star } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: {
        include: {
          education: {
            orderBy: { startDate: 'desc' }
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
        where: {
          expirationDate: {
            gt: new Date()
          }
        },
        orderBy: {
          expirationDate: 'asc'
        },
        take: 5
      }
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const profile = user.profile;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{user.name || 'Healthcare Professional'}</h1>
                <p className="text-gray-600 mt-1">
                  {profile?.title || ''} • {user.role.replace('_', ' ')}
                </p>
                {user.specialty && (
                  <Badge variant="secondary" className="mt-2">
                    {user.specialty}
                  </Badge>
                )}
                {user.location && (
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            {profile && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="about">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.bio ? (
                  <p className="text-gray-700">{profile.bio}</p>
                ) : (
                  <p className="text-gray-500">No bio information provided.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.experience.length === 0 ? (
                  <p className="text-gray-500">No experience information provided.</p>
                ) : (
                  <div className="space-y-6">
                    {profile.experience.map(exp => (
                      <div key={exp.id} className="border-l-2 border-blue-600 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                            {exp.location && (
                              <p className="text-sm text-gray-500">{exp.location}</p>
                            )}
                          </div>
                          {exp.current && (
                            <Badge variant="default">Current</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {exp.startDate.toLocaleDateString()} - {exp.endDate ? exp.endDate.toLocaleDateString() : 'Present'}
                          </span>
                        </div>
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
                {profile?.education.length === 0 ? (
                  <p className="text-gray-500">No education information provided.</p>
                ) : (
                  <div className="space-y-4">
                    {profile.education.map(edu => (
                      <div key={edu.id} className="flex items-start gap-4">
                        <GraduationCap className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.school}</p>
                          {edu.field && (
                            <p className="text-sm text-gray-500">{edu.field}</p>
                          )}
                          {edu.startDate && (
                            <p className="text-sm text-gray-500">
                              {edu.startDate.toLocaleDateString()} - {edu.endDate ? edu.endDate.toLocaleDateString() : 'Present'}
                            </p>
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
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.skills.length === 0 ? (
                  <p className="text-gray-500">No skills information provided.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                        {skill.level && ` (${skill.level})`}
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
                  <p className="text-gray-500">No active certifications.</p>
                ) : (
                  <div className="space-y-4">
                    {user.certifications.map(cert => (
                      <div key={cert.id} className="flex items-start gap-4">
                        <Award className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                          <p className="text-gray-600">{cert.issuer}</p>
                          <p className="text-sm text-gray-500">
                            Expires: {cert.expirationDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
