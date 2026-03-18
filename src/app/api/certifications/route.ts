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

    const certifications = await prisma.certification.findMany({
      where: { userId: user.id },
      orderBy: { expirationDate: 'asc' },
    });

    return NextResponse.json({ certifications });
  } catch (error) {
    console.error('Get certifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
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

    const { name, issuer, credentialNumber, issueDate, expirationDate, ceCredits } =
      await request.json();

    if (!name || !issuer || !issueDate || !expirationDate) {
      return NextResponse.json(
        { error: 'name, issuer, issueDate, and expirationDate are required' },
        { status: 400 }
      );
    }

    const parsedIssueDate = new Date(issueDate);
    const parsedExpirationDate = new Date(expirationDate);

    if (isNaN(parsedIssueDate.getTime()) || isNaN(parsedExpirationDate.getTime())) {
      return NextResponse.json(
        { error: 'issueDate and expirationDate must be valid dates' },
        { status: 400 }
      );
    }

    if (parsedExpirationDate <= parsedIssueDate) {
      return NextResponse.json(
        { error: 'expirationDate must be after issueDate' },
        { status: 400 }
      );
    }

    const certification = await prisma.certification.create({
      data: {
        userId: user.id,
        name,
        issuer,
        credentialNumber: credentialNumber ?? null,
        issueDate: parsedIssueDate,
        expirationDate: parsedExpirationDate,
        ceCredits: ceCredits ?? null,
      },
    });

    return NextResponse.json({ certification }, { status: 201 });
  } catch (error) {
    console.error('Create certification error:', error);
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 });
    }

    const certification = await prisma.certification.findUnique({ where: { id } });

    if (!certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    if (certification.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this certification' }, { status: 403 });
    }

    await prisma.certification.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete certification error:', error);
    return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
  }
}
