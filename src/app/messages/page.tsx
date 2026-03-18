import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    include: {
      sender: { select: { id: true, name: true, email: true, role: true } },
      receiver: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Group messages by conversation partner
  const conversationMap = new Map<
    string,
    {
      partner: { id: string; name: string | null; email: string; role: string };
      lastMessage: (typeof messages)[0];
      unreadCount: number;
    }
  >();

  for (const msg of messages) {
    const partner = msg.senderId === user.id ? msg.receiver : msg.sender;
    if (!conversationMap.has(partner.id)) {
      const unreadCount = messages.filter(
        (m: (typeof messages)[0]) => m.senderId === partner.id && m.receiverId === user.id && !m.read
      ).length;
      conversationMap.set(partner.id, {
        partner,
        lastMessage: msg,
        unreadCount,
      });
    }
  }

  const conversations = Array.from(conversationMap.values());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Your conversations with other healthcare professionals</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No messages yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Connect with other professionals to start messaging
                  </p>
                  <Link href="/network">
                    <Button className="mt-4">Browse Network</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map(({ partner, lastMessage, unreadCount }) => (
                    <div
                      key={partner.id}
                      className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors rounded-lg px-2"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {partner.name
                            ? partner.name.split(' ').map((n) => n[0]).join('').toUpperCase()
                            : partner.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {partner.name || partner.email}
                          </h3>
                          <span className="text-xs text-gray-400 ml-2 shrink-0">
                            {new Date(lastMessage.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-0.5">
                          {lastMessage.senderId === user.id ? 'You: ' : ''}
                          {lastMessage.content}
                        </p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {partner.role.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      {unreadCount > 0 && (
                        <Badge className="shrink-0 bg-blue-600 text-white">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
