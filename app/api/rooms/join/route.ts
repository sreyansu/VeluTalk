import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { inviteCode } = await request.json()

    if (!inviteCode || inviteCode.trim().length === 0) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 })
    }

    const { db } = await connectDB()

    // Find room by invite code
    const room = await db.collection("rooms").findOne({
      inviteCode: inviteCode.trim().toUpperCase(),
    })

    if (!room) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 })
    }

    const userId = new ObjectId(user.userId)

    // Check if user is already a member
    if (room.members.some((memberId: ObjectId) => memberId.equals(userId))) {
      return NextResponse.json({ error: "You are already a member of this room" }, { status: 400 })
    }

    // Check room capacity (50 users max)
    if (room.members.length >= 50) {
      return NextResponse.json({ error: "Room is full (maximum 50 members)" }, { status: 400 })
    }

    // Add user to room
    await db.collection("rooms").updateOne(
      { _id: room._id },
      {
        $push: { members: userId },
        $set: { updatedAt: new Date() },
      },
    )

    return NextResponse.json({
      message: "Successfully joined room",
      room: {
        _id: room._id,
        name: room.name,
        description: room.description,
      },
    })
  } catch (error) {
    console.error("Join room error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
