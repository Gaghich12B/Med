import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Award, 
  AlertCircle, 
  Calendar, 
  FileText, 
  Plus,
  CheckCircle,
  Clock
} from "lucide-react"

export default async function CertificationsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = (session.user as any).id

  const certifications = await prisma.certification.findMany({
    where: {
      userId
    },
    orderBy: {
      expirationDate: "asc"
    }
  })

  // Check for expiring certifications (within 30 days)
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  
  const expiringCertifications = certifications.filter(
    cert => cert.expirationDate && new Date(cert.expirationDate) <= thirtyDaysFromNow
  )

  const expiredCertifications = certifications.filter(
    cert => cert.status === "EXPIRED" || (cert.expirationDate && new Date(cert.expirationDate) < new Date())
  )

  const activeCertifications = certifications.filter(
    cert => cert.status === "ACTIVE" && (!cert.expirationDate || new Date(cert.expirationDate) > new Date())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Award className="h-8 w-8 text-blue-600" />
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Certifications
            </h1>
            <p className="text-gray-600">
              Track and manage your professional certifications
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Certification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Certification</DialogTitle>
                <DialogDescription>
                  Enter the details of your certification
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Certification Name</Label>
                  <Input id="name" placeholder="e.g., ACLS, BLS, CCRN" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuing Organization</Label>
                  <Input id="issuer" placeholder="e.g., American Heart Association" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credentialNumber">Credential Number</Label>
                  <Input id="credentialNumber" placeholder="e.g., CCRN-123456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input id="issueDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expirationDate">Expiration Date</Label>
                    <Input id="expirationDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceCredits">CE Credits</Label>
                  <Input id="ceCredits" type="number" placeholder="0" />
                </div>
                <Button type="submit" className="w-full">
                  Add Certification
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alerts */}
        {expiringCertifications.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                Expiring Soon
              </CardTitle>
              <CardDescription>
                The following certifications are expiring within 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expiringCertifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-semibold">{cert.name}</p>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                      </div>
                    </div>
                    <Badge variant="destructive">
                      {cert.expirationDate?.toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCertifications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiringCertifications.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiredCertifications.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Certifications List */}
        <div className="space-y-6">
          {/* Active Certifications */}
          {activeCertifications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Certifications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {activeCertifications.map((cert) => (
                  <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{cert.name}</CardTitle>
                          <CardDescription>{cert.issuer}</CardDescription>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {cert.credentialNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-600">{cert.credentialNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-600">
                          Issued: {cert.issueDate.toLocaleDateString()}
                        </span>
                      </div>
                      {cert.expirationDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-600">
                            Expires: {cert.expirationDate.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {cert.ceCredits > 0 && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Award className="h-4 w-4" />
                          <span>{cert.ceCredits} CE Credits</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Expiring Certifications */}
          {expiringCertifications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Expiring Soon</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {expiringCertifications.map((cert) => (
                  <Card key={cert.id} className="border-orange-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{cert.name}</CardTitle>
                          <CardDescription>{cert.issuer}</CardDescription>
                        </div>
                        <Badge variant="destructive">
                          Expiring Soon
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {cert.credentialNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-600">{cert.credentialNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">
                          Expires: {cert.expirationDate?.toLocaleDateString()}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Find Renewal Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Expired Certifications */}
          {expiredCertifications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Expired Certifications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {expiredCertifications.map((cert) => (
                  <Card key={cert.id} className="border-red-200 opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{cert.name}</CardTitle>
                          <CardDescription>{cert.issuer}</CardDescription>
                        </div>
                        <Badge variant="destructive">
                          Expired
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-semibold">
                          Expired: {cert.expirationDate?.toLocaleDateString()}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Find Renewal Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {certifications.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No certifications yet</h3>
                <p className="text-gray-600 mb-4">Add your first certification to start tracking</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Certification</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Certification</DialogTitle>
                      <DialogDescription>
                        Enter the details of your certification
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Certification Name</Label>
                        <Input id="name" placeholder="e.g., ACLS, BLS, CCRN" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issuer">Issuing Organization</Label>
                        <Input id="issuer" placeholder="e.g., American Heart Association" />
                      </div>
                      <Button type="submit" className="w-full">
                        Add Certification
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}