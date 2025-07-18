import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectDB()

    // Find room and populate members
    const room = await db
      .collection("rooms")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "_id",
            as: "members",
            pipeline: [{ $project: { username: 1, email: 1 } }],
          },
        },
      ])
      .toArray()

    if (!room || room.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    const roomData = room[0]

    // Check if user is a member
    const isMember = roomData.members.some((member: any) => member._id.toString() === user.userId)

    if (!isMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json({ room: roomData })
  } catch (error) {
    console.error("Fetch room error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
