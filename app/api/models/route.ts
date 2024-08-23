import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const models = await prisma.product.findMany({
      include: {
        category: true, // Ensure we're including the related category
      },
    });
    
    return NextResponse.json(models);
  } catch (error) {
    console.error("Error fetching models: ", error); // Log the full error details
    return NextResponse.json({ error: 'Failed to fetch models', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
