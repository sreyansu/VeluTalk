import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    console.log("Starting registration process...")
    const { username, email, password } = await request.json()
    console.log("Received registration data:", { username, email })

    if (!username || !email || !password) {
      console.log("Missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    console.log("Connecting to database...")
    const { db } = await connectDB()
    console.log("Database connection successful")

    // Check if user already exists
    console.log("Checking for existing user...")
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { username }],
    })
    console.log("Existing user check result:", existingUser ? "User exists" : "No existing user")

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    console.log("Creating new user...")
    const result = await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      lastActive: new Date(),
    })
    console.log("User creation result:", result ? "Success" : "Failed")

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
    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json({ 
      error: "Registration failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
