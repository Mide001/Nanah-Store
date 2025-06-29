import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get the first (and only) store settings record, or create one if it doesn't exist
    let settings = await prisma.storeSettings.findFirst()
    
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          storeName: "Nanah Store",
          description: "Unique, handcrafted crochet items"
        }
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching store settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeName, description } = body

    // Get the first settings record, or create one if it doesn't exist
    let settings = await prisma.storeSettings.findFirst()
    
    if (settings) {
      // Update existing settings
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: {
          storeName,
          description
        }
      })
    } else {
      // Create new settings
      settings = await prisma.storeSettings.create({
        data: {
          storeName,
          description
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating store settings:', error)
    return NextResponse.json(
      { error: 'Failed to update store settings' },
      { status: 500 }
    )
  }
} 