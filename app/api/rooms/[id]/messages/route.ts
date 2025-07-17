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

    // Check if user is a member of the room
    const room = await db.collection("rooms").findOne({
      _id: new ObjectId(params.id),
      members: new ObjectId(user.userId),
    })

    if (!room) {
      return NextResponse.json({ error: "Room not found or access denied" }, { status: 404 })
    }

    // Get messages with sender information
    const messages = await db
      .collection("messages")
      .aggregate([
        { $match: { roomId: new ObjectId(params.id) } },
        { $sort: { timestamp: 1 } },
        { $limit: 100 }, // Limit to last 100 messages
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "sender",
            pipeline: [{ $project: { username: 1 } }],
          },
        },
        {
          $unwind: "$sender",
        },
      ])
      .toArray()

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Fetch messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
