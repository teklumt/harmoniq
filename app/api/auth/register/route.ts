import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, acceptTerms } = body

    // Log the registration attempt
    console.log(" " " Registration attempt:", {
      name,
      email,
      acceptTerms,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    })

    // Simulate registration logic
    if (name && email && password && acceptTerms) {
      // Mock successful registration
      const mockUser = {
        id: "2",
        name,
        email,
        token: "mock-jwt-token-" + Date.now(),
      }

      console.log(" " " Registration successful:", { userId: mockUser.id, email })

      return NextResponse.json({
        success: true,
        user: mockUser,
        message: "Account created successfully",
      })
    } else {
      console.log(" " " Registration failed: Missing or invalid data")

      return NextResponse.json(
        { success: false, message: "Please fill in all required fields and accept terms" },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error(" " " Registration error:", error)

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
