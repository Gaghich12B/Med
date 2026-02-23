import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, TrendingUp, Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function FeedPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const posts = await prisma.post.findMany({
    include: {
      user: {
        include: {
          profile: true
        }
      },
      comments: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 3
      },
      _count: {
        select: {
          comments: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 20
  });

  const trendingTopics = ['Continuing Education', 'Certification', 'Patient Care', 'Medical Technology'];
  const suggestedConnections = await prisma.user.findMany({
    where: {
      email: {
        not: session.user.email
      }
    },
    take: 3
  });
  const upcomingEvents = await prisma.scheduledCourse.findMany({
    where: {
      startDate: {
        gte: new Date()
      }
    },
    orderBy: {
      startDate: 'asc'
    },
    take: 3
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <textarea
                  placeholder="Share your thoughts, achievements, or ask a question..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Post Type
                    </Button>
                  </div>
                  <Button>Post</Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {post.user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{post.user.name || 'User'}</span>
                          {post.user.profile?.title && (
                            <span className="text-sm text-gray-600">• {post.user.profile.title}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                          {post.postType && (
                            <Badge variant="secondary">{post.postType}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    
                    <div className="flex items-center gap-4 pt-4 border-t">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Comment ({post._count.comments})
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        {post.comments.map(comment => (
                          <div key={comment.id} className="flex gap-3 mb-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                U
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">User</span>
                                <span className="text-xs text-gray-600">
                                  {comment.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending Topics
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map(topic => (
                    <Badge key={topic} variant="secondary" className="cursor-pointer">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Connections */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Suggested Connections
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedConnections.map(user => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-gray-600 truncate">
                          {user.role.replace('_', ' ')}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming Events
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="text-sm">
                      <p className="font-medium">{event.courseLocation.course.title}</p>
                      <p className="text-gray-600">
                        {event.startDate.toLocaleDateString()} • {event.courseLocation.city}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
