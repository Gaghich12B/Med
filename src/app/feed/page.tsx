import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageSquare, 
  Heart, 
  Share2,
  Send,
  BookOpen,
  Award,
  GraduationCap
} from "lucide-react"

export default async function FeedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = (session.user as any).id

  // Get all posts with user info
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
  })

  const getPostIcon = (postType: string) => {
    switch (postType) {
      case 'COURSE_COMPLETION':
        return <GraduationCap className="h-5 w-5 text-green-600" />
      case 'CERTIFICATION':
        return <Award className="h-5 w-5 text-blue-600" />
      case 'ACHIEVEMENT':
        return <Award className="h-5 w-5 text-purple-600" />
      default:
        return null
    }
  }

  const getPostTypeBadge = (postType: string) => {
    switch (postType) {
      case 'COURSE_COMPLETION':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Course Completed</Badge>
      case 'CERTIFICATION':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Certification</Badge>
      case 'ACHIEVEMENT':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Achievement</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {session.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts, achievements, or ask a question..."
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Course
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Award className="h-4 w-4 mr-2" />
                          Certification
                        </Button>
                      </div>
                      <Button size="sm" className="gap-2">
                        <Send className="h-4 w-4" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  {/* Post Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <Link href={`/profile/${post.user.id}`}>
                      <Avatar>
                        <AvatarImage src={post.user.image || undefined} />
                        <AvatarFallback>
                          {post.user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/profile/${post.user.id}`}>
                          <span className="font-semibold hover:underline">
                            {post.user.name || 'Unknown'}
                          </span>
                        </Link>
                        {post.user.profile?.title && (
                          <span className="text-sm text-gray-600">
                            • {post.user.profile.title}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {post.createdAt.toLocaleDateString()} at {post.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Post Type Badge */}
                  {getPostTypeBadge(post.postType)}

                  {/* Post Content */}
                  <div className="mb-4">
                    {getPostIcon(post.postType)}
                    <p className="text-gray-800 mt-2 whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {post._count.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                U
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                  User
                                </span>
                                <span className="text-xs text-gray-600">
                                  {comment.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {post._count.comments > 3 && (
                        <Button variant="ghost" size="sm" className="mt-2">
                          View all {post._count.comments} comments
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {session.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Textarea
                          placeholder="Write a comment..."
                          className="min-h-[60px] resize-none text-sm"
                        />
                        <Button size="sm" className="self-end">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {posts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-600">
                    Be the first to share something with the community!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Trending Topics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#CriticalCare</span>
                    <Badge variant="outline">124 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#NursingTips</span>
                    <Badge variant="outline">98 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#Certifications</span>
                    <Badge variant="outline">76 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#CareerAdvice</span>
                    <Badge variant="outline">65 posts</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Connections */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">People to Connect</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm">U{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">User {i}</p>
                        <p className="text-xs text-gray-600">Nurse Practitioner</p>
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
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-600 pl-3">
                    <p className="font-medium text-sm">ACLS Certification Course</p>
                    <p className="text-xs text-gray-600">March 15, 2025</p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-3">
                    <p className="font-medium text-sm">Nursing Conference 2025</p>
                    <p className="text-xs text-gray-600">April 20, 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}