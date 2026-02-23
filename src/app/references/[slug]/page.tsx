import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  ArrowLeft, 
  ExternalLink,
  User,
  Calendar,
  Eye,
  GraduationCap
} from "lucide-react"

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug
    }
  })

  if (!article) {
    redirect("/references")
  }

  // Increment view count
  await prisma.article.update({
    where: {
      id: article.id
    },
    data: {
      views: {
        increment: 1
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Healthcare Pro Network</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/references">
              <Button variant="ghost">Back to References</Button>
            </Link>
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" type="submit">Sign Out</Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/references">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to References
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{article.category}</Badge>
            <Badge 
              variant={article.evidenceGrade === 'A' ? 'default' : 'outline'}
              className={
                article.evidenceGrade === 'A' ? 'bg-green-600' :
                article.evidenceGrade === 'B' ? 'bg-blue-600' :
                article.evidenceGrade === 'C' ? 'bg-yellow-600' :
                'bg-red-600'
              }
            >
              Evidence Grade {article.evidenceGrade}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          {article.summary && (
            <p className="text-xl text-gray-600 mb-6">
              {article.summary}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-600">
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{article.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{article.views + 1} views</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {article.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sources */}
            {article.sources && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {article.sources.split(',').map((source, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ExternalLink className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        <a 
                          href={source.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {source.trim()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            {article.tags && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Courses */}
            {article.relatedCourses && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Related Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Continue your learning with related courses
                  </p>
                  <Link href="/courses">
                    <Button className="w-full" variant="outline">
                      Browse Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share Article</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Share this article with your colleagues
                </p>
                <Button className="w-full" variant="outline">
                  Copy Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}