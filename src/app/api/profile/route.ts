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
      include: {
        profile: {
          include: {
            education: true,
            experience: true,
            skills: true,
            awards: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
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

    const body = await request.json();
    const { name, specialty, location, bio, title, phone, linkedin } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(specialty !== undefined && { specialty }),
        ...(location !== undefined && { location }),
      },
    });

    if (bio !== undefined || title !== undefined || phone !== undefined || linkedin !== undefined) {
      await prisma.profile.upsert({
        where: { userId: user.id },
        update: {
          ...(bio !== undefined && { bio }),
          ...(title !== undefined && { title }),
          ...(phone !== undefined && { phone }),
          ...(linkedin !== undefined && { linkedin }),
        },
        create: {
          userId: user.id,
          bio: bio ?? null,
          title: title ?? null,
          phone: phone ?? null,
          linkedin: linkedin ?? null,
        },
      });
    }

    const { password: _, ...safeUser } = updatedUser;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
