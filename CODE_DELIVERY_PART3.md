<h1>Healthcare Platform - Complete Code Delivery (Part 3)</h1><h2>📖 References Page (src/app/references/page.tsx)</h2><pre><code class="language-typescript">import { prisma } from '@/lib/prisma';
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

  const filteredArticles = articles.filter(article =&gt; {
    if (searchParams.q) {
      const query = searchParams.q.toLowerCase();
      const title = article.title.toLowerCase();
      const content = article.content.toLowerCase();
      if (!title.includes(query) &amp;&amp; !content.includes(query)) {
        return false;
      }
    }
    if (searchParams.category &amp;&amp; article.category !== searchParams.category) {
      return false;
    }
    return true;
  });

  const categories = Array.from(new Set(articles.map(a =&gt; a.category)));

  return (
    &lt;div className="min-h-screen bg-gray-50"&gt;
      &lt;div className="container mx-auto px-4 py-8"&gt;
        &lt;div className="mb-8"&gt;
          &lt;h1 className="text-3xl font-bold text-gray-900"&gt;Medical Reference Library&lt;/h1&gt;
          &lt;p className="text-gray-600 mt-2"&gt;
            Access evidence-based medical articles and references
          &lt;/p&gt;
        &lt;/div&gt;

        {/* Stats */}
        &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"&gt;
          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Total Articles
              &lt;/CardTitle&gt;
              &lt;FileText className="h-4 w-4 text-blue-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;{articles.length}&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;

          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Categories
              &lt;/CardTitle&gt;
              &lt;FileText className="h-4 w-4 text-green-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;{categories.length}&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;

          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Total Views
              &lt;/CardTitle&gt;
              &lt;Eye className="h-4 w-4 text-purple-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;
                {articles.reduce((sum, a) =&gt; sum + a.views, 0)}
              &lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;
        &lt;/div&gt;

        {/* Search and Filters */}
        &lt;div className="mb-6 flex flex-wrap gap-4"&gt;
          &lt;div className="flex-1 min-w-64"&gt;
            &lt;input
              type="text"
              placeholder="Search articles..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.q || ''}
            /&gt;
          &lt;/div&gt;
          &lt;div&gt;
            &lt;select
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.category || ''}
            &gt;
              &lt;option value=""&gt;All Categories&lt;/option&gt;
              {categories.map(category =&gt; (
                &lt;option key={category} value={category}&gt;
                  {category}
                &lt;/option&gt;
              ))}
            &lt;/select&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        {/* Category Filters */}
        &lt;div className="mb-6 flex flex-wrap gap-2"&gt;
          &lt;Button variant="outline" size="sm"&gt;All&lt;/Button&gt;
          {categories.map(category =&gt; (
            &lt;Button
              key={category}
              variant={searchParams.category === category ? 'default' : 'outline'}
              size="sm"
            &gt;
              {category}
            &lt;/Button&gt;
          ))}
        &lt;/div&gt;

        {/* Articles Grid */}
        &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
          {filteredArticles.map(article =&gt; (
            &lt;Link key={article.id} href={`/references/${article.slug}`}&gt;
              &lt;Card className="hover:shadow-lg transition-shadow cursor-pointer"&gt;
                &lt;CardHeader&gt;
                  &lt;CardTitle className="text-xl"&gt;{article.title}&lt;/CardTitle&gt;
                  &lt;div className="flex flex-wrap gap-2 mt-2"&gt;
                    &lt;Badge variant="secondary"&gt;{article.category}&lt;/Badge&gt;
                    &lt;Badge
                      variant={
                        article.evidenceGrade === 'A' ? 'default' :
                        article.evidenceGrade === 'B' ? 'secondary' :
                        article.evidenceGrade === 'C' ? 'outline' : 'destructive'
                      }
                    &gt;
                      Grade: {article.evidenceGrade}
                    &lt;/Badge&gt;
                  &lt;/div&gt;
                &lt;/CardHeader&gt;
                &lt;CardContent&gt;
                  &lt;p className="text-gray-600 line-clamp-3"&gt;
                    {article.content.substring(0, 150)}...
                  &lt;/p&gt;
                  &lt;div className="flex items-center gap-2 mt-4 text-sm text-gray-500"&gt;
                    &lt;Eye className="h-4 w-4" /&gt;
                    &lt;span&gt;{article.views} views&lt;/span&gt;
                  &lt;/div&gt;
                &lt;/CardContent&gt;
              &lt;/Card&gt;
            &lt;/Link&gt;
          ))}
        &lt;/div&gt;

        {filteredArticles.length === 0 &amp;&amp; (
          &lt;div className="text-center py-12"&gt;
            &lt;p className="text-gray-500"&gt;No articles found matching your criteria.&lt;/p&gt;
          &lt;/div&gt;
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>📄 Article Detail Page (src/app/references/[slug]/page.tsx)</h2><pre><code class="language-typescript">import { prisma } from '@/lib/prisma';
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
    &lt;div className="min-h-screen bg-gray-50"&gt;
      &lt;div className="container mx-auto px-4 py-8"&gt;
        &lt;div className="max-w-4xl mx-auto"&gt;
          {/* Back Button */}
          &lt;Link href="/references"&gt;
            &lt;Button variant="ghost" className="mb-6"&gt;
              ← Back to References
            &lt;/Button&gt;
          &lt;/Link&gt;

          {/* Article Header */}
          &lt;div className="mb-8"&gt;
            &lt;div className="flex flex-wrap gap-2 mb-4"&gt;
              &lt;Badge variant="secondary"&gt;{article.category}&lt;/Badge&gt;
              &lt;Badge
                variant={
                  article.evidenceGrade === 'A' ? 'default' :
                  article.evidenceGrade === 'B' ? 'secondary' :
                  article.evidenceGrade === 'C' ? 'outline' : 'destructive'
                }
              &gt;
                Evidence Grade: {article.evidenceGrade}
              &lt;/Badge&gt;
            &lt;/div&gt;
            &lt;h1 className="text-4xl font-bold text-gray-900 mb-4"&gt;
              {article.title}
            &lt;/h1&gt;
            &lt;div className="flex items-center gap-4 text-gray-600"&gt;
              &lt;div className="flex items-center gap-2"&gt;
                &lt;Eye className="h-4 w-4" /&gt;
                &lt;span&gt;{article.views} views&lt;/span&gt;
              &lt;/div&gt;
              &lt;span&gt;•&lt;/span&gt;
              &lt;span&gt;{article.createdAt.toLocaleDateString()}&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;div className="grid grid-cols-1 lg:grid-cols-4 gap-6"&gt;
            {/* Main Content */}
            &lt;div className="lg:col-span-3"&gt;
              &lt;Card&gt;
                &lt;CardContent className="pt-6"&gt;
                  &lt;div className="prose max-w-none"&gt;
                    {article.content.split('\n').map((paragraph, index) =&gt; (
                      &lt;p key={index} className="mb-4 text-gray-700 leading-relaxed"&gt;
                        {paragraph}
                      &lt;/p&gt;
                    ))}
                  &lt;/div&gt;
                &lt;/CardContent&gt;
              &lt;/Card&gt;

              {/* Source Citation */}
              {article.source &amp;&amp; (
                &lt;Card className="mt-6"&gt;
                  &lt;CardHeader&gt;
                    &lt;CardTitle className="text-lg"&gt;Source&lt;/CardTitle&gt;
                  &lt;/CardHeader&gt;
                  &lt;CardContent&gt;
                    &lt;p className="text-gray-700"&gt;{article.source}&lt;/p&gt;
                    {article.sourceUrl &amp;&amp; (
                      &lt;a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-2"
                      &gt;
                        &lt;ExternalLink className="h-4 w-4" /&gt;
                        &lt;span&gt;View Source&lt;/span&gt;
                      &lt;/a&gt;
                    )}
                  &lt;/CardContent&gt;
                &lt;/Card&gt;
              )}
            &lt;/div&gt;

            {/* Sidebar */}
            &lt;div&gt;
              &lt;Card className="sticky top-4"&gt;
                &lt;CardHeader&gt;
                  &lt;CardTitle className="text-lg"&gt;Actions&lt;/CardTitle&gt;
                &lt;/CardHeader&gt;
                &lt;CardContent className="space-y-3"&gt;
                  &lt;Button variant="outline" className="w-full"&gt;
                    &lt;Share2 className="h-4 w-4 mr-2" /&gt;
                    Share
                  &lt;/Button&gt;
                  &lt;Link href={`/courses?category=${article.category}`}&gt;
                    &lt;Button variant="outline" className="w-full"&gt;
                      Related Courses
                    &lt;/Button&gt;
                  &lt;/Link&gt;
                &lt;/CardContent&gt;
              &lt;/Card&gt;

              {/* Tags */}
              &lt;Card className="mt-4"&gt;
                &lt;CardHeader&gt;
                  &lt;CardTitle className="text-lg"&gt;Category&lt;/CardTitle&gt;
                &lt;/CardHeader&gt;
                &lt;CardContent&gt;
                  &lt;Badge variant="secondary"&gt;{article.category}&lt;/Badge&gt;
                &lt;/CardContent&gt;
              &lt;/Card&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>👤 Profile Page (src/app/profile/page.tsx)</h2><pre><code class="language-typescript">import { getServerSession } from 'next-auth';
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
    &lt;div className="min-h-screen bg-gray-50"&gt;
      &lt;div className="container mx-auto px-4 py-8"&gt;
        {/* Profile Header */}
        &lt;Card className="mb-8"&gt;
          &lt;CardContent className="pt-6"&gt;
            &lt;div className="flex items-start gap-6"&gt;
              &lt;div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold"&gt;
                {user.name?.split(' ').map(n =&gt; n[0]).join('') || 'U'}
              &lt;/div&gt;
              &lt;div className="flex-1"&gt;
                &lt;h1 className="text-3xl font-bold text-gray-900"&gt;{user.name || 'Healthcare Professional'}&lt;/h1&gt;
                &lt;p className="text-gray-600 mt-1"&gt;
                  {profile?.title || ''} • {user.role.replace('_', ' ')}
                &lt;/p&gt;
                {user.specialty &amp;&amp; (
                  &lt;Badge variant="secondary" className="mt-2"&gt;
                    {user.specialty}
                  &lt;/Badge&gt;
                )}
                {user.location &amp;&amp; (
                  &lt;div className="flex items-center gap-2 text-gray-600 mt-2"&gt;
                    &lt;MapPin className="h-4 w-4" /&gt;
                    &lt;span&gt;{user.location}&lt;/span&gt;
                  &lt;/div&gt;
                )}
              &lt;/div&gt;
            &lt;/div&gt;

            {/* Contact Information */}
            {profile &amp;&amp; (
              &lt;div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"&gt;
                {profile.phone &amp;&amp; (
                  &lt;div className="flex items-center gap-2 text-gray-600"&gt;
                    &lt;Phone className="h-4 w-4" /&gt;
                    &lt;span&gt;{profile.phone}&lt;/span&gt;
                  &lt;/div&gt;
                )}
                &lt;div className="flex items-center gap-2 text-gray-600"&gt;
                  &lt;Mail className="h-4 w-4" /&gt;
                  &lt;span&gt;{user.email}&lt;/span&gt;
                &lt;/div&gt;
                {profile.linkedin &amp;&amp; (
                  &lt;a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  &gt;
                    LinkedIn Profile
                  &lt;/a&gt;
                )}
              &lt;/div&gt;
            )}
          &lt;/CardContent&gt;
        &lt;/Card&gt;

        {/* Profile Tabs */}
        &lt;Tabs defaultValue="about"&gt;
          &lt;TabsList&gt;
            &lt;TabsTrigger value="about"&gt;About&lt;/TabsTrigger&gt;
            &lt;TabsTrigger value="experience"&gt;Experience&lt;/TabsTrigger&gt;
            &lt;TabsTrigger value="education"&gt;Education&lt;/TabsTrigger&gt;
            &lt;TabsTrigger value="skills"&gt;Skills&lt;/TabsTrigger&gt;
            &lt;TabsTrigger value="certifications"&gt;Certifications&lt;/TabsTrigger&gt;
          &lt;/TabsList&gt;

          &lt;TabsContent value="about" className="mt-6"&gt;
            &lt;Card&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle&gt;About&lt;/CardTitle&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent&gt;
                {profile?.bio ? (
                  &lt;p className="text-gray-700"&gt;{profile.bio}&lt;/p&gt;
                ) : (
                  &lt;p className="text-gray-500"&gt;No bio information provided.&lt;/p&gt;
                )}
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          &lt;/TabsContent&gt;

          &lt;TabsContent value="experience" className="mt-6"&gt;
            &lt;Card&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle&gt;Work Experience&lt;/CardTitle&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent&gt;
                {profile?.experience.length === 0 ? (
                  &lt;p className="text-gray-500"&gt;No experience information provided.&lt;/p&gt;
                ) : (
                  &lt;div className="space-y-6"&gt;
                    {profile.experience.map(exp =&gt; (
                      &lt;div key={exp.id} className="border-l-2 border-blue-600 pl-4"&gt;
                        &lt;div className="flex items-start justify-between"&gt;
                          &lt;div&gt;
                            &lt;h3 className="font-semibold text-gray-900"&gt;{exp.title}&lt;/h3&gt;
                            &lt;p className="text-gray-600"&gt;{exp.company}&lt;/p&gt;
                            {exp.location &amp;&amp; (
                              &lt;p className="text-sm text-gray-500"&gt;{exp.location}&lt;/p&gt;
                            )}
                          &lt;/div&gt;
                          {exp.current &amp;&amp; (
                            &lt;Badge variant="default"&gt;Current&lt;/Badge&gt;
                          )}
                        &lt;/div&gt;
                        &lt;div className="flex items-center gap-2 text-sm text-gray-500 mt-2"&gt;
                          &lt;Calendar className="h-4 w-4" /&gt;
                          &lt;span&gt;
                            {exp.startDate.toLocaleDateString()} - {exp.endDate ? exp.endDate.toLocaleDateString() : 'Present'}
                          &lt;/span&gt;
                        &lt;/div&gt;
                      &lt;/div&gt;
                    ))}
                  &lt;/div&gt;
                )}
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          &lt;/TabsContent&gt;

          &lt;TabsContent value="education" className="mt-6"&gt;
            &lt;Card&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle&gt;Education&lt;/CardTitle&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent&gt;
                {profile?.education.length === 0 ? (
                  &lt;p className="text-gray-500"&gt;No education information provided.&lt;/p&gt;
                ) : (
                  &lt;div className="space-y-4"&gt;
                    {profile.education.map(edu =&gt; (
                      &lt;div key={edu.id} className="flex items-start gap-4"&gt;
                        &lt;GraduationCap className="h-5 w-5 text-blue-600 mt-1" /&gt;
                        &lt;div&gt;
                          &lt;h3 className="font-semibold text-gray-900"&gt;{edu.degree}&lt;/h3&gt;
                          &lt;p className="text-gray-600"&gt;{edu.school}&lt;/p&gt;
                          {edu.field &amp;&amp; (
                            &lt;p className="text-sm text-gray-500"&gt;{edu.field}&lt;/p&gt;
                          )}
                          {edu.startDate &amp;&amp; (
                            &lt;p className="text-sm text-gray-500"&gt;
                              {edu.startDate.toLocaleDateString()} - {edu.endDate ? edu.endDate.toLocaleDateString() : 'Present'}
                            &lt;/p&gt;
                          )}
                        &lt;/div&gt;
                      &lt;/div&gt;
                    ))}
                  &lt;/div&gt;
                )}
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          &lt;/TabsContent&gt;

          &lt;TabsContent value="skills" className="mt-6"&gt;
            &lt;Card&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle&gt;Skills&lt;/CardTitle&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent&gt;
                {profile?.skills.length === 0 ? (
                  &lt;p className="text-gray-500"&gt;No skills information provided.&lt;/p&gt;
                ) : (
                  &lt;div className="flex flex-wrap gap-2"&gt;
                    {profile.skills.map(skill =&gt; (
                      &lt;Badge key={skill.id} variant="secondary"&gt;
                        {skill.name}
                        {skill.level &amp;&amp; ` (${skill.level})`}
                      &lt;/Badge&gt;
                    ))}
                  &lt;/div&gt;
                )}
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          &lt;/TabsContent&gt;

          &lt;TabsContent value="certifications" className="mt-6"&gt;
            &lt;Card&gt;
              &lt;CardHeader&gt;
                &lt;CardTitle&gt;Active Certifications&lt;/CardTitle&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent&gt;
                {user.certifications.length === 0 ? (
                  &lt;p className="text-gray-500"&gt;No active certifications.&lt;/p&gt;
                ) : (
                  &lt;div className="space-y-4"&gt;
                    {user.certifications.map(cert =&gt; (
                      &lt;div key={cert.id} className="flex items-start gap-4"&gt;
                        &lt;Award className="h-5 w-5 text-blue-600 mt-1" /&gt;
                        &lt;div className="flex-1"&gt;
                          &lt;h3 className="font-semibold text-gray-900"&gt;{cert.name}&lt;/h3&gt;
                          &lt;p className="text-gray-600"&gt;{cert.issuer}&lt;/p&gt;
                          &lt;p className="text-sm text-gray-500"&gt;
                            Expires: {cert.expirationDate.toLocaleDateString()}
                          &lt;/p&gt;
                        &lt;/div&gt;
                      &lt;/div&gt;
                    ))}
                  &lt;/div&gt;
                )}
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          &lt;/TabsContent&gt;
        &lt;/Tabs&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>🌐 Network Page (src/app/network/page.tsx)</h2><pre><code class="language-typescript">import { prisma } from '@/lib/prisma';
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

  const filteredUsers = users.filter(user =&gt; {
    if (searchParams.q) {
      const query = searchParams.q.toLowerCase();
      const name = user.name?.toLowerCase() || '';
      const specialty = user.specialty?.toLowerCase() || '';
      const location = user.location?.toLowerCase() || '';
      if (!name.includes(query) &amp;&amp; !specialty.includes(query) &amp;&amp; !location.includes(query)) {
        return false;
      }
    }
    if (searchParams.role &amp;&amp; user.role !== searchParams.role) {
      return false;
    }
    return true;
  });

  const roles = Array.from(new Set(users.map(u =&gt; u.role)));

  return (
    &lt;div className="min-h-screen bg-gray-50"&gt;
      &lt;div className="container mx-auto px-4 py-8"&gt;
        &lt;div className="mb-8"&gt;
          &lt;h1 className="text-3xl font-bold text-gray-900"&gt;Network&lt;/h1&gt;
          &lt;p className="text-gray-600 mt-2"&gt;
            Connect with healthcare professionals
          &lt;/p&gt;
        &lt;/div&gt;

        {/* Stats */}
        &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"&gt;
          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Total Connections
              &lt;/CardTitle&gt;
              &lt;Users className="h-4 w-4 text-blue-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;0&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;

          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Professionals
              &lt;/CardTitle&gt;
              &lt;Users className="h-4 w-4 text-green-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;{users.length}&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;

          &lt;Card&gt;
            &lt;CardHeader className="flex flex-row items-center justify-between pb-2"&gt;
              &lt;CardTitle className="text-sm font-medium text-gray-600"&gt;
                Pending Requests
              &lt;/CardTitle&gt;
              &lt;UserPlus className="h-4 w-4 text-purple-600" /&gt;
            &lt;/CardHeader&gt;
            &lt;CardContent&gt;
              &lt;div className="text-2xl font-bold"&gt;0&lt;/div&gt;
            &lt;/CardContent&gt;
          &lt;/Card&gt;
        &lt;/div&gt;

        {/* Search and Filters */}
        &lt;div className="mb-6 flex flex-wrap gap-4"&gt;
          &lt;div className="flex-1 min-w-64"&gt;
            &lt;input
              type="text"
              placeholder="Search by name, specialty, or location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.q || ''}
            /&gt;
          &lt;/div&gt;
          &lt;div&gt;
            &lt;select
              className="px-3 py-2 border border-gray-300 rounded-md"
              defaultValue={searchParams.role || ''}
            &gt;
              &lt;option value=""&gt;All Roles&lt;/option&gt;
              {roles.map(role =&gt; (
                &lt;option key={role} value={role}&gt;
                  {role.replace('_', ' ')}
                &lt;/option&gt;
              ))}
            &lt;/select&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        {/* Users Grid */}
        &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
          {filteredUsers.map(user =&gt; (
            &lt;Card key={user.id} className="hover:shadow-lg transition-shadow"&gt;
              &lt;CardHeader&gt;
                &lt;div className="flex items-start gap-4"&gt;
                  &lt;div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"&gt;
                    {user.name?.split(' ').map(n =&gt; n[0]).join('') || 'U'}
                  &lt;/div&gt;
                  &lt;div className="flex-1 min-w-0"&gt;
                    &lt;CardTitle className="text-lg truncate"&gt;{user.name || 'Healthcare Professional'}&lt;/CardTitle&gt;
                    &lt;p className="text-sm text-gray-600 truncate"&gt;
                      {user.role.replace('_', ' ')}
                    &lt;/p&gt;
                    {user.specialty &amp;&amp; (
                      &lt;Badge variant="secondary" className="mt-1"&gt;
                        {user.specialty}
                      &lt;/Badge&gt;
                    )}
                  &lt;/div&gt;
                &lt;/div&gt;
              &lt;/CardHeader&gt;
              &lt;CardContent className="space-y-3"&gt;
                {user.location &amp;&amp; (
                  &lt;div className="flex items-center gap-2 text-sm text-gray-600"&gt;
                    &lt;MapPin className="h-4 w-4" /&gt;
                    &lt;span className="truncate"&gt;{user.location}&lt;/span&gt;
                  &lt;/div&gt;
                )}
                {user.profile?.title &amp;&amp; (
                  &lt;p className="text-sm text-gray-600"&gt;{user.profile.title}&lt;/p&gt;
                )}
                &lt;div className="flex gap-2"&gt;
                  &lt;Button size="sm" className="flex-1"&gt;
                    &lt;UserPlus className="h-4 w-4 mr-1" /&gt;
                    Connect
                  &lt;/Button&gt;
                  &lt;Button size="sm" variant="outline" className="flex-1"&gt;
                    &lt;MessageSquare className="h-4 w-4 mr-1" /&gt;
                    Message
                  &lt;/Button&gt;
                &lt;/div&gt;
              &lt;/CardContent&gt;
            &lt;/Card&gt;
          ))}
        &lt;/div&gt;

        {filteredUsers.length === 0 &amp;&amp; (
          &lt;div className="text-center py-12"&gt;
            &lt;p className="text-gray-500"&gt;No professionals found matching your criteria.&lt;/p&gt;
          &lt;/div&gt;
        )}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
</code></pre><h2>📝 Continue to Part 4 for Feed, Auth pages, and API routes...</h2>