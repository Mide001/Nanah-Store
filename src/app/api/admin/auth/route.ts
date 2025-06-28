import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      message: 'Login successful',
      admin: { id: admin.id, username: admin.username }
    })
  } catch (error) {
    console.error('Error during admin login:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
} 