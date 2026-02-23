import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Award } from 'lucide-react';

export default async function CertificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      certifications: {
        orderBy: {
          expirationDate: 'asc'
        }
      }
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringSoon = user.certifications.filter(
    cert => cert.expirationDate <= thirtyDaysFromNow && cert.expirationDate > new Date()
  );

  const active = user.certifications.filter(
    cert => cert.expirationDate > new Date()
  );

  const expired = user.certifications.filter(
    cert => cert.expirationDate <= new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Certifications</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your professional certifications
          </p>
        </div>

        {/* Expiration Alert */}
        {expiringSoon.length > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">
                  Action Required
                </h3>
                <p className="text-amber-800 text-sm mt-1">
                  You have {expiringSoon.length} certification(s) expiring within 30 days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active
              </CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{active.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Expiring Soon
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiringSoon.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Expired
              </CardTitle>
              <Award className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expired.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Certifications List */}
        <div className="space-y-4">
          {user.certifications.map(certification => {
            const isExpiringSoon = certification.expirationDate <= thirtyDaysFromNow && certification.expirationDate > new Date();
            const isExpired = certification.expirationDate <= new Date();

            return (
              <Card key={certification.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{certification.name}</CardTitle>
                      <p className="text-gray-600 mt-1">{certification.issuer}</p>
                      {certification.credentialNumber && (
                        <p className="text-sm text-gray-500">
                          Credential: {certification.credentialNumber}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        isExpired ? 'destructive' :
                        isExpiringSoon ? 'secondary' : 'default'
                      }
                    >
                      {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Issue Date</p>
                      <p className="font-medium">{certification.issueDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expiration Date</p>
                      <p className="font-medium">{certification.expirationDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">CE Credits</p>
                      <p className="font-medium">{certification.ceCredits || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Days Until Expiration</p>
                      <p className="font-medium">
                        {Math.ceil((certification.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {user.certifications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No certifications added yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
