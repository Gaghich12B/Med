import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const connections = await prisma.connection.findMany({
      where: {
        OR: [{ userId: user.id }, { connectedId: user.id }],
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true, specialty: true, location: true } },
        connectedUser: { select: { id: true, name: true, email: true, role: true, specialty: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ connections });
  } catch (error) {
    console.error('Get connections error:', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { connectedId } = await request.json();

    if (!connectedId) {
      return NextResponse.json({ error: 'connectedId is required' }, { status: 400 });
    }

    if (connectedId === user.id) {
      return NextResponse.json({ error: 'Cannot connect to yourself' }, { status: 400 });
    }

    const existing = await prisma.connection.findUnique({
      where: { userId_connectedId: { userId: user.id, connectedId } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Connection request already exists' }, { status: 400 });
    }

    const connection = await prisma.connection.create({
      data: {
        userId: user.id,
        connectedId,
        status: 'PENDING',
      },
      include: {
        connectedUser: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return NextResponse.json({ connection }, { status: 201 });
  } catch (error) {
    console.error('Create connection error:', error);
    return NextResponse.json({ error: 'Failed to send connection request' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { connectionId, status } = await request.json();

    if (!connectionId || !status) {
      return NextResponse.json({ error: 'connectionId and status are required' }, { status: 400 });
    }

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Status must be ACCEPTED or REJECTED' }, { status: 400 });
    }

    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    if (connection.connectedId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this connection' }, { status: 403 });
    }

    const updated = await prisma.connection.update({
      where: { id: connectionId },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        connectedUser: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return NextResponse.json({ connection: updated });
  } catch (error) {
    console.error('Update connection error:', error);
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}
