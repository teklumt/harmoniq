import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Log the login attempt
    console.log(" " " Login attempt:", {
      email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    })

    // Simulate authentication logic
    if (email && password) {
      // Mock successful login
      const mockUser = {
        id: "1",
        email,
        name: "Demo User",
        token: "mock-jwt-token-" + Date.now(),
      }

      console.log(" " " Login successful:", { userId: mockUser.id, email })

      return NextResponse.json({
        success: true,
        user: mockUser,
        message: "Login successful",
      })
    } else {
      console.log(" " " Login failed: Missing credentials")

      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 400 })
    }
  } catch (error) {
    console.error(" " " Login error:", error)

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
