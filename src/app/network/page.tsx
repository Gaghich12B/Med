import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, MessageSquare, UserPlus } from 'lucide-react';

export default async function NetworkPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string };
}) {
  const users = await prisma.user.findMany({
    include: {
      profile: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const filteredUsers = users.filter(user => {
    if (searchParams.q) {
      const query = searchParams.q.toLowerCase();
      const name = user.name?.toLowerCase() || '';
      const specialty = user.specialty?.toLowerCase() || '';
      const location = user.location?.toLowerCase() || '';
      if (!name.includes(query) && !specialty.includes(query) && !location.includes(query)) {
        return false;
      }
    }
    if (searchParams.role && user.role !== searchParams.role) {
      return false;
    }
    return true;
  });

  const roles = Array.from(new Set(users.map(u => u.role)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Network</h1>
          <p className="text-gray-600 mt-2">
            Connect with healthcare professionals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Connections
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Professionals
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Requests
              </CardTitle>
              <UserPlus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search by name, specialty, or location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.q || ''}
            />
          </div>
          <div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.role || ''}
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{user.name || 'Healthcare Professional'}</CardTitle>
                    <p className="text-sm text-gray-600 truncate">
                      {user.role.replaceAll('_', ' ')}
                    </p>
                    {user.specialty && (
                      <Badge variant="secondary" className="mt-1">
                        {user.specialty}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{user.location}</span>
                  </div>
                )}
                {user.profile?.title && (
                  <p className="text-sm text-gray-600">{user.profile.title}</p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No professionals found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
