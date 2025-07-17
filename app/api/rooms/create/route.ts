import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 })
    }

    const { db } = await connectDB()

    // Generate unique invite code
    let inviteCode: string
    let isUnique = false

    do {
      inviteCode = generateInviteCode()
      const existingRoom = await db.collection("rooms").findOne({ inviteCode })
      isUnique = !existingRoom
    } while (!isUnique)

    // Create room
    const result = await db.collection("rooms").insertOne({
      name: name.trim(),
      description: description?.trim() || "",
      inviteCode,
      createdBy: new ObjectId(user.userId),
      members: [new ObjectId(user.userId)],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const room = await db.collection("rooms").findOne({ _id: result.insertedId })

    return NextResponse.json({
      message: "Room created successfully",
      room,
    })
  } catch (error) {
    console.error("Create room error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
