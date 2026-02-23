import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function ReferencesPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const filteredArticles = articles.filter(article => {
    if (searchParams.q) {
      const query = searchParams.q.toLowerCase();
      const title = article.title.toLowerCase();
      const content = article.content.toLowerCase();
      if (!title.includes(query) && !content.includes(query)) {
        return false;
      }
    }
    if (searchParams.category && article.category !== searchParams.category) {
      return false;
    }
    return true;
  });

  const categories = Array.from(new Set(articles.map(a => a.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Medical Reference Library</h1>
          <p className="text-gray-600 mt-2">
            Access evidence-based medical articles and references
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Articles
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Categories
              </CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.reduce((sum, a) => sum + a.views, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.q || ''}
            />
          </div>
          <div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.category || ''}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">All</Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={searchParams.category === category ? 'default' : 'outline'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <Link key={article.id} href={`/references/${article.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <Badge
                      variant={
                        article.evidenceGrade === 'A' ? 'default' :
                        article.evidenceGrade === 'B' ? 'secondary' :
                        article.evidenceGrade === 'C' ? 'outline' : 'destructive'
                      }
                    >
                      Grade: {article.evidenceGrade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">
                    {article.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span>{article.views} views</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
