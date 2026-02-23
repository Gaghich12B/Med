import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: id,
        progress: 0,
      },
    });

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
  }
}