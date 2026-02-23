import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Search, 
  MapPin, 
  Star,
  UserPlus,
  MessageSquare,
  Filter
} from "lucide-react"

export default async function NetworkPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = (session.user as any).id

  // Get all users except current user
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: userId
      }
    },
    include: {
      profile: true
    },
    take: 20
  })

  // Get user's connections
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { userId },
        { connectedId: userId }
      ],
      status: 'ACCEPTED'
    }
  })

  const connectedUserIds = new Set([
    ...connections.map(c => c.userId),
    ...connections.map(c => c.connectedId)
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
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
            Professional Network
          </h1>
          <p className="text-gray-600">
            Connect with healthcare professionals across all specialties
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connections.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professionals</CardTitle>
              <UserPlus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name, specialty, or location..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* People You May Know */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">People You May Know</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => {
              const isConnected = connectedUserIds.has(user.id)
              const profile = user.profile
              
              return (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback className="text-xl">
                          {user.name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{user.name || 'Unknown'}</CardTitle>
                        {profile?.title && (
                          <CardDescription>{profile.title}</CardDescription>
                        )}
                        <Badge variant="secondary" className="mt-2">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile?.specialty && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-600">{profile.specialty}</span>
                      </div>
                    )}
                    {profile?.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-600">{profile.location}</span>
                      </div>
                    )}
                    {profile?.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      {isConnected ? (
                        <Button variant="outline" className="flex-1" size="sm">
                          Connected
                        </Button>
                      ) : (
                        <>
                          <Button className="flex-1" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {users.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No professionals found</h3>
              <p className="text-gray-600">
                Be the first to join and start building your network!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}