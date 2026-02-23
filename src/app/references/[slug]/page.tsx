import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ExternalLink, Share2 } from 'lucide-react';
import Link from 'next/link';

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug }
  });

  if (!article) {
    notFound();
  }

  // Increment view count
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/references">
            <Button variant="ghost" className="mb-6">
              ← Back to References
            </Button>
          </Link>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{article.category}</Badge>
              <Badge
                variant={
                  article.evidenceGrade === 'A' ? 'default' :
                  article.evidenceGrade === 'B' ? 'secondary' :
                  article.evidenceGrade === 'C' ? 'outline' : 'destructive'
                }
              >
                Evidence Grade: {article.evidenceGrade}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{article.views} views</span>
              </div>
              <span>•</span>
              <span>{article.createdAt.toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    {article.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Source Citation */}
              {article.source && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{article.source}</p>
                    {article.sourceUrl && (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Source</span>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Link href={`/courses?category=${article.category}`}>
                    <Button variant="outline" className="w-full">
                      Related Courses
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{article.category}</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
