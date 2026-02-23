import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, 
  Search, 
  FileText,
  ExternalLink,
  TrendingUp
} from "lucide-react"

export default async function ReferencesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Get all published articles
  const articles = await prisma.article.findMany({
    where: {
      isPublished: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Get unique categories
  const categories = [...new Set(articles.map(a => a.category))]

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
            Medical Reference Library
          </h1>
          <p className="text-gray-600">
            Evidence-based medical articles and references
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search articles by title, category, or tags..."
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            All Categories
          </Button>
          {categories.map(category => (
            <Button key={category} variant="ghost" size="sm">
              {category}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.reduce((sum, a) => sum + a.views, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/references/${article.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
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
                      Grade {article.evidenceGrade}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    {article.title}
                  </CardTitle>
                  {article.summary && (
                    <CardDescription className="line-clamp-3">
                      {article.summary}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {article.author && (
                      <div className="text-sm text-gray-600">
                        By {article.author}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {article.views} views
                      </span>
                      <span className="text-gray-600">
                        {article.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    {article.tags && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.split(',').slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles available</h3>
              <p className="text-gray-600">
                Check back soon for new medical reference articles.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}