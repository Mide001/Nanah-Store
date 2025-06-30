import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    // Check if environment variables are set
    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in environment variables')
      return NextResponse.json(
        { error: 'Admin authentication not configured' },
        { status: 500 }
      )
    }

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      // Generate a simple token (in production, use proper JWT)
      const token = btoa(`${username}:${Date.now()}`)
      
      return NextResponse.json({
        success: true,
        token,
        message: 'Authentication successful'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 