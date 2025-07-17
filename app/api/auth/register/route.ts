import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const { db } = await connectDB()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const result = await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      lastActive: new Date(),
    })

    const user = {
      _id: result.insertedId,
      username,
      email,
    }

    // Generate JWT token
    const token = jwt.sign({ userId: result.insertedId, username, email }, JWT_SECRET, { expiresIn: "7d" })

    return NextResponse.json({
      message: "User created successfully",
      token,
      user,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
