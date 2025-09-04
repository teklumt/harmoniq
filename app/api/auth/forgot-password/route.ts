import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Log the forgot password attempt
    console.log("[v0] Forgot password request:", {
      email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    })

    // Simulate sending reset email
    if (email) {
      console.log("[v0] Password reset email sent to:", email)

      return NextResponse.json({
        success: true,
        message: "Password reset email sent",
      })
    } else {
      console.log("[v0] Forgot password failed: Missing email")

      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Forgot password error:", error)

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
