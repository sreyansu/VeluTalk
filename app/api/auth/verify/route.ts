import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      const { db } = await connectDB()
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password: 0 } })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 })
      }

      return NextResponse.json({
        valid: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      })
    } catch (jwtError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
